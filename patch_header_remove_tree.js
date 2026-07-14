import fs from 'fs';

let code = fs.readFileSync('components/Header.tsx', 'utf8');

// Regex to find and remove the SVG tree div
code = code.replace(/<div className="w-32 h-32 md:w-40 md:h-40 mb-8 relative">[\s\S]*?<\/svg>\s*<\/div>/, '');

fs.writeFileSync('components/Header.tsx', code);
