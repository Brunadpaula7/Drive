const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const searchData = `    // Filter projects for the "Lançamentos com vendas abertas" section
    const openSalesProjects = useMemo(() => {
        const specificOpenSalesNames = [
            "Verdô Bueno", "Capadócia Marista", "Olivier O.M Home", "Solenne Consciente",
            "Casamérica Parque Cascavel", "Loc Serrinha", "Natura Lourenzzo", "Opus Zoom Marista"
        ];
        return launchesData.filter(project => specificOpenSalesNames.includes(project.name));
    }, [launchesData]);\n`;
const replaceData = ``;

if (code.includes(searchData)) {
    code = code.replace(searchData, replaceData);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App.tsx to remove openSalesProjects useMemo");
} else {
    console.log("Not found openSalesProjects useMemo");
}
