const fs = require('fs');
let code = fs.readFileSync('components/SettingsModal.tsx', 'utf8');

// remove tab button
code = code.replace(/<TabButton activeTab={activeTab} tabName="avisos" onClick={setActiveTab}>Quadro de Avisos<\/TabButton>\n?/, "");

// remove avisos case
const avisosBlock = /activeTab === 'avisos' && \([\s\S]*?\)\}[\s\S]*?\{activeTab === 'cidades'/;
code = code.replace(avisosBlock, "{activeTab === 'cidades'");

fs.writeFileSync('components/SettingsModal.tsx', code);
console.log('SettingsModal.tsx patched again');
