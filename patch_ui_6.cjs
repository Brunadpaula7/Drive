const fs = require('fs');

let content = fs.readFileSync('components/SettingsModal.tsx', 'utf8');
content = content.replace(/bg-white\/80 backdrop-blur-2xl/g, 'bg-white');
content = content.replace(/border border-white\/50/g, 'border border-zinc-200');
content = content.replace(/bg-zinc-100\/50/g, 'bg-zinc-50');
fs.writeFileSync('components/SettingsModal.tsx', content);

console.log("Patched Settings Modal");
