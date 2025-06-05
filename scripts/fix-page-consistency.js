#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Replacements to make across all pages
const replacements = [
  // Fix padding wrapper
  { from: '<div className="h-full">', to: '<div className="h-full p-8">' },
  
  // Fix color classes
  { from: 'text-foreground-muted', to: 'text-neutral-medium' },
  { from: 'text-foreground-secondary', to: 'text-neutral-medium' },
  { from: 'text-foreground', to: 'text-primary' },
  { from: 'bg-background', to: 'bg-secondary' },
  { from: 'border-border', to: 'border-neutral-medium/20' },
  
  // Fix component imports that should use design system
  { from: 'className="toggle"', to: 'className="h-5 w-5 rounded-full"' },
];

// Pages to update
const pagesToUpdate = [
  '/app/(dashboard)/contacts/page.tsx',
  '/app/(dashboard)/properties/page.tsx',
  '/app/(dashboard)/alerts/page.tsx',
  '/app/(dashboard)/analytics/page.tsx',
  '/app/(dashboard)/upload/page.tsx',
  '/app/(dashboard)/settings/page.tsx',
];

function updateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;
  
  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } else {
    console.log(`✗ No changes needed: ${filePath}`);
  }
}

console.log('Fixing page consistency issues...\n');

pagesToUpdate.forEach(updateFile);

console.log('\nDone! All pages have been updated for consistency.');
