const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(
    /\) : null\)\n\s*\)\}\}/g,
    ") : null\n                                    )}"
);
// Actually, let's just do a simpler replace.
fs.writeFileSync('components/JobSection.tsx', content);
