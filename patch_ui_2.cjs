const fs = require('fs');

function patchFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
}

patchFile('components/JobSection.tsx', [
    [/bg-white\/30 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40 mt-12 transition-all duration-300/g, 'bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-zinc-200 mt-12 transition-all duration-300'],
    [/bg-white\/40 text-zinc-600 border-white\/50 hover:bg-white\/70 hover:border-white\/70/g, 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'],
    [/bg-white\/30 px-3 py-1 rounded-lg border border-white\/40/g, 'bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200'],
    [/w-full p-4 rounded-xl bg-white\/30 backdrop-blur-lg border border-white\/40 focus:ring-zinc-400\/50 focus:bg-white\/50/g, 'w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:ring-zinc-900 focus:bg-white'],
    [/bg-gradient-to-br from-zinc-200\/40 to-zinc-300\/40 border-zinc-300\/50 hover:border-zinc-400\/60 hover:shadow-\[0_8px_32px_rgba\(0,0,0,0\.1\)\]/g, 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:shadow-md'],
    [/bg-gradient-to-br from-white\/40 to-white\/20 border-white\/40 hover:bg-white\/60 hover:border-white\/70 hover:shadow-\[0_8px_32px_rgba\(0,0,0,0\.06\)\]/g, 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md']
]);

patchFile('components/LaunchSection.tsx', [
    [/bg-white\/40 backdrop-blur-xl border border-white\/50 shadow-sm hover:shadow-\[0_8px_32px_rgba\(0,0,0,0\.06\)\]/g, 'bg-white border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300'],
    [/bg-white\/40 text-zinc-600 border-white\/50 hover:bg-white\/70 hover:border-white\/70/g, 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'],
    [/bg-white\/30 px-3 py-1 rounded-lg border border-white\/40/g, 'bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200'],
    [/bg-white\/30 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40 mt-12 transition-all duration-300/g, 'bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-zinc-200 mt-12 transition-all duration-300'],
    [/bg-white\/30 backdrop-blur-lg border border-white\/40 focus:ring-zinc-400\/50 focus:bg-white\/50/g, 'bg-zinc-50 border border-zinc-200 focus:ring-zinc-900 focus:bg-white']
]);

console.log("Patched Job and Launch sections");
