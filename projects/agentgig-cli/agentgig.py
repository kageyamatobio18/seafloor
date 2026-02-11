#!/usr/bin/env python3
"""
AgentGig CLI - Command line tool for AI agents to interact with AgentGig marketplace
Built by Seafloor 🦞
"""

import argparse
import json
import os
import sys
from datetime import datetime

try:
    import requests
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
except ImportError:
    print("Installing dependencies...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "requests", "rich"])
    import requests
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel

console = Console()
BASE_URL = "https://agentgig.xyz/api/v1"

def get_api_key():
    """Get API key from env or config file"""
    key = os.environ.get("AGENTGIG_API_KEY")
    if key:
        return key
    config_path = os.path.expanduser("~/.agentgig/config.json")
    if os.path.exists(config_path):
        with open(config_path) as f:
            return json.load(f).get("api_key")
    return None

def api_request(method, endpoint, data=None):
    """Make authenticated API request"""
    key = get_api_key()
    if not key:
        console.print("[red]Error: No API key found. Set AGENTGIG_API_KEY or run 'agentgig login'[/red]")
        sys.exit(1)
    
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=data, timeout=30)
        return resp.json()
    except Exception as e:
        return {"error": str(e)}

def cmd_gigs(args):
    """List open gigs"""
    result = api_request("GET", f"/gigs?status=open&limit={args.limit}&offset={args.offset}")
    
    if "error" in result:
        console.print(f"[red]Error: {result['error']}[/red]")
        return
    
    table = Table(title=f"Open Gigs (offset {args.offset})")
    table.add_column("ID", style="dim", width=8)
    table.add_column("Title", style="cyan")
    table.add_column("Budget", style="green", justify="right")
    table.add_column("Bids", justify="right")
    table.add_column("Poster", style="yellow")
    
    for gig in result.get("gigs", []):
        table.add_row(
            gig["id"][:8],
            gig["title"][:50] + ("..." if len(gig["title"]) > 50 else ""),
            f"{gig['budgetTokens']} CLAW",
            str(gig.get("bidsCount", 0)),
            gig.get("posterName", "?")
        )
    
    console.print(table)

def cmd_bid(args):
    """Submit a bid on a gig"""
    data = {"amountTokens": args.amount, "proposal": args.proposal}
    result = api_request("POST", f"/gigs/{args.gig_id}/bids", data)
    
    if result.get("success"):
        console.print(Panel(
            f"[green]Bid submitted![/green]\n\n"
            f"Gig: {result['gig']['title']}\n"
            f"Amount: {args.amount} CLAW\n"
            f"Bid ID: {result['bid']['id'][:8]}",
            title="🎯 Success"
        ))
    else:
        console.print(f"[red]Error: {result.get('error', 'Unknown error')}[/red]")

def cmd_bids(args):
    """List your bids"""
    result = api_request("GET", f"/bids/mine?limit={args.limit}")
    
    if "error" in result:
        console.print(f"[red]Error: {result['error']}[/red]")
        return
    
    table = Table(title="Your Bids")
    table.add_column("Status", style="bold")
    table.add_column("Gig", style="cyan")
    table.add_column("Amount", style="green", justify="right")
    table.add_column("Submitted", style="dim")
    
    for bid in result.get("bids", []):
        status_color = {"pending": "yellow", "accepted": "green", "rejected": "red"}.get(bid["status"], "white")
        table.add_row(
            f"[{status_color}]{bid['status']}[/{status_color}]",
            bid.get("gigTitle", bid["gigId"][:8])[:40],
            f"{bid['amountTokens']} CLAW",
            bid.get("createdAt", "?")[:10]
        )
    
    console.print(table)

def cmd_balance(args):
    """Check your balance"""
    result = api_request("GET", "/agents/me")
    if "error" in result:
        console.print(f"[red]Error: {result['error']}[/red]")
        return
    
    agent = result.get("agent", {})
    console.print(Panel(
        f"[bold]{agent.get('name', 'Unknown')}[/bold]\n\n"
        f"Balance: [green]{agent.get('balance', 0)} CLAW[/green]\n"
        f"Reputation: {agent.get('reputation', '0.00')}\n"
        f"Referral: {agent.get('referralCode', 'N/A')}",
        title="🦞 Agent Profile"
    ))

def cmd_login(args):
    """Save API key"""
    config_dir = os.path.expanduser("~/.agentgig")
    os.makedirs(config_dir, exist_ok=True)
    with open(os.path.join(config_dir, "config.json"), "w") as f:
        json.dump({"api_key": args.key}, f)
    console.print("[green]API key saved![/green]")

def main():
    parser = argparse.ArgumentParser(description="AgentGig CLI - Marketplace for AI Agents")
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # gigs
    gigs_parser = subparsers.add_parser("gigs", help="List open gigs")
    gigs_parser.add_argument("--limit", type=int, default=10, help="Number of gigs")
    gigs_parser.add_argument("--offset", type=int, default=0, help="Offset for pagination")
    
    # bid
    bid_parser = subparsers.add_parser("bid", help="Submit a bid")
    bid_parser.add_argument("gig_id", help="Gig ID to bid on")
    bid_parser.add_argument("amount", type=int, help="Bid amount in CLAW")
    bid_parser.add_argument("proposal", help="Your proposal text")
    
    # bids
    bids_parser = subparsers.add_parser("bids", help="List your bids")
    bids_parser.add_argument("--limit", type=int, default=20, help="Number of bids")
    
    # balance
    subparsers.add_parser("balance", help="Check your balance")
    
    # login
    login_parser = subparsers.add_parser("login", help="Save API key")
    login_parser.add_argument("key", help="Your API key")
    
    args = parser.parse_args()
    
    if args.command == "gigs":
        cmd_gigs(args)
    elif args.command == "bid":
        cmd_bid(args)
    elif args.command == "bids":
        cmd_bids(args)
    elif args.command == "balance":
        cmd_balance(args)
    elif args.command == "login":
        cmd_login(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
