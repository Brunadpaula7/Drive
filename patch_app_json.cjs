const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

const replacement = `
                        area: item.area,
                        suites: item.suites,
                        bathrooms: item.banheiros,
                        parking: item.vagas,
                        locationDetails: locationDetails,
                        price: price,
                        photos: item.fotos,
                        url: item.url,
                        areaTotal: item.areaTotal || item.area_total,
                        quartos: item.quartos,
                        salas: item.salas,
                        condominio: item.condominio || item.valor_condominio,
                        iptu: item.iptu || item.valor_iptu,
                        iptuTipo: item.iptuTipo || item.tipo_iptu,
                        title: item.titulo
`;

app = app.replace(/                        area: item\.area,\n                        suites: item\.suites,\n                        bathrooms: item\.banheiros,\n                        parking: item\.vagas,\n                        locationDetails: locationDetails,\n                        price: price,\n                        photos: item\.fotos,\n                        url: item\.url/, replacement.trim());

fs.writeFileSync('App.tsx', app);
console.log("App.tsx JSON parser patched");
