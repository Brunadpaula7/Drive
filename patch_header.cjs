const fs = require('fs');
let content = fs.readFileSync('components/Header.tsx', 'utf8');

// Add import
if (!content.includes("import { Building2 }")) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { Building2 } from 'lucide-react';");
}

// Modify text and add icon
content = content.replace(
    /Materiais\s*<\/h1>/,
    `Materiais\n                        </h1>`
);

content = content.replace(
    /& Drives\s*<\/h2>/,
    `& Unidades\n                        </h2>`
);

content = content.replace(
    /className="text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tighter uppercase text-forest leading-none"/,
    'className="text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tighter uppercase text-forest leading-none flex items-center justify-center gap-4"'
);

// Add icon inside h1 before Materiais text
content = content.replace(
    /Materiais\n\s*<\/h1>/,
    `<Building2 className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-forest drop-shadow-md" strokeWidth={2.5} />\n                            Materiais\n                        </h1>`
);


fs.writeFileSync('components/Header.tsx', content);
console.log("Patched Header");
