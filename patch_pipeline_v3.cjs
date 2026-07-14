const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const search = `loadData('pipelineData_v2', setPipelineData, initialPipelineData); // Versioned key to reset stale data`;
const replace = `loadData('pipelineData_v3', setPipelineData, initialPipelineData); // Versioned key to reset stale data`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App v3");
} else {
    console.log("Not found App v3");
}
