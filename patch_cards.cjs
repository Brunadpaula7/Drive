const fs = require('fs');

function fixLaunchCard() {
    let content = fs.readFileSync('components/LaunchSection.tsx', 'utf8');
    content = content.replace(/className="group flex flex-col p-6 rounded-2xl bg-bone border-sand shadow-sm hover:shadow-md hover:border-stone hover:-translate-y-1 transition-all duration-500 h-full cursor-pointer"/, 'className="group flex flex-col p-6 rounded-2xl bg-white border border-sand shadow-sm hover:shadow-md hover:border-stone hover:-translate-y-1 transition-all duration-500 h-full cursor-pointer"');
    fs.writeFileSync('components/LaunchSection.tsx', content);
    console.log("Patched LaunchSection.tsx");
}

function fixJobCard() {
    let content = fs.readFileSync('components/JobSection.tsx', 'utf8');
    content = content.replace(/bg-bone border-sand hover:border-stone/g, 'bg-white border border-sand hover:border-stone');
    content = content.replace(/bg-bone border-sand hover:bg-sand hover:border-stone/g, 'bg-white border border-sand hover:bg-bone hover:border-stone');
    fs.writeFileSync('components/JobSection.tsx', content);
    console.log("Patched JobSection.tsx");
}

fixLaunchCard();
fixJobCard();
