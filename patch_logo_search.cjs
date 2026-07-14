const fs = require('fs');
let content = fs.readFileSync('components/LogoSection.tsx', 'utf8');

content = content.replace(
    /section\.city\.toLowerCase/g,
    "(section.city || '').toLowerCase"
);

content = content.replace(
    /logo\.name\.toLowerCase/g,
    "(logo.name || '').toLowerCase"
);

content = content.replace(
    /item\.name\.toLowerCase/g,
    "(item.name || '').toLowerCase"
);

fs.writeFileSync('components/LogoSection.tsx', content);
console.log("Patched LogoSection");
