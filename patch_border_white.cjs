const fs = require('fs');

function replaceBorderWhite(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        content = content.replace(/border-white\/50/g, 'border-sand');
        content = content.replace(/border-white\/70/g, 'border-stone');
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

components.forEach(replaceBorderWhite);

console.log("border-white replaced");
