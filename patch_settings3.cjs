const fs = require('fs');
let code = fs.readFileSync('components/SettingsModal.tsx', 'utf8');

// remove avisos from Tab type
code = code.replace("type Tab = 'incorporadoras' | 'cidades' | 'avisos' | 'lancamentos' | 'pipeline' | 'jobs' | 'coverPhoto';", "type Tab = 'incorporadoras' | 'cidades' | 'lancamentos' | 'pipeline' | 'jobs' | 'coverPhoto';");

// remove activeTab === 'avisos' block
const regexAvisos = /\{activeTab === 'avisos' && \([\s\S]*?\}\)\}/;
code = code.replace(regexAvisos, "");

// remove Quadro de Avisos button
const regexButton = /<TabButton activeTab=\{activeTab\} tabName="avisos" onClick=\{setActiveTab\}>Quadro de Avisos<\/TabButton>/;
code = code.replace(regexButton, "");

fs.writeFileSync('components/SettingsModal.tsx', code);
console.log('SettingsModal.tsx patched 3');
