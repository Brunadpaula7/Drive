const fs = require('fs');

function replaceColors(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        content = content.replace(/zinc-950/g, 'ink');
        content = content.replace(/zinc-900/g, 'ink');
        content = content.replace(/zinc-800/g, 'forest');
        content = content.replace(/zinc-700/g, 'forest');
        content = content.replace(/zinc-600/g, 'stone');
        content = content.replace(/zinc-500/g, 'stone');
        content = content.replace(/zinc-400/g, 'stone');
        content = content.replace(/zinc-300/g, 'sand');
        content = content.replace(/zinc-200/g, 'sand');
        content = content.replace(/zinc-100/g, 'sand');
        content = content.replace(/zinc-50/g, 'bone');
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

components.forEach(replaceColors);

console.log("Colors replaced");
