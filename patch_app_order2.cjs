const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const regex = /<Header coverPhotoUrl=\{coverPhotoUrl\} \/>\s*<LogoSection[\s\S]*?<PipelineCalendar data=\{pipelineData\} \/>/m;

const match = content.match(regex);
if (match) {
    let replaced = match[0]
        .replace(/\s*<CertidoesSection \/>/, '')
        .replace(/\s*<SalesLinksSection \/>/, '');
    
    // Insert SalesLinksSection after Header
    replaced = replaced.replace(
        /<Header coverPhotoUrl=\{coverPhotoUrl\} \/>/,
        '<Header coverPhotoUrl={coverPhotoUrl} />\n                <SalesLinksSection />'
    );
    
    // Append CertidoesSection at the end (after PipelineCalendar)
    replaced = replaced + '\n                <CertidoesSection />';
    
    content = content.replace(match[0], replaced);
    fs.writeFileSync('App.tsx', content);
    console.log("Patched order successfully");
} else {
    console.log("No match found");
}
