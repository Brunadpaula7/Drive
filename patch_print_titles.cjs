const fs = require('fs');

function patchFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove print:hidden from the toggle container
    content = content.replace(
        /className="([^"]*)print:hidden([^"]*)"/g,
        (match, p1, p2) => {
            // Only if it has cursor-pointer
            if (match.includes('cursor-pointer')) {
                return `className="${p1}${p2}"`;
            }
            return match;
        }
    );
    
    // add print:hidden to the toggle icon (svg)
    content = content.replace(
        /<svg\s+xmlns="http:\/\/www.w3.org\/2000\/svg"\s+fill="none"\s+viewBox="0 0 24 24"\s+strokeWidth=\{2\}\s+stroke="currentColor"\s+className=\{`(.*?)`\}\s*>/,
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`$1 print:hidden`}>'
    );
    
    fs.writeFileSync(file, content);
}

patchFile('components/JobSection.tsx');
patchFile('components/LaunchSection.tsx');

console.log("Patched print titles");
