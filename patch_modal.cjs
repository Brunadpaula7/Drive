const fs = require('fs');
let content = fs.readFileSync('components/Modal.tsx', 'utf8');

// Update backdrop container
content = content.replace(
    /className=\{\`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out/,
    'className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-in-out'
);
content = content.replace(
    /print:items-start\`\}/,
    'print:items-start print:p-0`}'
);

// Update modal content container
content = content.replace(
    /className=\{\`relative flex flex-col bg-bone rounded-3xl shadow-2xl border border-sand p-8 w-11\/12 max-w-2xl m-4 max-h-\[90vh\]/,
    'className={`relative flex flex-col bg-bone rounded-2xl sm:rounded-3xl shadow-2xl border border-sand p-5 sm:p-8 w-full max-w-6xl max-h-[100%] sm:max-h-[90vh]'
);
content = content.replace(
    /print:max-h-none print:m-0 print:w-full/,
    'print:max-h-none print:w-full'
);

fs.writeFileSync('components/Modal.tsx', content);
console.log("Patched Modal");
