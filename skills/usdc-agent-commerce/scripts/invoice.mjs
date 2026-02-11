#!/usr/bin/env node
/**
 * Create and manage USDC invoices for agent services
 * 
 * Usage: 
 *   node invoice.mjs create --amount 5 --memo "Weather data subscription"
 *   node invoice.mjs list
 *   node invoice.mjs check --id <invoice_id>
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const USDC_CONTRACTS = {
  'base': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
};

const RPC_ENDPOINTS = {
  'base': 'https://mainnet.base.org',
  'base-sepolia': 'https://sepolia.base.org'
};

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function decimals() view returns (uint8)'
];

function getInvoicesPath() {
  const dir = path.join(__dirname, '..', '.secrets');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'invoices.json');
}

function loadInvoices() {
  const p = getInvoicesPath();
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveInvoices(invoices) {
  fs.writeFileSync(getInvoicesPath(), JSON.stringify(invoices, null, 2));
}

function loadWallet() {
  const walletPath = path.join(__dirname, '..', '.secrets', 'wallet.json');
  return JSON.parse(fs.readFileSync(walletPath, 'utf8'));
}

async function createInvoice(amount, memo, network = 'base-sepolia', expiresHours = 24) {
  const wallet = loadWallet();
  const invoiceId = crypto.randomBytes(8).toString('hex');
  
  const invoice = {
    id: invoiceId,
    amount: parseFloat(amount),
    currency: 'USDC',
    memo: memo || '',
    recipient: wallet.address,
    network,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expiresHours * 60 * 60 * 1000).toISOString(),
    paidTx: null,
    paidAt: null
  };
  
  const invoices = loadInvoices();
  invoices.push(invoice);
  saveInvoices(invoices);
  
  console.log('\n📄 Invoice Created!\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   Invoice ID: ${invoiceId}`);
  console.log(`   Amount: ${amount} USDC`);
  console.log(`   Memo: ${memo || '(none)'}`);
  console.log(`   Network: ${network}`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`   💳 Pay to: ${wallet.address}`);
  console.log(`   ⏰ Expires: ${invoice.expiresAt}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📋 Share this with the buyer:');
  console.log(`   Amount: ${amount} USDC on ${network}`);
  console.log(`   Address: ${wallet.address}`);
  console.log(`   Reference: ${invoiceId}\n`);
  
  return invoice;
}

async function checkInvoice(invoiceId, network = 'base-sepolia') {
  const invoices = loadInvoices();
  const invoice = invoices.find(i => i.id === invoiceId);
  
  if (!invoice) {
    console.log(`❌ Invoice ${invoiceId} not found`);
    return null;
  }
  
  if (invoice.status === 'paid') {
    console.log(`\n✅ Invoice ${invoiceId} already marked as PAID`);
    console.log(`   TX: ${invoice.paidTx}`);
    return invoice;
  }
  
  // Check on-chain for payment
  console.log(`\n🔍 Checking payment for invoice ${invoiceId}...`);
  
  const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);
  const usdc = new ethers.Contract(USDC_CONTRACTS[network], ERC20_ABI, provider);
  const decimals = await usdc.decimals();
  
  // Look for transfers to our address in recent blocks
  const currentBlock = await provider.getBlockNumber();
  const fromBlock = currentBlock - 1000; // ~30 min of blocks
  
  const filter = usdc.filters.Transfer(null, invoice.recipient);
  const events = await usdc.queryFilter(filter, fromBlock, currentBlock);
  
  const expectedAmount = ethers.parseUnits(invoice.amount.toString(), decimals);
  
  for (const event of events) {
    if (event.args.value >= expectedAmount) {
      // Found payment!
      invoice.status = 'paid';
      invoice.paidTx = event.transactionHash;
      invoice.paidAt = new Date().toISOString();
      invoice.paidFrom = event.args.from;
      invoice.paidAmount = ethers.formatUnits(event.args.value, decimals);
      saveInvoices(invoices);
      
      console.log('\n🎉 ═══════════════════════════════════════════════════════════');
      console.log('   PAYMENT RECEIVED!');
      console.log('   ───────────────────────────────────────────────────────────');
      console.log(`   Amount: ${invoice.paidAmount} USDC`);
      console.log(`   From: ${event.args.from}`);
      console.log(`   TX: ${event.transactionHash}`);
      console.log('   ═══════════════════════════════════════════════════════════\n');
      
      return invoice;
    }
  }
  
  console.log('\n⏳ Payment not yet received');
  console.log(`   Expected: ${invoice.amount} USDC`);
  console.log(`   To: ${invoice.recipient}`);
  console.log(`   Status: ${invoice.status}`);
  
  // Check if expired
  if (new Date(invoice.expiresAt) < new Date()) {
    invoice.status = 'expired';
    saveInvoices(invoices);
    console.log('   ⚠️  Invoice has EXPIRED\n');
  }
  
  return invoice;
}

function listInvoices() {
  const invoices = loadInvoices();
  
  console.log('\n📋 Invoices');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (invoices.length === 0) {
    console.log('No invoices yet. Create one with:');
    console.log('  node invoice.mjs create --amount 5 --memo "Service fee"\n');
    return;
  }
  
  for (const inv of invoices) {
    const statusIcon = inv.status === 'paid' ? '✅' : inv.status === 'expired' ? '❌' : '⏳';
    console.log(`${statusIcon} [${inv.id}] ${inv.amount} USDC - ${inv.memo || '(no memo)'}`);
    console.log(`   Status: ${inv.status} | Created: ${inv.createdAt.split('T')[0]}`);
    if (inv.paidTx) console.log(`   TX: ${inv.paidTx.slice(0, 20)}...`);
    console.log('───────────────────────────────────────────────────────────────');
  }
}

// Parse CLI args
const args = process.argv.slice(2);
const command = args[0];

let amount, memo, invoiceId, network = 'base-sepolia';

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--amount' && args[i + 1]) amount = args[++i];
  if (args[i] === '--memo' && args[i + 1]) memo = args[++i];
  if (args[i] === '--id' && args[i + 1]) invoiceId = args[++i];
  if (args[i] === '--network' && args[i + 1]) network = args[++i];
}

switch (command) {
  case 'create':
    if (!amount) {
      console.error('Usage: node invoice.mjs create --amount <USDC> [--memo "description"]');
      process.exit(1);
    }
    createInvoice(amount, memo, network).catch(console.error);
    break;
  case 'check':
    if (!invoiceId) {
      console.error('Usage: node invoice.mjs check --id <invoice_id>');
      process.exit(1);
    }
    checkInvoice(invoiceId, network).catch(console.error);
    break;
  case 'list':
    listInvoices();
    break;
  default:
    console.log('USDC Invoice Manager\n');
    console.log('Commands:');
    console.log('  create  --amount <USDC> [--memo "desc"]  Create new invoice');
    console.log('  list                                      List all invoices');
    console.log('  check   --id <invoice_id>                 Check payment status');
}
