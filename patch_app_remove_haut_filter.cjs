const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/item\.raw\.toLowerCase\(\) !== 'haut'/g, 'true');
fs.writeFileSync('App.tsx', content);
