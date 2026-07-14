const fs = require('fs');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // revert the bad replacement
    content = content.replace(
        /const PaginationControls: React\.FC<div className="print:hidden">\n\s*<PaginationControlsProps>/,
        'const PaginationControls: React.FC<PaginationControlsProps>'
    );
    
    content = content.replace(
        /const PaginationControls: React\.FC<div className="print:hidden">\n\s*<PaginationControls/,
        'const PaginationControls: React.FC<PaginationControlsProps>'
    );
    
    content = content.replace(
        /const PaginationControls: React\.FC<div className="print:hidden">\s*<PaginationControlsProps>/,
        'const PaginationControls: React.FC<PaginationControlsProps>'
    );
    
    content = content.replace(
        /const PaginationControls: React\.FC<div className="print:hidden">\s*<PaginationControls/,
        'const PaginationControls: React.FC<PaginationControlsProps>'
    );

    // Let's just fix it manually using a simpler regex if needed, or by finding the exact bad line
    fs.writeFileSync(file, content);
}

fixFile('components/JobSection.tsx');
fixFile('components/LaunchSection.tsx');

console.log("Fixed pagination");
