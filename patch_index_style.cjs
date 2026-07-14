const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const search = `    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.2);
    }`;

const replace = `    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.2);
    }
    
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    @media print {
        body {
            background-color: #ffffff !important;
        }
        .printable-section {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }
    }`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('index.html', code);
    console.log("Patched index.html styles");
} else {
    console.log("Not found in index.html");
}
