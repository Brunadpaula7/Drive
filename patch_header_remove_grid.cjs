const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

const search = `                    {/* Background Grafismos (Graphics) */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.15]" 
                         style={{ 
                             backgroundImage: 'linear-gradient(#141A17 1px, transparent 1px), linear-gradient(90deg, #141A17 1px, transparent 1px)', 
                             backgroundSize: '40px 40px',
                             backgroundPosition: 'center center'
                         }}>
                    </div>`;

const replace = ``;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('components/Header.tsx', code);
    console.log("Patched Header.tsx grid");
} else {
    console.log("Not found Header.tsx grid");
}
