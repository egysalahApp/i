const fs = require('fs');
const path = require('path');

const dir = '/Volumes/WORKS/i/react-app/src/components/admin/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to match:
  // const removeX = (...) => {
  //   ...
  // };
  // But wait, there might be early returns or similar. 
  // Let's just find `const remove[A-Z]\w* = \([^)]*\) => \{`
  
  const regex = /(const remove[A-Z]\w* = \([^)]*\) => \{)([\s\S]*?)(\n  \};\n)/g;
  
  let modified = false;
  content = content.replace(regex, (match, start, body, end) => {
    // If it already has window.confirm, skip
    if (body.includes('window.confirm')) {
      return match;
    }
    modified = true;
    
    // We should indent the body by 2 spaces
    const indentedBody = body.split('\n').map(line => {
      return line.length > 0 ? '  ' + line : line;
    }).join('\n');

    return `${start}\n    if (window.confirm('هل أنت متأكد من الحذف؟')) {${indentedBody}\n    }${end}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modified', file);
  }
}
