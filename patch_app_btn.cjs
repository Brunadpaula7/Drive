const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const search = `<path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226a2.25 2.25 0 012.58 1.226c.219.53.256 1.121.098 1.668-.16.546-.54 1.018-1.07 1.298-.53.28-1.156.315-1.742.098-.586-.217-1.04-.68-1.226-1.226-.186-.546-.149-1.137.098-1.668zM9.594 9.594c.09-.542.56-1.007 1.11-1.226a2.25 2.25 0 012.58 1.226c.219.53.256 1.121.098 1.668-.16.546-.54 1.018-1.07 1.298-.53.28-1.156.315-1.742.098-.586-.217-1.04-.68-1.226-1.226-.186-.546-.149-1.137.098-1.668zM9.594 15.248c.09-.542.56-1.007 1.11-1.226a2.25 2.25 0 012.58 1.226c.219.53.256 1.121.098 1.668-.16.546-.54 1.018-1.07 1.298-.53.28-1.156.315-1.742.098-.586-.217-1.04-.68-1.226-1.226-.186-.546-.149-1.137.098-1.668z" />`;
const replace = `<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('App.tsx', content);
    console.log("Patched SVG");
} else {
    console.log("SVG not found, searching with regex...");
    const regexSearch = /<path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.*?z" \/>/;
    if (regexSearch.test(content)) {
        content = content.replace(regexSearch, replace);
        fs.writeFileSync('App.tsx', content);
        console.log("Patched SVG via regex");
    } else {
        console.log("SVG not found at all");
    }
}
