const fs = require('fs');

let content = fs.readFileSync('components/LogoItem.tsx', 'utf8');
content = content.replace(/hover:bg-bone/g, 'hover:bg-sand');
fs.writeFileSync('components/LogoItem.tsx', content);

let job = fs.readFileSync('components/JobSection.tsx', 'utf8');
job = job.replace(/hover:bg-bone/g, 'hover:bg-sand');
fs.writeFileSync('components/JobSection.tsx', job);

let launch = fs.readFileSync('components/LaunchSection.tsx', 'utf8');
launch = launch.replace(/hover:bg-bone/g, 'hover:bg-sand');
fs.writeFileSync('components/LaunchSection.tsx', launch);

let cal = fs.readFileSync('components/PipelineCalendar.tsx', 'utf8');
cal = cal.replace(/hover:bg-bone/g, 'hover:bg-sand');
fs.writeFileSync('components/PipelineCalendar.tsx', cal);

let os = fs.readFileSync('components/OpenSalesSection.tsx', 'utf8');
os = os.replace(/hover:bg-bone/g, 'hover:bg-sand');
fs.writeFileSync('components/OpenSalesSection.tsx', os);

console.log("Hover fixed");
