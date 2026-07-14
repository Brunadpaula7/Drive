const fs = require('fs');

function patchProxy(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/https:\/\/corsproxy\.io\/\?url=\$\{encodeURIComponent\((.*?)\)\}/g, 'https://api.allorigins.win/raw?url=${encodeURIComponent($1)}');
    fs.writeFileSync(file, content);
}

patchProxy('App.tsx');
patchProxy('components/SettingsModal.tsx');
console.log("Reverted proxy");
