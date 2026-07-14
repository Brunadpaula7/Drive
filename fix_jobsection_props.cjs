const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');
content = content.replace(/    jobs: Job\[\];\n    onRefresh\?: \(\) => void;\n    isRefreshing\?: boolean;\n    jobs: Job\[\];/g, '    jobs: Job[];\n    onRefresh?: () => void;\n    isRefreshing?: boolean;');
if (content.includes('jobs: Job[];\n    jobs: Job[];')) {
   content = content.replace('jobs: Job[];\n    jobs: Job[];', 'jobs: Job[];');
} else {
    const lines = content.split('\n');
    let found = false;
    let newLines = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('jobs: Job[]') && lines[i].trim().startsWith('jobs:')) {
            if (!found) {
                found = true;
                newLines.push(lines[i]);
            }
        } else {
            newLines.push(lines[i]);
        }
    }
    content = newLines.join('\n');
}
fs.writeFileSync('components/JobSection.tsx', content);
