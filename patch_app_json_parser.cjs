const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const regex = /const parsedJobs = useMemo\(\(\): Job\[\] => \{[\s\S]*?\}, \[rawJobData\]\);/g;

const newParsedJobs = `const parsedJobs = useMemo((): Job[] => {
        const data = rawJobData.trim();
        if (!data) return [];
        
        let parsedJobsResult: Job[] = [];
        
        // JSON Parser for Google Apps Script
        if (data.startsWith('[')) {
            try {
                const jsonData = JSON.parse(data);
                parsedJobsResult = jsonData.map((item: any, index: number) => {
                    const jt = item.id || 'N/A';
                    
                    let property = item.titulo || item.tipo || 'Propriedade não informada';
                    if (!item.titulo && item.bairro) property += ' - ' + item.bairro;
                    
                    const job = \`JOB_JSON_\${index}\`;
                    const raw = \`\${jt} (\${property})\`.trim();
                    
                    let locationDetails = [item.bairro, item.cidade].filter(Boolean).join(', ');
                    
                    let price = item.valor ? (typeof item.valor === 'string' && item.valor.startsWith('R') ? item.valor : 'R$ ' + Number(item.valor).toLocaleString('pt-BR')) : undefined;
                    
                    let photos = item.fotos || [];
                    if (typeof photos === 'string') {
                        try { photos = JSON.parse(photos); } catch (e) { photos = [photos]; }
                    }

                    return {
                        id: \`\${job}-\${jt}-\${Math.random()}\`,
                        job,
                        jt,
                        property,
                        agents: [],
                        raw,
                        locationDetails,
                        area: item.area_privativa,
                        quartos: item.quartos,
                        suites: item.suites,
                        parking: item.vagas,
                        price,
                        condominio: item.condominio,
                        iptu: item.iptu,
                        description: item.descricao,
                        photos,
                        url: item.url || ''
                    };
                });
            } catch (e) {
                console.error("Error processing JSON job data:", e);
            }
        }
        
        // XML Parser for JetImoveis VrSync format
        if (data.startsWith('<')) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const parserError = xmlDoc.getElementsByTagName("parsererror");
                if (parserError.length) {
                  console.error("XML parsing error:", parserError[0].textContent);
                  // We'll fall through to the text parser if XML fails
                } else {
                    // Find imovel tags case-insensitively
                    let imoveis = Array.from(xmlDoc.getElementsByTagName('Imovel'));
                    if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('imovel'));
                    if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('IMOVEL'));
                    
                    parsedJobsResult = imoveis.map((imovel, index) => {
                        const getTagContent = (tagName: string) => {
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
                        
                        let photos: string[] = [];
                        let fotosNode = imovel.getElementsByTagName('Fotos')[0] || imovel.getElementsByTagName('fotos')[0];
                        if (fotosNode) {
                            let fotoNodes = Array.from(fotosNode.getElementsByTagName('Foto'));
                            if(fotoNodes.length === 0) fotoNodes = Array.from(fotosNode.getElementsByTagName('foto'));
                            photos = fotoNodes.map(f => {
                                let urlNode = f.getElementsByTagName('URLArquivo')[0] || f.getElementsByTagName('url')[0] || f.getElementsByTagName('URL')[0];
                                return urlNode?.textContent?.trim();
                            }).filter((u): u is string => Boolean(u));
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
                }
            } catch (e) {
                console.error("Error processing XML job data:", e);
            }
        }
        
        if (parsedJobsResult.length > 0) {
            return parsedJobsResult;
        }

        // Original Text Parser
        return data.split('\\n').map(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return null;
            
            const jobMatch = cleanLine.match(/^(JOB|TRABALHO|EMPREGO)(\\d*)\\s*/i);
            const jtMatch = cleanLine.match(/(JT\\d+|GY\\d+|GT\\d+|JT\\?|JT\\s\\?)/i);
            const contentMatch = cleanLine.match(/\\((.*?)\\)/);
            
            let itemJob = '';
            if (jobMatch) {
                itemJob = \`JOB\${jobMatch[2]}\`;
            } else {
                itemJob = \`JOB_MISSING_\${Math.random().toString(36).substring(2, 9)}\`;
            }
            
            const jt = jtMatch ? jtMatch[1].toUpperCase() : 'N/A';
            const content = contentMatch ? contentMatch[1] : '';
            
            let property = '';
            let agents: string[] = [];
            
            if (content) {
                const parts = content.split(' - ');
                property = parts[0] || '';
                if (parts.length > 1) {
                    agents = parts.slice(1).join(' - ').split('/').map(a => a.trim());
                }
            } else {
                property = cleanLine;
            }

            return {
                id: \`\${itemJob}-\${jt}-\${Math.random()}\`,
                job: itemJob,
                jt,
                property,
                agents,
                raw: cleanLine
            };
        }).filter((item): item is Job => item !== null && !!item.job && true);
    }, [rawJobData]);`;

content = content.replace(regex, () => newParsedJobs);

fs.writeFileSync('App.tsx', content);
console.log("Updated parsing logic");
