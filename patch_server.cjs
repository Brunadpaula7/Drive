const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/res\.setHeader\('Content-Type', 'text\/xml'\);/g, `
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
`);

fs.writeFileSync('server.ts', content);
