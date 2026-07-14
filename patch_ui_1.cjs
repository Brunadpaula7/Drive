const fs = require('fs');

function patchFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
}

// 1. LogoSection.tsx
patchFile('components/LogoSection.tsx', [
    [/className="bg-white\/30 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40 mt-12 transition-all duration-300"/g, 'className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-zinc-200 mt-12 transition-all duration-300"'],
    [/className="bg-white\/30 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-white\/40 transition-all duration-300"/g, 'className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-zinc-200 transition-all duration-300"'],
    [/bg-white\/20 backdrop-blur-md border border-white\/30 shadow-sm/g, 'bg-white border border-zinc-200 shadow-sm'],
    [/hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.06\)\]/g, 'hover:shadow-md hover:border-zinc-300'],
    [/hover:bg-white\/30/g, 'hover:bg-zinc-50'],
    [/bg-white\/40 rounded-full flex items-center justify-center shadow-sm/g, 'bg-zinc-50 rounded-full flex items-center justify-center'],
    [/border border-white\/60 group-hover:bg-white\/80/g, 'border border-zinc-100 group-hover:bg-white group-hover:border-zinc-200'],
    [/bg-white\/30 backdrop-blur-lg border border-white\/40 focus:ring-zinc-400\/50 focus:bg-white\/50/g, 'bg-zinc-50 border border-zinc-200 focus:ring-zinc-900 focus:bg-white'],
    [/bg-white\/40 text-zinc-600 border-white\/50 hover:bg-white\/70 hover:border-white\/70/g, 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'],
    [/bg-white\/30 px-3 py-1 rounded-lg border border-white\/40/g, 'bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200']
]);

// 2. LogoItem.tsx
patchFile('components/LogoItem.tsx', [
    [/bg-white\/20 backdrop-blur-md border border-white\/30 shadow-sm transition-all duration-300 hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.06\)\] hover:-translate-y-1 hover:bg-white\/30/g, 'bg-white border border-zinc-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-zinc-50 hover:border-zinc-300'],
    [/bg-white\/40 rounded-full flex items-center justify-center shadow-sm mb-3 transition-all duration-500 group-hover:scale-105 border border-white\/60 group-hover:bg-white\/80 group-hover:shadow-md/g, 'bg-zinc-50 rounded-full flex items-center justify-center shadow-sm mb-3 transition-all duration-500 group-hover:scale-105 border border-zinc-100 group-hover:bg-white group-hover:shadow-md']
]);

console.log("Patched Logo files");
