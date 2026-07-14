const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const search = `                onDeleteMonthFromPipeline={handleDeleteMonthFromPipeline} 
            />`;
const replace = `                onDeleteMonthFromPipeline={handleDeleteMonthFromPipeline}
                isHighContrast={isHighContrast}
                onToggleHighContrast={handleToggleHighContrast}
            />`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App settings");
} else {
    console.log("Not found settings");
}
