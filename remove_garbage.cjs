const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const exportIndex = content.indexOf('export default App;');
if (exportIndex !== -1) {
    content = content.substring(0, exportIndex + 'export default App;\n'.length);
    fs.writeFileSync('App.tsx', content);
    console.log("Removed garbage at the end of App.tsx");
}
