const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/      \}\n        \}\n      \}\n    <\/script>/, '    <\/script>');
fs.writeFileSync('index.html', html);
