#!/usr/bin/env node

const { validateFile, findConfigFile } = require('./index');

const args = process.argv.slice(2);
let configPath = args[0];

if (!configPath) {
  configPath = findConfigFile();
  if (!configPath) {
    console.error('No config file found. Provide a path or ensure ~/.openclaw/openclaw.json exists.');
    process.exit(1);
  }
}

console.log(`Validating: ${configPath}\n`);

const result = validateFile(configPath);

if (result.errors.length > 0) {
  console.log('❌ Errors:');
  for (const error of result.errors) {
    console.log(`   • ${error}`);
  }
  console.log('');
}

if (result.warnings.length > 0) {
  console.log('⚠️  Warnings:');
  for (const warning of result.warnings) {
    console.log(`   • ${warning}`);
  }
  console.log('');
}

if (result.valid) {
  console.log('✅ Config is valid');
  if (result.warnings.length === 0) {
    console.log('   No warnings');
  }
} else {
  console.log('❌ Config has errors');
  process.exit(1);
}
