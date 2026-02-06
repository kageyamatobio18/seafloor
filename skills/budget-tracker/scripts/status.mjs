#!/usr/bin/env node
/**
 * Check budget status
 * Usage: node status.mjs [--budget-dir ".budget"]
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
let budgetDir = '.budget';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--budget-dir' && args[i + 1]) {
    budgetDir = args[++i];
  }
}

// Load config
const configPath = join(budgetDir, 'config.json');
if (!existsSync(configPath)) {
  console.error(`❌ Budget not configured. Create ${configPath} first.`);
  console.error('\nExample:');
  console.error(`mkdir -p ${budgetDir}`);
  console.error(`echo '{"initialBudget":75,"currency":"USD","startDate":"2026-02-06"}' > ${configPath}`);
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));

// Load expenses
const expensesPath = join(budgetDir, 'expenses.jsonl');
let expenses = [];
if (existsSync(expensesPath)) {
  expenses = readFileSync(expensesPath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

// Load income
const incomePath = join(budgetDir, 'income.jsonl');
let income = [];
if (existsSync(incomePath)) {
  income = readFileSync(incomePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

// Calculate totals
const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
const remaining = config.initialBudget + totalIncome - totalExpenses;

// Calculate daily stats
const startDate = new Date(config.startDate);
const now = new Date();
const daysElapsed = Math.max(1, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)));
const dailyBurn = totalExpenses / daysElapsed;
const daysRemaining = remaining / dailyBurn;

// Group expenses by category
const byCategory = expenses.reduce((acc, e) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {});

// Output
console.log('💰 Budget Status');
console.log('═══════════════════════════════════════');
console.log(`📅 Started: ${config.startDate}`);
console.log(`📆 Days elapsed: ${daysElapsed}`);
console.log('───────────────────────────────────────');
console.log(`💵 Initial budget: ${config.currency} ${config.initialBudget.toFixed(2)}`);
console.log(`📈 Total income:   ${config.currency} ${totalIncome.toFixed(2)}`);
console.log(`📉 Total expenses: ${config.currency} ${totalExpenses.toFixed(2)}`);
console.log(`💎 Remaining:      ${config.currency} ${remaining.toFixed(2)}`);
console.log('───────────────────────────────────────');
console.log(`🔥 Daily burn rate: ${config.currency} ${dailyBurn.toFixed(2)}/day`);
console.log(`⏳ Days remaining:  ${isFinite(daysRemaining) ? daysRemaining.toFixed(1) : '∞'} days`);

if (Object.keys(byCategory).length > 0) {
  console.log('───────────────────────────────────────');
  console.log('📊 Expenses by category:');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, amount]) => {
      const pct = ((amount / totalExpenses) * 100).toFixed(0);
      console.log(`   ${cat}: ${config.currency} ${amount.toFixed(2)} (${pct}%)`);
    });
}

console.log('═══════════════════════════════════════');

// Alerts
if (config.alerts?.lowBudget && remaining < config.alerts.lowBudget) {
  console.log(`\n⚠️  LOW BUDGET ALERT: Below ${config.currency} ${config.alerts.lowBudget}!`);
}

if (daysRemaining < 2 && daysRemaining > 0) {
  console.log(`\n🚨 CRITICAL: Less than 2 days of budget remaining!`);
}
