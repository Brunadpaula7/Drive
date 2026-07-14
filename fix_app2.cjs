const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const regex = /\/\/ Filter projects for the "Lançamentos com vendas abertas" section\n\s*const openSalesProjects = useMemo\(\(\) => \{\n.*?\n\s*\}, \[launchesData\]\);\n/gs;
content = content.replace(regex, '');

fs.writeFileSync('App.tsx', content);
