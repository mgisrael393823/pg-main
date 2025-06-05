#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, ext = ['.ts', '.tsx', '.js', '.jsx']) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(findFiles(fullPath, ext));
      } else if (stat.isFile() && ext.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  
  return files;
}

// Convert relative imports to alias imports
function convertToAliasImport(content, filePath) {
  const appDir = path.join(process.cwd(), 'app');
  const fileDir = path.dirname(filePath);
  
  // Pattern to match relative imports
  const importPattern = /from\s+['"](\.\.[\/\\]+)(components|utils|lib|types)([\/\\][^'"]*)?['"]/g;
  
  let modified = content;
  let hasChanges = false;
  
  modified = content.replace(importPattern, (match, dots, folder, rest = '') => {
    hasChanges = true;
    return `from '@/${folder}${rest}'`;
  });
  
  // Also fix imports that use '../app/components' pattern
  const appImportPattern = /from\s+['"](\.\.[\/\\]+)app[\/\\](components|utils|lib|types)([\/\\][^'"]*)?['"]/g;
  modified = modified.replace(appImportPattern, (match, dots, folder, rest = '') => {
    hasChanges = true;
    return `from '@/${folder}${rest}'`;
  });
  
  return { content: modified, hasChanges };
}

// Main function
function fixImports() {
  console.log('Starting import fix...\n');
  
  const projectRoot = process.cwd();
  const appDir = path.join(projectRoot, 'app');
  
  if (!fs.existsSync(appDir)) {
    console.error('Error: app directory not found. Please run this script from the project root.');
    process.exit(1);
  }
  
  const files = findFiles(appDir);
  console.log(`Found ${files.length} files to check.\n`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { content: newContent, hasChanges } = convertToAliasImport(content, file);
      
      if (hasChanges) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`✓ Updated: ${path.relative(projectRoot, file)}`);
        updatedCount++;
      }
    } catch (err) {
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} files.`);
}

// Run the script
fixImports();
