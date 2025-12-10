#!/usr/bin/env node

/**
 * Migration Runner Script
 * Chạy các migration scripts trong thư mục migrations/
 *
 * Usage:
 *   npm run migration:run seed-tier-config
 *   npm run migration:run add-tier-to-users
 */

const { spawn } = require('child_process');
const path = require('path');

// Lấy tên migration từ command line arguments
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Error: Migration name is required');
  console.log('\nUsage:');
  console.log('  npm run migration:run <migration-name>');
  console.log('\nAvailable migrations:');
  console.log('  - seed-tier-config       : Seed default tier configurations');
  console.log('  - add-tier-to-users      : Add tier field to existing users');
  process.exit(1);
}

// Build đường dẫn tới migration file
const migrationPath = path.join(
  __dirname,
  '..',
  'dist',
  'migrations',
  `${migrationName}.js`,
);

console.log(`🚀 Running migration: ${migrationName}`);
console.log(`📁 Path: ${migrationPath}\n`);

// Chạy migration
const child = spawn('node', [migrationPath], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

child.on('error', (error) => {
  console.error(`❌ Failed to run migration: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log(`\n✅ Migration completed successfully!`);
  } else {
    console.error(`\n❌ Migration failed with exit code ${code}`);
  }
  process.exit(code);
});
