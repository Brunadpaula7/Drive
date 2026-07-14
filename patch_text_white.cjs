const fs = require('fs');

function replaceWhite(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        content = content.replace(/text-white/g, 'text-bone');
        fs.writeFileSync(filename, content);
    } catch (e) {
        console.error('Error updating ' + filename, e);
    }
}

const components = [
    'App.tsx',
    'components/Header.tsx',
    'components/LogoSection.tsx',
    'components/LogoItem.tsx',
    'components/JobSection.tsx',
    'components/LaunchSection.tsx',
    'components/OpenSalesSection.tsx',
    'components/PipelineCalendar.tsx',
    'components/Modal.tsx',
    'components/SettingsModal.tsx',
    'components/EditLogoModal.tsx',
    'components/EditPipelineEventModal.tsx'
];

components.forEach(replaceWhite);

console.log("text-white replaced with text-bone");
