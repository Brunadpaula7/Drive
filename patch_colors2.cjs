const fs = require('fs');

function replaceColors(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        content = content.replace(/bg-blue-600/g, 'bg-forest');
        content = content.replace(/bg-blue-700/g, 'bg-ink');
        content = content.replace(/bg-blue-300/g, 'bg-sand');
        content = content.replace(/bg-blue-50/g, 'bg-sand');
        content = content.replace(/hover:bg-blue-100/g, 'hover:bg-sand/80');
        content = content.replace(/hover:bg-blue-700/g, 'hover:bg-ink');
        content = content.replace(/hover:bg-blue-50/g, 'hover:bg-sand/50');
        content = content.replace(/text-blue-600/g, 'text-forest');
        content = content.replace(/text-blue-700/g, 'text-forest');
        content = content.replace(/text-blue-900/g, 'text-ink');
        content = content.replace(/hover:text-blue-900/g, 'hover:text-ink');
        content = content.replace(/hover:text-blue-700/g, 'hover:text-forest');
        content = content.replace(/ring-blue-500/g, 'ring-forest');
        content = content.replace(/bg-emerald-400/g, 'bg-forest');
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

console.log("Colors replaced phase 2");
