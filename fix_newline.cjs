const fs = require('fs');
let code = fs.readFileSync('components/JobSection.tsx', 'utf8');
code = code.replace(/\\n                    Revendas Nido/, '\n                    Revendas Nido');
fs.writeFileSync('components/JobSection.tsx', code);
console.log('Fixed newline in JobSection.tsx');
