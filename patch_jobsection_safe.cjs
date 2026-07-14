const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(
    /\{selectedJob\.photos\.map\(\(photo, idx\) => \(/g,
    "{selectedJob.photos.map((photo, idx) => typeof photo === 'string' ? ("
);

content = content.replace(
    /<img key=\{idx\} src=\{photo\} alt=\{`Foto \$\{idx\+1\}`\} className="w-full h-24 object-cover rounded-lg border border-sand" loading="lazy" \/>/g,
    '<img key={idx} src={photo} alt={`Foto ${idx+1}`} className="w-full h-24 object-cover rounded-lg border border-sand" loading="lazy" />\n                                    ) : null)'
);

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched photos");
