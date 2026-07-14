const fs = require('fs');
let content = fs.readFileSync('components/CertidoesSection.tsx', 'utf8');

// The active tab for 'Imovel', 'PF', 'PJ'
content = content.replace(/border-transparent bg-zinc-200 text-zinc-800 hover:bg-zinc-300/g, 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400 border-none');
content = content.replace(/border-forest bg-forest text-white shadow-md/g, 'bg-forest text-white font-black shadow-md border-none');

// The status buttons inactive
content = content.replace(/bg-zinc-200 text-zinc-800 border-zinc-300 hover:bg-zinc-300 hover:text-zinc-900/g, 'bg-zinc-200 text-zinc-900 border-zinc-300 hover:bg-zinc-300 font-bold');

fs.writeFileSync('components/CertidoesSection.tsx', content);
console.log("Patched solid colors");
