const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');
content = content.replace(/\{feature\}/g, "{String(feature)}");
fs.writeFileSync('components/JobSection.tsx', content);
