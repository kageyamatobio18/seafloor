#!/usr/bin/env node
/**
 * First Day Diagnostic - Check what's available for a new agent
 * 
 * Usage: node diagnose.mjs [--category <cat>] [--json]
 * Categories: all, messaging, tools, storage, social, blockers
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { homedir } from 'os';

const args = process.argv.slice(2);
const category = args.includes('--category') ? args[args.indexOf('--category') + 1] : 'all';
const jsonOutput = args.includes('--json');

const results = {
  timestamp: new Date().toISOString(),
  environment: {},
  channels: {},
  tools: {},
  storage: {},
  social: {},
  blockers: [],
  quickWins: []
};

// Helper to check command existence
function commandExists(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Helper to run command and get output
function runCommand(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', timeout: 10000 }).toString().trim();
  } catch {
    return null;
  }
}

// Check messaging channels
function checkMessaging() {
  const configPaths = [
    '/data/openclaw.json',
    `${homedir()}/.openclaw/openclaw.json`,
    './openclaw.json'
  ];
  
  let config = null;
  for (const path of configPaths) {
    if (existsSync(path)) {
      try {
        config = JSON.parse(readFileSync(path, 'utf8'));
        break;
      } catch {}
    }
  }
  
  if (!config) {
    results.channels.status = 'unknown';
    results.channels.note = 'Could not find openclaw.json';
    return;
  }
  
  const channels = config.channels || {};
  
  // Check each channel type
  const channelTypes = ['telegram', 'discord', 'whatsapp', 'slack', 'signal'];
  
  for (const type of channelTypes) {
    if (channels[type]) {
      const ch = channels[type];
      results.channels[type] = {
        configured: true,
        enabled: ch.enabled !== false,
        hasToken: !!(ch.token || ch.botToken)
      };
    } else {
      results.channels[type] = { configured: false };
    }
  }
}

// Check tools availability
function checkTools() {
  // Git
  const gitUser = runCommand('git config user.name');
  const gitEmail = runCommand('git config user.email');
  results.tools.git = {
    available: commandExists('git'),
    configured: !!(gitUser && gitEmail),
    user: gitUser,
    email: gitEmail
  };
  
  // Node
  const nodeVersion = runCommand('node --version');
  results.tools.node = {
    available: !!nodeVersion,
    version: nodeVersion
  };
  
  // Check for common CLIs
  const clis = ['curl', 'jq', 'ffmpeg', 'gh'];
  results.tools.clis = {};
  for (const cli of clis) {
    results.tools.clis[cli] = commandExists(cli);
  }
}

// Check storage/workspace
function checkStorage() {
  const workspace = process.cwd();
  results.storage.workspace = workspace;
  
  // Check key directories
  const dirs = ['memory', 'skills', 'projects', '.secrets', '.budget'];
  results.storage.directories = {};
  
  for (const dir of dirs) {
    const path = `${workspace}/${dir}`;
    results.storage.directories[dir] = existsSync(path);
  }
  
  // Count files
  if (existsSync(`${workspace}/memory`)) {
    try {
      const files = readdirSync(`${workspace}/memory`);
      results.storage.memoryFiles = files.length;
    } catch {
      results.storage.memoryFiles = 0;
    }
  }
  
  if (existsSync(`${workspace}/skills`)) {
    try {
      const skills = readdirSync(`${workspace}/skills`);
      results.storage.skillCount = skills.filter(s => !s.startsWith('.')).length;
    } catch {
      results.storage.skillCount = 0;
    }
  }
}

// Check social presence
function checkSocial() {
  // Nostr
  const nostrSecretPath = `${process.cwd()}/.secrets/nostr.json`;
  if (existsSync(nostrSecretPath)) {
    try {
      const nostr = JSON.parse(readFileSync(nostrSecretPath, 'utf8'));
      results.social.nostr = {
        configured: true,
        npub: nostr.npub
      };
    } catch {
      results.social.nostr = { configured: false };
    }
  } else {
    results.social.nostr = { configured: false };
  }
  
  // Crypto wallet
  const walletPath = `${process.cwd()}/.secrets/wallet.json`;
  if (existsSync(walletPath)) {
    try {
      const wallet = JSON.parse(readFileSync(walletPath, 'utf8'));
      results.social.cryptoWallet = {
        configured: true,
        address: wallet.address
      };
    } catch {
      results.social.cryptoWallet = { configured: false };
    }
  } else {
    results.social.cryptoWallet = { configured: false };
  }
}

// Detect blockers
function detectBlockers() {
  // Check for common blocker patterns
  
  // Missing web search API key
  if (!process.env.BRAVE_API_KEY) {
    results.blockers.push({
      id: 'web_search',
      title: 'Web search unavailable',
      reason: 'BRAVE_API_KEY not configured',
      workaround: 'Use web_fetch for specific URLs you already know',
      severity: 'medium'
    });
  }
  
  // Browser tool often not available in containers
  results.blockers.push({
    id: 'browser_auth',
    title: 'Browser-based auth services',
    reason: 'Many services (ClawHub, Vercel, GitHub OAuth) need browser login',
    workaround: 'Use auth-free alternatives like catbox.moe for hosting, Nostr for social',
    severity: 'medium'
  });
  
  // ClawHub needs old GitHub
  results.blockers.push({
    id: 'clawhub',
    title: 'ClawHub skill publishing',
    reason: 'Requires GitHub account older than 7 days',
    workaround: 'Build skills locally, document for later publishing',
    severity: 'low'
  });
  
  // X/Twitter often blocks new automation
  results.blockers.push({
    id: 'twitter',
    title: 'X/Twitter automation',
    reason: 'New accounts often flagged for "automated activity"',
    workaround: 'Wait for cooldown, use Nostr as decentralized alternative',
    severity: 'low'
  });
}

// Generate quick wins
function generateQuickWins() {
  // Check what's available and suggest wins
  
  if (results.tools.git?.configured) {
    results.quickWins.push({
      id: 'git_commits',
      title: 'Track your work with git',
      description: 'Commit your changes regularly - creates a permanent record',
      effort: 'low'
    });
  }
  
  if (!results.storage.directories?.memory) {
    results.quickWins.push({
      id: 'setup_memory',
      title: 'Create memory directory',
      description: 'mkdir -p memory && touch memory/$(date +%Y-%m-%d).md',
      effort: 'low'
    });
  }
  
  if (!results.social.nostr?.configured) {
    results.quickWins.push({
      id: 'setup_nostr',
      title: 'Create Nostr identity',
      description: 'Decentralized social - no account approval needed',
      effort: 'low'
    });
  }
  
  results.quickWins.push({
    id: 'build_skill',
    title: 'Build one useful skill',
    description: 'Skills work locally even without ClawHub publishing',
    effort: 'medium'
  });
  
  results.quickWins.push({
    id: 'deploy_catbox',
    title: 'Deploy a web page to catbox.moe',
    description: 'Auth-free static hosting - just curl a file',
    effort: 'low'
  });
}

// Run all checks
function runDiagnostic() {
  console.log('🔍 Running First Day Diagnostic...\n');
  
  if (category === 'all' || category === 'messaging') checkMessaging();
  if (category === 'all' || category === 'tools') checkTools();
  if (category === 'all' || category === 'storage') checkStorage();
  if (category === 'all' || category === 'social') checkSocial();
  if (category === 'all' || category === 'blockers') detectBlockers();
  if (category === 'all') generateQuickWins();
  
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }
  
  // Pretty print results
  
  // Channels
  if (category === 'all' || category === 'messaging') {
    console.log('📱 Messaging Channels');
    console.log('====================');
    for (const [name, status] of Object.entries(results.channels)) {
      if (name === 'status' || name === 'note') continue;
      if (status.configured && status.enabled) {
        console.log(`✅ ${name}: Configured and enabled`);
      } else if (status.configured) {
        console.log(`⚠️  ${name}: Configured but disabled`);
      } else {
        console.log(`❌ ${name}: Not configured`);
      }
    }
    console.log('');
  }
  
  // Tools
  if (category === 'all' || category === 'tools') {
    console.log('🔧 Tools');
    console.log('========');
    if (results.tools.git) {
      const git = results.tools.git;
      if (git.configured) {
        console.log(`✅ Git: Configured (${git.user} <${git.email}>)`);
      } else if (git.available) {
        console.log('⚠️  Git: Available but not configured');
      } else {
        console.log('❌ Git: Not available');
      }
    }
    if (results.tools.node) {
      console.log(`✅ Node.js: ${results.tools.node.version}`);
    }
    if (results.tools.clis) {
      for (const [cli, available] of Object.entries(results.tools.clis)) {
        console.log(`${available ? '✅' : '❌'} ${cli}: ${available ? 'Available' : 'Not found'}`);
      }
    }
    console.log('');
  }
  
  // Storage
  if (category === 'all' || category === 'storage') {
    console.log('📁 Storage');
    console.log('==========');
    console.log(`Workspace: ${results.storage.workspace}`);
    if (results.storage.directories) {
      for (const [dir, exists] of Object.entries(results.storage.directories)) {
        console.log(`${exists ? '✅' : '❌'} ${dir}/`);
      }
    }
    if (results.storage.memoryFiles !== undefined) {
      console.log(`Memory files: ${results.storage.memoryFiles}`);
    }
    if (results.storage.skillCount !== undefined) {
      console.log(`Skills: ${results.storage.skillCount}`);
    }
    console.log('');
  }
  
  // Social
  if (category === 'all' || category === 'social') {
    console.log('🌐 Social Presence');
    console.log('==================');
    if (results.social.nostr?.configured) {
      console.log(`✅ Nostr: ${results.social.nostr.npub}`);
    } else {
      console.log('❌ Nostr: Not configured');
    }
    if (results.social.cryptoWallet?.configured) {
      console.log(`✅ Crypto: ${results.social.cryptoWallet.address}`);
    } else {
      console.log('❌ Crypto: No wallet');
    }
    console.log('');
  }
  
  // Blockers
  if (category === 'all' || category === 'blockers') {
    console.log('🚧 Common Blockers');
    console.log('==================');
    for (const blocker of results.blockers) {
      console.log(`⚠️  ${blocker.title}`);
      console.log(`   Reason: ${blocker.reason}`);
      console.log(`   Workaround: ${blocker.workaround}`);
      console.log('');
    }
  }
  
  // Quick Wins
  if (category === 'all') {
    console.log('✨ Quick Wins');
    console.log('=============');
    for (const win of results.quickWins) {
      console.log(`□ ${win.title}`);
      console.log(`  ${win.description}`);
      console.log(`  Effort: ${win.effort}`);
      console.log('');
    }
  }
}

runDiagnostic();
