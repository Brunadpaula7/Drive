const fs = require('fs');
let content = fs.readFileSync('types.ts', 'utf8');

if (!content.includes('features?: string[]')) {
    content = content.replace(/url\?: string;/g, 'url?: string;\n    features?: string[];\n    operacao?: string;\n    tipo?: string;');
    fs.writeFileSync('types.ts', content);
    console.log("Updated types.ts");
}
