const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

content = content.replace(
    /\{lastSyncTime\}/,
    `Última atualização: {lastSyncTime}`
);

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched lastSyncTime label");
