const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(/\{selectedJob\.area\}/g, "{String(selectedJob.area)}");
content = content.replace(/\{selectedJob\.areaTotal\}/g, "{String(selectedJob.areaTotal)}");
content = content.replace(/\{selectedJob\.quartos\}/g, "{String(selectedJob.quartos)}");
content = content.replace(/\{selectedJob\.suites\}/g, "{String(selectedJob.suites)}");
content = content.replace(/\{selectedJob\.salas\}/g, "{String(selectedJob.salas)}");
content = content.replace(/\{selectedJob\.bathrooms\}/g, "{String(selectedJob.bathrooms)}");
content = content.replace(/\{selectedJob\.parking\}/g, "{String(selectedJob.parking)}");
content = content.replace(/\{selectedJob\.price\}/g, "{String(selectedJob.price)}");
content = content.replace(/\{selectedJob\.tipo\}/g, "{String(selectedJob.tipo)}");
content = content.replace(/\{selectedJob\.operacao\}/g, "{String(selectedJob.operacao)}");
content = content.replace(/\{selectedJob\.locationDetails\}/g, "{String(selectedJob.locationDetails)}");
content = content.replace(/\{selectedJob\.jt\}/g, "{String(selectedJob.jt)}");
content = content.replace(/\{selectedJob\.description\}/g, "{String(selectedJob.description)}");

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched render safe");
