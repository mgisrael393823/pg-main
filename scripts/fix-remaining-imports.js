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
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== '.next') {
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

// Convert relative imports to alias imports - handle all cases
function convertToAliasImport(content, filePath) {
  let modified = content;
  let hasChanges = false;
  
  // Pattern for any relative import from parent directory (../)
  const relativePattern = /from\s+['"](\.\.\/[^'"]+)['"]/g;
  
  modified = modified.replace(relativePattern, (match, importPath) => {
    // Extract the parts of the import path
    const parts = importPath.split('/');
    
    // Look for known folders that should use aliases
    for (let i = 0; i < parts.length; i++) {
      if (['components', 'utils', 'lib', 'types', 'providers', 'ui'].includes(parts[i])) {
        // Check if this is a subfolder import (like ../ui/card)
        if (parts[i] === 'ui' || parts[i] === 'providers') {
          // For UI and providers, they're subfolders of components
          const restPath = parts.slice(i).join('/');
          hasChanges = true;
          return `from '@/components/${restPath}'`;
        } else {
          // For top-level folders
          const restPath = parts.slice(i).join('/');
          hasChanges = true;
          return `from '@/${restPath}'`;
        }
      }
    }
    
    return match;
  });
  
  return { content: modified, hasChanges };
}

// Main function
function fixRemainingImports() {
  console.log('Starting final import fix...\n');
  
  const projectRoot = process.cwd();
  const appDir = path.join(projectRoot, 'app');
  
  if (!fs.existsSync(appDir)) {
    console.error('Error: app directory not found. Please run this script from the project root.');
    process.exit(1);
  }
  
  const files = findFiles(appDir);
  console.log(`Found ${files.length} files to check.\n`);
  
  let updatedCount = 0;
  const updates = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { content: newContent, hasChanges } = convertToAliasImport(content, file);
      
      if (hasChanges) {
        fs.writeFileSync(file, newContent, 'utf8');
        const relativePath = path.relative(projectRoot, file);
        console.log(`✓ Updated: ${relativePath}`);
        updates.push(relativePath);
        updatedCount++;
      }
    } catch (err) {
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }
  
  console.log(`\nCompleted! Updated ${updatedCount} files.`);
  
  if (updatedCount > 0) {
    console.log('\nFiles updated:');
    updates.forEach(file => console.log(`  - ${file}`));
  }
}

// Run the script
fixRemainingImports();
