const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

if (!content.includes('import { CertidoesSection }')) {
    content = content.replace(/import { LaunchSection } from '.\/components\/LaunchSection';/, "import { LaunchSection } from './components/LaunchSection';\nimport { CertidoesSection } from './components/CertidoesSection';\nimport { SalesLinksSection } from './components/SalesLinksSection';");
}

if (!content.includes('<CertidoesSection />')) {
    content = content.replace(/<LaunchSection data=\{launchesData\} onProjectClick=\{handleOpenLaunchDetailModal\} \/>/, "<CertidoesSection />\n                <SalesLinksSection />\n                <LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} />");
}

fs.writeFileSync('App.tsx', content);
