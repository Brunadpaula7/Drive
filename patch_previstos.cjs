const fs = require('fs');
let code = fs.readFileSync('constants.ts', 'utf8');

const search = `export const initialPipelineData: PipelineMonth[] = [
    {
        month: "Goiânia",
        year: "2026",
        events: [
            { id: "p1", day: "Setor Marista", name: "Alameda Opus - Construtora Opus" },
            { id: "p2", day: "Setor Marista", name: "Bioma Wellness Life - Construtora WV Maldi" },
            { id: "p3", day: "Setor Marista", name: "Dual O.M Stay - OM Incorporadora" },
            { id: "p4", day: "Setor Marista", name: "Opus Zoom 145 - Construtora Opus" },
            { id: "p5", day: "Alto da Glória", name: "Passos Flamboyant - Construtora CMO" },
            { id: "p6", day: "Setor Marista", name: "Kairós - Construtora Tapajós" },
            { id: "p7", day: "Setor Marista", name: "Hype Ricardo Paranhos - Terral Incorporadora" },
            { id: "p8", day: "Nova Suiça", name: "Fusion Dinâmica Home - Construtora Dinâmica" },
            { id: "p9", day: "Setor Coimbra", name: "Rota Panorama - Construtora EBM" },
            { id: "p10", day: "Setor Marista", name: "Casa Conceito Marista - Construtora Terral" },
            { id: "p11", day: "Setor Marista", name: "Metropolitan Marista - Construtora EBM" },
            { id: "p12", day: "St. Pedro Ludovico", name: "Nativ Parque Areião - Construtora Castel Infinity" },
            { id: "p13", day: "Jardim Europa", name: "Icoon Home Resort - Somos" },
            { id: "p14", day: "Pq das Laranjeiras", name: "Surya By Palme - Palme" },
            { id: "p15", day: "Setor Marista", name: "Areião 1141 - Bambuí Empreendimentos" },
            { id: "p16", day: "St. Pedro Ludovico", name: "Una Areião - Construtora CMO" },
            { id: "p17", day: "St. Bela Vista", name: "Haile Pinheiro Club House - Loft" },
            { id: "p18", day: "Setor Marista", name: "Le Blu Consciente - Consciente" },
            { id: "p19", day: "Vila Rosa", name: "Greco Parque Cascavel - GPL Incorporadora" },
            { id: "p20", day: "Santa Genoveva", name: "Visum Residence - Regional" }
        ]
    }
];`;

const replace = `export const initialPipelineData: PipelineMonth[] = [
    {
        month: "Goiânia",
        year: "2026",
        events: [
            { id: "p1", day: "Setor Marista", name: "Alameda Opus - Construtora Opus" },
            { id: "p2", day: "Setor Marista", name: "Bioma Wellness Life - Construtora WV Maldi" },
            { id: "p3", day: "Setor Marista", name: "Dual O.M Stay - OM Incorporadora" },
            { id: "p4", day: "Setor Marista", name: "Opus Zoom 145 - Construtora Opus" },
            { id: "p5", day: "Alto da Glória", name: "Passos Flamboyant - Construtora CMO" },
            { id: "p6", day: "Setor Marista", name: "Kairós - Construtora Tapajós" },
            { id: "p7", day: "Setor Marista", name: "Hype Ricardo Paranhos - Terral Incorporadora" },
            { id: "p8", day: "Nova Suiça", name: "Fusion Dinâmica Home - Construtora Dinâmica" },
            { id: "p9", day: "Setor Coimbra", name: "Rota Panorama - Construtora EBM" },
            { id: "p10", day: "Setor Marista", name: "Casa Conceito Marista - Construtora Terral" },
            { id: "p11", day: "Setor Marista", name: "Metropolitan Marista - Construtora EBM" },
            { id: "p12", day: "St. Pedro Ludovico", name: "Nativ Parque Areião - Construtora Castel Infinity" },
            { id: "p13", day: "Jardim Europa", name: "Icoon Home Resort - Somos" },
            { id: "p14", day: "Pq das Laranjeiras", name: "Surya By Palme - Palme" },
            { id: "p15", day: "Setor Marista", name: "Areião 1141 - Bambuí Empreendimentos" },
            { id: "p16", day: "St. Pedro Ludovico", name: "Una Areião - Construtora CMO" },
            { id: "p17", day: "St. Bela Vista", name: "Haile Pinheiro Club House - Loft" },
            { id: "p18", day: "Setor Marista", name: "Le Blu Consciente - Consciente" },
            { id: "p19", day: "Vila Rosa", name: "Greco Parque Cascavel - GPL Incorporadora" },
            { id: "p20", day: "Santa Genoveva", name: "Visum Residence - Regional" }
        ]
    },
    {
        month: "Lançamentos Previstos",
        year: "Jul/2026",
        events: [
            { id: "prev1", day: "Setor Marista", name: "Lançamento MyBroker Marista" },
            { id: "prev2", day: "Setor Marista", name: "Pré-Lançamento City Rua 1142 - City 35" }
        ]
    },
    {
        month: "Lançamentos Previstos",
        year: "Ago/2026",
        events: [
            { id: "prev3", day: "Setor Marista", name: "Lançamento Brasal Ricardo Paranhos" },
            { id: "prev4", day: "Jardim Atlantico", name: "Lançamento FR - Jardim Atlantico" },
            { id: "prev5", day: "Setor Marista", name: "Lançamento UP" },
            { id: "prev6", day: "Setor Bueno", name: "Pré-lançamento Ávolli T-30" },
            { id: "prev7", day: "Jardim Goiás", name: "Pré-lançamento Flamboyant Avenida H" },
            { id: "prev8", day: "Jardim Atlantico", name: "Vibe Parque Cascavel" }
        ]
    },
    {
        month: "Lançamentos Previstos",
        year: "Set/2026",
        events: [
            { id: "prev9", day: "Jardim América", name: "Pré-lançamento Bambui Rua C-242" },
            { id: "prev10", day: "Setor Nova Suiça", name: "Pré-lançamento Dinâmica Rua C-247" },
            { id: "prev11", day: "Setor Marista", name: "Pré-lançamento Martins Soares" },
            { id: "prev12", day: "Jardim América", name: "Pré-lançamento Palme Rua C-241" }
        ]
    },
    {
        month: "Lançamentos Previstos",
        year: "Out/2026",
        events: [
            { id: "prev13", day: "Setor Marista", name: "Lançamento Brasal Marista" },
            { id: "prev14", day: "Setor Marista", name: "Lançamento City Quartier 245 - Rua 1136" },
            { id: "prev15", day: "Jardim América", name: "Lançamento Serca" }
        ]
    },
    {
        month: "Lançamentos Previstos",
        year: "Mai/2027",
        events: [
            { id: "prev16", day: "Jardim Goiás", name: "Lançamento Flamboyant & Foster + Partners" }
        ]
    }
];`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('constants.ts', code);
    console.log("Patched constants");
} else {
    console.log("Not found constants");
}
