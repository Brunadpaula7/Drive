const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const parserCode = `
        if (data.startsWith('[')) {
            try {
                const jsonArray = JSON.parse(data);
                return jsonArray.map((item: any) => {
                    const jt = item.id || 'N/A';
                    const property = item.titulo || 'Propriedade não informada';
                    
                    const size = item.area ? item.area + ' m²' : '';
                    const suites = item.suites ? item.suites + ' suítes' : '';
                    const vagas = item.vagas ? item.vagas + ' vagas' : '';
                    const locationDetails = [item.bairro, item.cidade].filter(Boolean).join(', ');
                    const price = item.valor ? 'R$ ' + item.valor.toLocaleString('pt-BR') : '';
                    
                    const details = [item.tipo, size, suites, vagas, locationDetails, price].filter(Boolean).join(' - ');
                    const fullProperty = property + ' | ' + details;

                    return {
                        id: 'JSON-' + jt + '-' + Math.random(),
                        job: 'JSON-' + jt,
                        jt,
                        property: fullProperty,
                        agents: [],
                        raw: jt + ' - ' + fullProperty,
                        description: item.descricao,
                        area: item.area,
                        suites: item.suites,
                        bathrooms: item.banheiros,
                        parking: item.vagas,
                        locationDetails: locationDetails,
                        price: price,
                        photos: item.fotos,
                        url: item.url
                    };
                }).filter((item: Job) => item.jt !== 'N/A');
            } catch (error) {
                console.error("Error processing JSON job data:", error);
                return [];
            }
        }
`;

// we need to replace the old JSON parser block with this new one
const regex = /if \(data\.startsWith\('\['\)\) \{[\s\S]*?\} catch \(error\) \{[\s\S]*?return \[\];[\s\S]*?\}[\s\S]*?\}/;
code = code.replace(regex, parserCode.trim());

fs.writeFileSync('App.tsx', code);
console.log('App.tsx patched again');
