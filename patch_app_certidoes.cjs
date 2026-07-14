const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const searchImport = `import { SalesLinksSection } from './components/SalesLinksSection';`;
const replaceImport = `import { SalesLinksSection } from './components/SalesLinksSection';
import { CertidoesSection } from './components/CertidoesSection';`;

const searchComponent = `                <SalesLinksSection />`;
const replaceComponent = `                <CertidoesSection />
                <SalesLinksSection />`;

if (code.includes(searchImport) && code.includes(searchComponent)) {
    code = code.replace(searchImport, replaceImport);
    code = code.replace(searchComponent, replaceComponent);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App.tsx for CertidoesSection");
} else {
    console.log("Not found in App.tsx");
}
