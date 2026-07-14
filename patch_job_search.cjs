const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(
    /result = result\.filter\(job => job\.raw\.toLowerCase\(\)\.includes\(searchLower\)\);/,
    "result = result.filter(job => (job.raw || '').toLowerCase().includes(searchLower));"
);
content = content.replace(
    /result = result\.filter\(job => job\.raw\.toLowerCase\(\)\.includes\(queryLower\)\);/,
    "result = result.filter(job => (job.raw || '').toLowerCase().includes(queryLower));"
);

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched JobSection");
