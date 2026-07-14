const fs = require('fs');
let content = fs.readFileSync('components/CertidoesSection.tsx', 'utf8');

// Update tab buttons
content = content.replace(/'border-transparent text-ink\/70 hover:text-ink'/g, "'border-transparent bg-zinc-200 text-zinc-800 hover:bg-zinc-300'");
content = content.replace(/'border-forest text-forest'/g, "'border-forest bg-forest text-white shadow-md'");
content = content.replace(/className={`py-3 px-6 text-sm font-medium/g, "className={`py-3 px-6 text-sm font-bold rounded-t-lg");

// Update Clear button
content = content.replace(/bg-bone text-ink/g, "bg-zinc-800 text-white");
content = content.replace(/hover:bg-sand/g, "hover:bg-zinc-900 shadow-md");

// Update status buttons inactive state
content = content.replace(/'bg-white text-ink border-sand hover:bg-bone hover:text-ink'/g, "'bg-zinc-200 text-zinc-800 border-zinc-300 hover:bg-zinc-300 hover:text-zinc-900'");

// Change font-semibold to font-bold on status buttons
content = content.replace(/font-semibold rounded-xl border transition-colors/g, "font-bold rounded-xl border transition-colors");

fs.writeFileSync('components/CertidoesSection.tsx', content);
console.log("Patched buttons in CertidoesSection.tsx");
