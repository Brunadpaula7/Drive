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
        
        div[aria-modal="true"] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: white !important;
            z-index: 999999 !important;
            display: block !important;
        }
        
        div[aria-modal="true"] > div {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
        }
    }`;

code = code.replace(/    @media print {[\s\S]*?    }/, printStyles);

fs.writeFileSync('index.html', code);
console.log('Patched index.html print styles for real');

