const fs = require('fs');
let content = fs.readFileSync('components/LaunchSection.tsx', 'utf8');

content = content.replace(
    /\{isOpen && \(\s*<div/,
    '<div className={!isOpen ? "hidden print:block" : "block"}'
);

content = content.replace(
    /<\/div>\s*\)\}\s*<\/section>/,
    '</div>\n        </section>'
);

fs.writeFileSync('components/LaunchSection.tsx', content);
console.log("Patched LaunchSection print visibility");
