#!/usr/bin/env node
/**
 * SmartShaadi — Global www Fix Script
 * File: scripts/fix-www.js
 *
 * Ek baar chalao — sari .html files mein www.smartshaadi.online
 * ko smartshaadi.online se replace kar dega.
 *
 * Run: node scripts/fix-www.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = process.cwd(); // Repo root

// Scan all .html files recursively
function getAllHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', '.github'].includes(entry.name)) {
      results = results.concat(getAllHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const files = getAllHtmlFiles(ROOT);
console.log(`\n🔍 Scanning ${files.length} HTML files...\n`);

let totalFixed = 0;
let totalFiles = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf-8');

  // Count www occurrences before fix
  const wwwCount = (original.match(/www\.smartshaadi\.online/g) || []).length;

  if (wwwCount === 0) continue; // Skip clean files

  // THE FIX — 3 patterns cover everything
  let fixed = original
    .replace(/https:\/\/www\.smartshaadi\.online/g, 'https://smartshaadi.online')
    .replace(/http:\/\/www\.smartshaadi\.online/g,  'https://smartshaadi.online')
    .replace(/http:\/\/smartshaadi\.online/g,        'https://smartshaadi.online');

  // Verify zero www remaining
  const remaining = (fixed.match(/www\.smartshaadi\.online/g) || []).length;

  fs.writeFileSync(filePath, fixed, 'utf-8');

  const relPath = path.relative(ROOT, filePath);
  console.log(`✅ ${relPath} — fixed ${wwwCount} occurrence(s)${remaining > 0 ? ` ⚠️  ${remaining} display-text remaining` : ''}`);

  totalFixed += wwwCount;
  totalFiles++;
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Done! ${totalFiles} files fixed, ${totalFixed} total replacements`);

if (totalFiles === 0) {
  console.log('🎉 All files already clean — no www found!');
}
