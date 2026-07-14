const fs = require('fs');
let code = fs.readFileSync('components/SalesLinksSection.tsx', 'utf8');

const search = `        {
            title: "Captação Trello",
            url: "https://form.jotform.com/261938305611052",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        },
        {
            title: "Fazenda Canoa",
            url: "https://fazendacanoa.com.br/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            )
        }
    ];`;

const replace = `        {
            title: "Captação Trello",
            url: "https://form.jotform.com/261938305611052",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        }
    ];`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('components/SalesLinksSection.tsx', code);
    console.log("Patched SalesLinksSection");
} else {
    console.log("Not found SalesLinksSection");
}

let constantsCode = fs.readFileSync('constants.ts', 'utf8');
const searchConst = `            { id: 'fazenda-canoa', name: 'Fazenda Canoa', imgSrc: 'https://placehold.co/100x100/e2e8f0/718096?text=Canoa', href: 'https://drive.google.com/drive/folders/12D4_Y3HO2dSQgUZ083ZyL2Rr-l0loQZ3' },`;
const replaceConst = `            { id: 'fazenda-canoa', name: 'Fazenda Canoa', imgSrc: 'https://placehold.co/100x100/e2e8f0/718096?text=Canoa', href: 'https://fazendacanoa.com.br/' },`;

if (constantsCode.includes(searchConst)) {
    constantsCode = constantsCode.replace(searchConst, replaceConst);
    fs.writeFileSync('constants.ts', constantsCode);
    console.log("Patched constants.ts");
} else {
    console.log("Not found constants.ts");
}

