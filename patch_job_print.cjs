const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(
    /\{isOpen && \(\s*<div id="job-list-section">/,
    '<div id="job-list-section" className={!isOpen ? "hidden print:block" : "block"}>'
);

content = content.replace(
    /<\/div>\s*\)\}\s*\{selectedJob && \(/,
    '</div>\n            {selectedJob && ('
);

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched JobSection print visibility");
