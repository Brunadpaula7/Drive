const fs = require('fs');
let content = fs.readFileSync('components/SettingsModal.tsx', 'utf8');

content = content.replace(/https:\/\/corsproxy\.io\/\?\$\{encodeURIComponent\(localUrl\)\}/, 'https://api.allorigins.win/raw?url=${encodeURIComponent(localUrl)}');

fs.writeFileSync('components/SettingsModal.tsx', content);
