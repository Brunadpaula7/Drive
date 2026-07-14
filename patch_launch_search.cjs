const fs = require('fs');
let content = fs.readFileSync('components/LaunchSection.tsx', 'utf8');

content = content.replace(
    /result = result\.filter\(project => \s*project\.name\.toLowerCase\(\)\.includes\(searchLower\) \|\|\s*project\.builder\.toLowerCase\(\)\.includes\(searchLower\) \|\|\s*project\.location\.toLowerCase\(\)\.includes\(searchLower\) \|\|\s*project\.status\.toLowerCase\(\)\.includes\(searchLower\)\s*\);/,
    `result = result.filter(project => 
                (project.name || '').toLowerCase().includes(searchLower) ||
                (project.builder || '').toLowerCase().includes(searchLower) ||
                (project.location || '').toLowerCase().includes(searchLower) ||
                (project.status || '').toLowerCase().includes(searchLower)
            );`
);

fs.writeFileSync('components/LaunchSection.tsx', content);
console.log("Patched LaunchSection");
