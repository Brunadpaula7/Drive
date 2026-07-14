const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/import { OpenSalesSection } from '.\/components\/OpenSalesSection';( \/\/ Import new section)?\n/g, '');
content = content.replace(/<OpenSalesSection data={openSalesProjects} onProjectClick={handleOpenLaunchDetailModal} \/>( {\/\* New OpenSalesSection \*\/})?\n/g, '');
content = content.replace(/const \[openSalesProjects, setOpenSalesProjects\] = useState<LaunchProject\[\]>\(\[\]\);\n/g, '');
content = content.replace(/const specificOpenSalesNames = \[.*?\];\n/gs, '');
content = content.replace(/const openSales = launchesData.filter\(project => specificOpenSalesNames.includes\(project.name\)\);\n/g, '');
content = content.replace(/setOpenSalesProjects\(openSales\);\n/g, '');

fs.writeFileSync('App.tsx', content);
console.log("Removed OpenSalesSection from App.tsx");
