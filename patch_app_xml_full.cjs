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
                        
                        let jt = getTagContent('CodigoImovel') || getTagContent('codigo') || getTagContent('referencia') || 'N/A';
                        
                        let tipo = getTagContent('TipoImovel') || getTagContent('tipo');
                        let subtipo = getTagContent('SubTipoImovel') || getTagContent('subtipo');
                        let property = getTagContent('TituloImovel') || getTagContent('titulo') || (tipo ? \`\${tipo}\${subtipo ? ' - ' + subtipo : ''}\` : 'Propriedade não informada');
                        
                        let bairro = getTagContent('Bairro') || getTagContent('bairro');
                        let cidade = getTagContent('Cidade') || getTagContent('cidade');
                        let uf = getTagContent('UF') || getTagContent('uf');
                        
                        if (bairro) property += ' - ' + bairro;
                        
                        let agents = (getTagContent('Corretor') || '').split('/').map(a => a.trim()).filter(Boolean);
                        
                        const job = \`JOB_XML_\${index}\`;
                        const raw = \`\${jt} (\${property} \${agents.length > 0 ? '- ' + agents.join(' / ') : ''})\`.trim();
                        
                        // New fields for the modal
                        let locationDetails = [bairro, cidade, uf].filter(Boolean).join(', ');
                        
                        let area = getTagContent('AreaUtil') || getTagContent('areautil') || getTagContent('AreaPrivativa');
                        let areaTotal = getTagContent('AreaTotal') || getTagContent('areatotal');
                        let quartos = getTagContent('QtdDormitorios') || getTagContent('quartos');
                        let suites = getTagContent('QtdSuites') || getTagContent('suites');
                        let salas = getTagContent('QtdSalas') || getTagContent('salas');
                        let bathrooms = getTagContent('QtdBanheiros') || getTagContent('banheiros');
                        let parking = getTagContent('QtdVagas') || getTagContent('vagas');
                        
                        let price = getTagContent('PrecoVenda') || getTagContent('precovenda');
                        if (price && !price.startsWith('R$')) price = 'R$ ' + Number(price).toLocaleString('pt-BR');
                        
                        let condominio = getTagContent('ValorCondominio') || getTagContent('valorcondominio');
                        let iptu = getTagContent('ValorIPTU') || getTagContent('valoriptu');
                        
                        let description = getTagContent('Observacao') || getTagContent('descricao') || getTagContent('Descricao');
                        
                        let photos = [];
                        let fotosNode = imovel.getElementsByTagName('Fotos')[0] || imovel.getElementsByTagName('fotos')[0];
                        if (fotosNode) {
                            let fotoNodes = Array.from(fotosNode.getElementsByTagName('Foto'));
                            if(fotoNodes.length === 0) fotoNodes = Array.from(fotosNode.getElementsByTagName('foto'));
                            photos = fotoNodes.map(f => {
                                let urlNode = f.getElementsByTagName('URLArquivo')[0] || f.getElementsByTagName('url')[0] || f.getElementsByTagName('URL')[0];
                                return urlNode?.textContent?.trim();
                            }).filter(Boolean);
                        }
                        
                        // Parse JetImoveis URL if available
                        let url = getTagContent('URLImovel') || getTagContent('link');
                        
                        return {
                            id: \`\${job}-\${jt}-\${Math.random()}\`,
                            job,
                            jt,
                            property,
                            agents,
                            raw,
                            locationDetails,
                            area,
                            areaTotal,
                            quartos,
                            suites,
                            salas,
                            bathrooms,
                            parking,
                            price,
                            condominio,
                            iptu,
                            description,
                            photos,
                            url
                        };
                    });
`;

content = content.replace(/\/\/ Find imovel tags case-insensitively[\s\S]*?raw,\s*};\s*}\);\s*}\s*}\ catch/g, replacement.trim() + '\n                }\n            } catch');

fs.writeFileSync('App.tsx', content);
console.log("Patched App.tsx XML parser with full fields");
