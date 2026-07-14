const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const searchImport = `import { OpenSalesSection } from './components/OpenSalesSection'; // Import new section\n`;
const replaceImport = ``;

const searchUsage = `                <OpenSalesSection data={openSalesProjects} onProjectClick={handleOpenLaunchDetailModal} onViewAllClick={handleViewAllLaunches} />\n                \n`;
const replaceUsage = ``;

if (code.includes(searchImport)) {
    code = code.replace(searchImport, replaceImport);
}
if (code.includes(searchUsage)) {
    code = code.replace(searchUsage, replaceUsage);
}

fs.writeFileSync('App.tsx', code);
console.log("Patched App.tsx to remove OpenSalesSection");
