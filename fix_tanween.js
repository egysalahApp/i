const fs = require('fs');
const filePath = 'src/lessons/waqour.json';
let content = fs.readFileSync(filePath, 'utf8');

// The regex matches any character that is NOT Lam (ل), followed by Alif (ا) and Tanween Fatha (ً)
// \u0644 is ل
// \u0627 is ا
// \u064B is ً
// Replace (\u0627)(\u064B) with (\u064B)(\u0627) if the previous character is not \u0644
content = content.replace(/([^\u0644])\u0627\u064B/g, '$1\u064B\u0627');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed tanween in waqour.json');
