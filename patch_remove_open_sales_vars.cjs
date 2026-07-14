const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const searchData = `    const [openSalesProjects, setOpenSalesProjects] = useState<LaunchProject[]>([]);\n`;
const replaceData = ``;

if (code.includes(searchData)) {
    code = code.replace(searchData, replaceData);
}

fs.writeFileSync('App.tsx', code);
console.log("Patched App.tsx to remove openSalesProjects");
