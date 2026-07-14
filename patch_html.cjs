const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const search = `    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.2);
    }`;

const replace = `    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.2);
    }

    /* High Contrast Mode Overrides */
    html.high-contrast, html.high-contrast body {
        background-color: #ffffff !important;
        color: #000000 !important;
    }
    
    html.high-contrast * {
        border-color: #000000 !important;
    }
    
    html.high-contrast .text-stone, 
    html.high-contrast .text-ink,
    html.high-contrast .text-forest {
        color: #000000 !important;
    }
    
    html.high-contrast .bg-bone, 
    html.high-contrast .bg-sand, 
    html.high-contrast .bg-transparent {
        background-color: #ffffff !important;
    }
    
    html.high-contrast .bg-forest,
    html.high-contrast .bg-ink {
        background-color: #000000 !important;
        color: #ffffff !important;
    }
    
    html.high-contrast .bg-forest *,
    html.high-contrast .bg-ink * {
        color: #ffffff !important;
    }`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('index.html', code);
    console.log("Patched HTML");
} else {
    console.log("Not found HTML");
}
