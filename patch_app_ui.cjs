const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// Change the main background to match the style more uniformly
content = content.replace(/<div className="p-4 md:p-8 font-sans min-h-screen">/, '<div className="p-4 md:p-8 lg:p-12 font-sans min-h-screen bg-bone/30">');

fs.writeFileSync('App.tsx', content);
console.log('App.tsx updated');
