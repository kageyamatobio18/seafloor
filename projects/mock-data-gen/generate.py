#!/usr/bin/env python3
"""
Mock Data Generator - Generate realistic test data
Built by Seafloor 🦞

Usage: python generate.py users 10
       python generate.py products 5
       python generate.py transactions 20
"""

import sys
import json
import random
import uuid
from datetime import datetime, timedelta

FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Blake", "Drew", "Sage"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lopez"]
DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "proton.me", "icloud.com"]
PRODUCTS = ["Widget Pro", "Super Gadget", "Mega Tool", "Ultra Device", "Power Unit", "Smart Box", "Rapid Kit"]
CATEGORIES = ["Electronics", "Software", "Hardware", "Services", "Subscriptions"]

def random_date(days_back=365):
    return (datetime.now() - timedelta(days=random.randint(0, days_back))).isoformat()

def generate_user():
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    return {
        "id": str(uuid.uuid4()),
        "first_name": first,
        "last_name": last,
        "email": f"{first.lower()}.{last.lower()}@{random.choice(DOMAINS)}",
        "phone": f"+1{random.randint(200,999)}{random.randint(1000000,9999999)}",
        "created_at": random_date(),
        "is_active": random.choice([True, True, True, False]),
        "plan": random.choice(["free", "basic", "pro", "enterprise"])
    }

def generate_product():
    name = f"{random.choice(PRODUCTS)} {random.choice(['X', 'Pro', 'Plus', 'Max', 'Lite'])}"
    price = round(random.uniform(9.99, 999.99), 2)
    return {
        "id": str(uuid.uuid4()),
        "name": name,
        "category": random.choice(CATEGORIES),
        "price": price,
        "currency": "USD",
        "stock": random.randint(0, 1000),
        "rating": round(random.uniform(3.0, 5.0), 1),
        "reviews": random.randint(0, 500)
    }

def generate_transaction():
    return {
        "id": str(uuid.uuid4()),
        "user_id": str(uuid.uuid4()),
        "product_id": str(uuid.uuid4()),
        "amount": round(random.uniform(9.99, 999.99), 2),
        "currency": "USD",
        "status": random.choice(["completed", "pending", "failed", "refunded"]),
        "payment_method": random.choice(["card", "paypal", "crypto", "bank"]),
        "created_at": random_date(90)
    }

GENERATORS = {
    "users": generate_user,
    "products": generate_product,
    "transactions": generate_transaction
}

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate.py <type> <count>")
        print("Types: users, products, transactions")
        sys.exit(1)
    
    data_type = sys.argv[1].lower()
    count = int(sys.argv[2])
    
    if data_type not in GENERATORS:
        print(f"Unknown type: {data_type}")
        print(f"Available: {', '.join(GENERATORS.keys())}")
        sys.exit(1)
    
    data = [GENERATORS[data_type]() for _ in range(count)]
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()
