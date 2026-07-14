const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/          \}\n        \}\n    <\/script>/, "          }\n        }\n      }\n    </script>");
fs.writeFileSync('index.html', html);
