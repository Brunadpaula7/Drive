const fs = require('fs');
let code = fs.readFileSync('components/SettingsModal.tsx', 'utf8');

// remove leftover avisos block
code = code.replace(/helpText="Um item por linha." \/>[\s\S]*?<\/div>\n                        \)\}/, "");

fs.writeFileSync('components/SettingsModal.tsx', code);
console.log('SettingsModal.tsx patched 4');
