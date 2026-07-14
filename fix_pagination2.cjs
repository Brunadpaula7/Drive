const fs = require('fs');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // First, let's look for exactly what we have right now around PaginationControls
    // It's probably:
    //                             </div> 
    //                             <PaginationControls
    //                                 currentPage={currentPage}
    //                                totalPages={totalPages}
    //                                onPageChange={setCurrentPage}
    //                            />
    //                            </div>
    
    // So we just want to remove the extra </div> we added.
    content = content.replace(
        /onPageChange=\{setCurrentPage\}\n\s*\/>\n\s*<\/div>/,
        'onPageChange={setCurrentPage}\n                            />'
    );

    // And add the <div className="print:hidden"> wrapper around the PaginationControls component usage
    content = content.replace(
        /<PaginationControls\s+currentPage=\{currentPage\}/,
        '<div className="print:hidden">\n                                <PaginationControls currentPage={currentPage}'
    );
    
    // and close it
    content = content.replace(
        /onPageChange=\{setCurrentPage\}\n\s*\/>/,
        'onPageChange={setCurrentPage}\n                                />\n                            </div>'
    );

    fs.writeFileSync(file, content);
}

fixFile('components/JobSection.tsx');
fixFile('components/LaunchSection.tsx');

console.log("Fixed pagination properly");
