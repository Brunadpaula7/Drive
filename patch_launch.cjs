const fs = require('fs');
let content = fs.readFileSync('components/LaunchSection.tsx', 'utf8');

content = content.replace(/    filterStatus: string;\n    onFilterChange: \(status: string\) => void;\n/g, '');
content = content.replace(/export const LaunchSection = forwardRef<HTMLElement, LaunchSectionProps>\(\(\{ data, onProjectClick, filterStatus, onFilterChange \}, ref\) => \{/g, `export const LaunchSection = forwardRef<HTMLElement, LaunchSectionProps>(({ data, onProjectClick }, ref) => {\n    const [filterStatus, setFilterStatus] = useState('Todos');\n    const onFilterChange = setFilterStatus;`);

fs.writeFileSync('components/LaunchSection.tsx', content);
console.log("Patched LaunchSection.tsx");
