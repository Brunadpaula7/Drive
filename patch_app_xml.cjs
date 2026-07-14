const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const replacement = `
                    // Find imovel tags case-insensitively
                    let imoveis = Array.from(xmlDoc.getElementsByTagName('Imovel'));
                    if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('imovel'));
                    if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('IMOVEL'));
                    
                    xmlJobs = imoveis.map((imovel, index) => {
                        const getTagContent = (tagName) => {
                            let tag = imovel.getElementsByTagName(tagName)[0];
                            if (!tag) tag = imovel.getElementsByTagName(tagName.toLowerCase())[0];
                            if (!tag) tag = imovel.getElementsByTagName(tagName.toUpperCase())[0];
                            return tag?.textContent?.trim() || '';
                        };
                        
                        let jt = getTagContent('CodigoImovel');
                        if (!jt) jt = getTagContent('codigo');
                        if (!jt) jt = getTagContent('referencia');
                        if (!jt) jt = 'N/A';
                        
                        let property = getTagContent('TituloImovel');
                        if (!property) property = getTagContent('TipoImovel');
                        if (!property) property = 'Propriedade não informada';
                        
                        let bairro = getTagContent('Bairro');
                        if (bairro) property += ' - ' + bairro;
                        
                        let agents = (getTagContent('Corretor') || '').split('/').map(a => a.trim()).filter(Boolean);
                        
                        const job = \`JOB_XML_\${index}\`;
                        const raw = \`\${jt} (\${property} \${agents.length > 0 ? '- ' + agents.join(' / ') : ''})\`.trim();
                        
                        return {
                            id: \`\${job}-\${jt}-\${Math.random()}\`,
                            job,
                            jt,
                            property,
                            agents,
                            raw,
                        };
                    });
`;

content = content.replace(/const imoveis = Array\.from\(xmlDoc\.getElementsByTagName\('Imovel'\)\);\s*xmlJobs = imoveis\.map\(\(imovel, index\) => \{.*?\n\s*\}\)\.filter\(job => job\.jt !== 'N\/A'\);/s, replacement);

fs.writeFileSync('App.tsx', content);
console.log("Patched XML parsing");
