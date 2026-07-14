const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const search = `    const [activeModal, setActiveModal] = useState<string | null>(null);`;
const replace = `    const [isHighContrast, setIsHighContrast] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App state");
} else {
    console.log("Not found state");
}
