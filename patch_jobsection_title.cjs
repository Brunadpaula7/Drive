const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');
content = content.replace(
    /title=\{selectedJob\.title \|\| selectedJob\.property\.split\(' \| '\)\[0\] \|\| 'Detalhes do Imóvel'\}/g,
    "title={selectedJob.title || (selectedJob.property ? selectedJob.property.split(' | ')[0] : 'Detalhes do Imóvel')}"
);
fs.writeFileSync('components/JobSection.tsx', content);
