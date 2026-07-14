const fs = require('fs');

function fixClosingTags(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        
        // Find if we have <h2 and then </h3>
        content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl[^>]*>([\s\S]*?)<\/h3>/g, '<h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">$1</h2>');
        
        fs.writeFileSync(filename, content);
        console.log(`Fixed closing tags in ${filename}`);
    } catch (e) {
        console.error(`Error in ${filename}:`, e);
    }
}

const components = [
    'components/JobSection.tsx',
    'components/CertidoesSection.tsx',
    'components/SalesLinksSection.tsx'
];

components.forEach(fixClosingTags);
