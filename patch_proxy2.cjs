const fs = require('fs');

function patchProxy(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/https:\/\/api\.allorigins\.win\/raw\?url=\$\{encodeURIComponent\((.*?)\)\}/g, '/api/proxy?url=${encodeURIComponent($1)}');
    fs.writeFileSync(file, content);
}

patchProxy('App.tsx');
patchProxy('components/SettingsModal.tsx');
console.log("Patched proxy to internal");
