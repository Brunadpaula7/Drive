const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

// Patch JSON Parser
app = app.replace(
    /areaTotal: item\.areaTotal \|\| item\.area_total,/,
    "areaTotal: item.areaTotal || item.area_total || item.area_terreno || item.areaTerreno || item.terreno || item.area_lote || item.lote,"
);

// Patch XML Parser
app = app.replace(
    /const areaTotal = getTagContent\('AreaTotal'\);/,
    "const areaTotal = getTagContent('AreaTotal') || getTagContent('AreaTerreno');"
);

fs.writeFileSync('App.tsx', app);
console.log("Parsers patched for AreaTerreno");
