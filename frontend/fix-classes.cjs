const fs = require('fs');
const path = require('path');
const dir = 'c:/quanlygiasu/frontend/src/pages/admin';

fs.readdirSync(dir).filter(f => f.startsWith('Admin')).forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  // Add space if missing
  content = content.replace(/backdrop-blur-md([a-zA-Z0-9_-])/g, 'backdrop-blur-md $1');
  
  // Also we might have swallowed the quote! Let's check if the class string ends abruptly.
  // Actually, wait, if the original string was `bg-white"`, it became `bg-white/80 backdrop-blur-md`.
  // Wait, `([^/A-Za-z0-9_-])` means it matched ANY character that is NOT alphanumeric. 
  // It matched the quote! So `bg-white"` became `bg-white/80 backdrop-blur-md`.
  // To fix the quote, we must restore it. But how do we know if it was a quote or space?
  // Let's just restore quotes where `className=` strings don't close.
  // But wait, it's easier to just do a smart regex:
  // If `backdrop-blur-md` is followed by `>`, it was `bg-white">`
  content = content.replace(/backdrop-blur-md>/g, 'backdrop-blur-md">');
  content = content.replace(/backdrop-blur-md\}/g, 'backdrop-blur-md"}');
  
  fs.writeFileSync(p, content);
});
console.log('Fixed spaces');
