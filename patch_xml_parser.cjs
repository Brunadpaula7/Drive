const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

const xmlReplaceSearch = `                    return {
                        id: \`\${job}-\${jt}-\${Math.random()}\`,
                        job,
                        jt,
                        property,
                        agents,
                        raw,
                    };`;

const xmlReplaceWith = `                    const area = getTagContent('AreaUtil') || getTagContent('AreaTotal');
                    const areaTotal = getTagContent('AreaTotal');
                    const quartos = getTagContent('QtdDormitorios');
                    const suites = getTagContent('QtdSuites');
                    const banheiros = getTagContent('QtdBanheiros');
                    const vagas = getTagContent('QtdVagas');
                    const salas = getTagContent('QtdSalas');
                    const condominio = getTagContent('ValorCondominio');
                    const iptu = getTagContent('ValorIPTU');
                    const preco = getTagContent('PrecoVenda');
                    
                    return {
                        id: \`\${job}-\${jt}-\${Math.random()}\`,
                        job,
                        jt,
                        property,
                        agents,
                        raw,
                        title: property,
                        area: area,
                        areaTotal: areaTotal,
                        quartos: quartos,
                        suites: suites,
                        bathrooms: banheiros,
                        parking: vagas,
                        salas: salas,
                        condominio: condominio,
                        iptu: iptu,
                        price: preco ? 'R$ ' + Number(preco).toLocaleString('pt-BR') : '',
                        description: getTagContent('Observacao')
                    };`;

app = app.replace(xmlReplaceSearch, xmlReplaceWith);
fs.writeFileSync('App.tsx', app);
console.log("XML parser patched");
