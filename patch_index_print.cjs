const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const printStyles = `    @media print {
        body {
            background-color: #ffffff !important;
        }
        .printable-section {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        
        /* When a modal is open, it has aria-modal="true" and we want to hide everything else on print */
        body:has(div[aria-modal="true"]) > div#root > *:not(div[aria-modal="true"]) {
            display: none !important;
        }
    }`;

code = code.replace(/    @media print {[\s\S]*?    }/, printStyles);

fs.writeFileSync('index.html', code);
console.log('Patched index.html print styles');

