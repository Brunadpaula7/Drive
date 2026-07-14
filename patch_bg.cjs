const fs = require('fs');

const components = [
    'components/JobSection.tsx',
    'components/LaunchSection.tsx',
    'components/OpenSalesSection.tsx',
    'components/CertidoesSection.tsx',
    'components/LogoSection.tsx',
    'components/PipelineCalendar.tsx',
    'components/SalesLinksSection.tsx',
    'components/InfoBoard.tsx',
    'components/Header.tsx'
];

function patchBg(filename) {
    if (!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');
    
    // Replace bg-white with bg-bone/40 in section definitions
    content = content.replace(/className="bg-white([^"]*)"/g, 'className="bg-bone/60 backdrop-blur-sm$1"');
    
    // Also check for any other very white backgrounds if needed
    // Certidoes inner cards:
    content = content.replace(/bg-bone\/30/g, 'bg-white/40'); 

    fs.writeFileSync(filename, content);
    console.log(`Patched backgrounds in ${filename}`);
}

components.forEach(patchBg);

// Let's also make App.tsx background slightly darker so the sections pop
let appContent = fs.readFileSync('App.tsx', 'utf8');
appContent = appContent.replace(/bg-bone\/30/, 'bg-sand/20');
fs.writeFileSync('App.tsx', appContent);

