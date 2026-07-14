const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
    /const jt = item\.id \|\| 'N\/A';/g,
    "const jt = item.id ? String(item.id) : 'N/A';"
);

fs.writeFileSync('App.tsx', content);
console.log("Patched App.tsx string cast");
