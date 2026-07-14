const fs = require('fs');
let code = fs.readFileSync('components/Modal.tsx', 'utf8');

const search1 = `        <div 
            className={\`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out \${isOpen ? 'bg-ink/30 backdrop-blur-sm opacity-100' : 'bg-ink/0 backdrop-blur-none opacity-0'}\`}`;
const replace1 = `        <div 
            className={\`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out \${isOpen ? 'bg-ink/30 backdrop-blur-sm opacity-100' : 'bg-ink/0 backdrop-blur-none opacity-0'} print:absolute print:inset-0 print:block print:bg-transparent print:backdrop-blur-none print:items-start\`}`;

const search2 = `            <div 
                className={\`relative flex flex-col bg-bone rounded-3xl shadow-2xl border border-sand p-8 w-11/12 max-w-2xl m-4 max-h-[90vh] transform transition-all duration-300 ease-out \${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}\`}`;
const replace2 = `            <div 
                className={\`relative flex flex-col bg-bone rounded-3xl shadow-2xl border border-sand p-8 w-11/12 max-w-2xl m-4 max-h-[90vh] transform transition-all duration-300 ease-out \${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'} print:max-h-none print:m-0 print:w-full print:p-0 print:shadow-none print:border-none print:bg-white\`}`;

const search3 = `                <div className="overflow-y-auto pr-2 custom-scrollbar">`;
const replace3 = `                <div className="overflow-y-auto pr-2 custom-scrollbar print:overflow-visible print:h-auto">`;

const search4 = `                    <button 
                        onClick={onClose}
                        className="text-sand hover:text-ink transition-colors text-3xl font-bold leading-none focus:outline-none flex-shrink-0"`;
const replace4 = `                    <button 
                        onClick={onClose}
                        className="text-sand hover:text-ink transition-colors text-3xl font-bold leading-none focus:outline-none flex-shrink-0 print:hidden"`;

if (code.includes(search1)) code = code.replace(search1, replace1);
if (code.includes(search2)) code = code.replace(search2, replace2);
if (code.includes(search3)) code = code.replace(search3, replace3);
if (code.includes(search4)) code = code.replace(search4, replace4);

fs.writeFileSync('components/Modal.tsx', code);
console.log('Patched Modal.tsx for printing');

