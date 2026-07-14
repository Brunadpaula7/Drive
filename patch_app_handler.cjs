const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const search = `    const handleOpenSettings = () => setIsSettingsModalOpen(true);
    const handleCloseSettings = () => setIsSettingsModalOpen(false);`;

const replace = `    const handleOpenSettings = () => setIsSettingsModalOpen(true);
    const handleCloseSettings = () => setIsSettingsModalOpen(false);
    
    const handleToggleHighContrast = (val: boolean) => {
        setIsHighContrast(val);
        try {
            localStorage.setItem('isHighContrast', val.toString());
        } catch (e) { console.error(e) }
    };`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App handler");
} else {
    console.log("Not found handler");
}
