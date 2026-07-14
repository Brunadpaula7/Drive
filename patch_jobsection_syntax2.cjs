const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(
    /\) : null\)\n\s*\)\}\}/g,
    ") : null\n                                    )}"
);

fs.writeFileSync('components/JobSection.tsx', content);
