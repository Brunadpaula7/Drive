const fs = require('fs');

function patchFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
}

patchFile('components/JobSection.tsx', [
    [/bg-white\/30 backdrop-blur-lg border border-white\/40 focus:outline-none focus:ring-1 focus:ring-zinc-400\/50 focus:bg-white\/50/g, 'bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:bg-white'],
    [/backdrop-blur-md/g, ''],
    [/backdrop-blur-sm/g, '']
]);

patchFile('components/LaunchSection.tsx', [
    [/bg-white\/30 backdrop-blur-lg border border-white\/40 focus:outline-none focus:ring-1 focus:ring-zinc-400\/50 focus:bg-white\/50/g, 'bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:bg-white'],
    [/backdrop-blur-sm/g, '']
]);

patchFile('components/LogoSection.tsx', [
    [/bg-white\/30 backdrop-blur-lg border border-white\/40 focus:outline-none focus:ring-1 focus:ring-zinc-400\/50 focus:bg-white\/50/g, 'bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:bg-white'],
    [/backdrop-blur-sm/g, '']
]);

patchFile('components/PipelineCalendar.tsx', [
    [/backdrop-blur-md/g, ''],
    [/backdrop-blur-sm/g, '']
]);

console.log("Cleaned up remaining blur");
