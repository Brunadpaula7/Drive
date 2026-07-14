const fs = require('fs');

function patchFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Refresh button and lastSyncTime
    content = content.replace(
        /<button\s+onClick=\{\(e\)/,
        '<button \n                            onClick={(e)'
    );
    content = content.replace(
        /className="text-sm font-semibold bg-forest text-bone px-3 py-1\.5 rounded-lg hover:bg-ink transition-colors disabled:bg-sand flex items-center gap-2"/,
        'className="print:hidden text-sm font-semibold bg-forest text-bone px-3 py-1.5 rounded-lg hover:bg-ink transition-colors disabled:bg-sand flex items-center gap-2"'
    );
    content = content.replace(
        /<span className="text-xs font-medium text-stone bg-sand\/50 px-2\.5 py-1 rounded-md border border-sand\/50 flex items-center gap-1\.5"/,
        '<span className="print:hidden text-xs font-medium text-stone bg-sand/50 px-2.5 py-1 rounded-md border border-sand/50 flex items-center gap-1.5"'
    );

    // Search bar
    content = content.replace(
        /<div className="mb-8">/,
        '<div className="mb-8 print:hidden">'
    );
    // Link "Apresentações em PDF"
    content = content.replace(
        /<div className="mb-6">/,
        '<div className="mb-6 print:hidden">'
    );
    // Pagination controls
    content = content.replace(
        /<PaginationControls/,
        '<div className="print:hidden">\n                                <PaginationControls'
    );
    content = content.replace(
        /onPageChange=\{setCurrentPage\}\n\s*\/>/,
        'onPageChange={setCurrentPage}\n                            />\n                            </div>'
    );
    // LaunchSection filters
    content = content.replace(
        /<div className="mb-10 max-w-lg mx-auto relative group">/,
        '<div className="mb-10 max-w-lg mx-auto relative group print:hidden">'
    );

    fs.writeFileSync(file, content);
}

patchFile('components/JobSection.tsx');
patchFile('components/LaunchSection.tsx');

console.log("Patched print controls");
