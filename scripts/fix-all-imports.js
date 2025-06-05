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

// Convert relative imports to alias imports
function convertToAliasImport(content, filePath) {
  let modified = content;
  let hasChanges = false;
  
  // Pattern 1: Fix ../utils, ../components etc
  const pattern1 = /from\s+['"](\.\.\/)+(?:app\/)?(components|utils|lib|types)([\/\\][^'"]*)?['"]/g;
  modified = modified.replace(pattern1, (match, dots, folder, rest = '') => {
    hasChanges = true;
    return `from '@/${folder}${rest}'`;
  });
  
  // Pattern 2: Fix ../../types/index pattern
  const pattern2 = /from\s+['"](\.\.\/)+types([\/\\][^'"]*)?['"]/g;
  modified = modified.replace(pattern2, (match, dots, rest = '') => {
    hasChanges = true;
    return `from '@/types${rest}'`;
  });
  
  // Pattern 3: Fix imports that go up multiple levels (../../../)
  const pattern3 = /from\s+['"]\.\.\/\.\.\/\.\.\/(types)([\/\\][^'"]*)?['"]/g;
  modified = modified.replace(pattern3, (match, folder, rest = '') => {
    hasChanges = true;
    return `from '@/${folder}${rest}'`;
  });
  
  // Pattern 4: Fix direct relative imports like ./button from same directory
  // Only if we're in a subdirectory of components/utils/lib
  if (filePath.includes('/components/') || filePath.includes('/utils/') || filePath.includes('/lib/')) {
    const sameDir = /from\s+['"]\.\/([^'"]+)['"]/g;
    modified = modified.replace(sameDir, (match, file) => {
      // Check if this is importing from same folder type (e.g., ui component importing another ui component)
      const fileDir = path.dirname(filePath);
      const parentFolder = fileDir.includes('/components/') ? 'components' : 
                          fileDir.includes('/utils/') ? 'utils' :
                          fileDir.includes('/lib/') ? 'lib' : null;
      
      if (parentFolder) {
        const relativePath = fileDir.split(`/${parentFolder}/`)[1] || '';
        if (relativePath) {
          hasChanges = true;
          return `from '@/${parentFolder}/${relativePath}/${file}'`;
        }
      }
      return match;
    });
  }
  
  return { content: modified, hasChanges };
}

// Main function
function fixImports() {
  console.log('Starting comprehensive import fix...\n');
  
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
fixImports();
