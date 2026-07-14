const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const search = `loadData('pipelineData_v5', setPipelineData, initialPipelineData); // Versioned key to reset stale data`;
const replace = `loadData('pipelineData_v6', setPipelineData, initialPipelineData); // Versioned key to reset stale data`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App v6");
} else {
    console.log("Not found App v6");
}
