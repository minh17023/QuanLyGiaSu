const fs = require('fs');
const path = require('path');
const dir = 'c:/quanlygiasu/frontend/src/pages/admin';

fs.readdirSync(dir).filter(f => f.startsWith('Admin')).forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/bg-white\/80 backdrop-blur-md/g, 'bg-white/40 backdrop-blur-lg');
  content = content.replace(/bg-white\/60 backdrop-blur-sm/g, 'bg-white/30 backdrop-blur-md');
  fs.writeFileSync(p, content);
});
console.log('Updated opacity and blur');
