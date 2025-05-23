import fs from 'fs';
import path from 'path';

function scaffoldPage(pageName) {
  const templateDir = './pages/template';
  const targetDir = `./pages/${pageName}`;

  // 1. Check if template directory exists
  if (!fs.existsSync(templateDir)) {
    console.error('Template directory does not exist:', templateDir);
    return;
  }

  // 2. Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // 3. Copy and rename files
  const files = fs.readdirSync(templateDir);
  files.forEach(file => {
    const sourcePath = path.join(templateDir, file);
    const targetPath = path.join(targetDir, file.replace('template', pageName));

    // If it's a directory, copy recursively
    if (fs.statSync(sourcePath).isDirectory()) {
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else {
      // Read file content
      let content = fs.readFileSync(sourcePath, 'utf8');
      
      if (file.endsWith('.js')) {
        // Replace all occurrences of 'template' with pageName in the content
        content = content.replace(/template/g, pageName);
      }
      
      // Write to new file
      fs.writeFileSync(targetPath, content);
    }
  });

  console.log(`Successfully scaffolded ${pageName} page from template`);
}

// Example usage:
if (process.argv.length < 3) {
  console.error('Please provide a page name. Usage: node scaffold.js <pageName>');
  process.exit(1);
}

const pageName = process.argv[2];
scaffoldPage(pageName);

// for file in template.*; do
//   mv "$file" "${file/template/backgrounds}"
// done

// sed -i '' 's/template/backgrounds/g' template.js

// do the above with javascript

// 1. copy folder ./pages/template to ./pages/{pageName}
// 2. in ./pages/template.js replace template with {pageName}
// 3. rename ./pages/template.* to ./pages/{pageName}.*

