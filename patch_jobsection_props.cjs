const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');
content = content.replace(/    jobs: Job\[\];\n    onRefresh\?: \(\) => void;\n    isRefreshing\?: boolean;\n    jobs: Job\[\];/g, '    jobs: Job[];\n    onRefresh?: () => void;\n    isRefreshing?: boolean;');
fs.writeFileSync('components/JobSection.tsx', content);
