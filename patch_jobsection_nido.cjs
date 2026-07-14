const fs = require('fs');
let code = fs.readFileSync('components/JobSection.tsx', 'utf8');

const regex = /<h3 className="text-2xl font-bold text-zinc-800 flex items-center">\s*Revendas\s*<span className="ml-2 text-zinc-400 font-light hidden sm:inline">\|<\/span>\s*<span className="ml-2 text-zinc-600 hidden sm:inline">Vinícius Kasbaum<\/span>/g;

code = code.replace(regex, '<h3 className="text-2xl font-bold text-zinc-800 flex items-center">\\n                    Revendas Nido');

fs.writeFileSync('components/JobSection.tsx', code);
console.log('JobSection.tsx patched for Nido');
