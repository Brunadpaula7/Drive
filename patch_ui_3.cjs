const fs = require('fs');

function patchFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
}

patchFile('components/OpenSalesSection.tsx', [
    [/bg-white\/30 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40/g, 'bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-200'],
    [/bg-white\/40/g, 'bg-zinc-50'],
    [/bg-white\/60/g, 'bg-zinc-100/50'],
    [/bg-white\/30/g, 'bg-white']
]);

patchFile('components/PipelineCalendar.tsx', [
    [/bg-white\/30 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40 mt-12 transition-all duration-300/g, 'bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-zinc-200 mt-12 transition-all duration-300'],
    [/bg-white\/30 border-white\/40 shadow-\[0_4px_20px_rgb\(0,0,0,0\.04\)\]/g, 'bg-white border-zinc-200 shadow-sm'],
    [/bg-white\/10 border-white\/20/g, 'bg-zinc-50 border-zinc-100'],
    [/bg-white\/40 text-zinc-600 border-white\/50 hover:bg-white\/70 hover:border-white\/70/g, 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'],
    [/bg-white\/30 px-3 py-1 rounded-lg border border-white\/40/g, 'bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200']
]);

console.log("Patched OpenSales and Pipeline sections");
