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
        year: "2026 - Parte 1",
        events: [
            { id: "p1", day: "Setor Marista", name: "Alameda Opus - Construtora Opus" },
            { id: "p2", day: "Setor Marista", name: "Bioma Wellness Life - Construtora WV Maldi" },
            { id: "p3", day: "Setor Marista", name: "Dual O.M Stay - OM Incorporadora" },
            { id: "p4", day: "Setor Marista", name: "Opus Zoom 145 - Construtora Opus" },
            { id: "p5", day: "Alto da Glória", name: "Passos Flamboyant - Construtora CMO" }
        ]
    },
    {
        month: "Goiânia",
        year: "2026 - Parte 2",
        events: [
            { id: "p6", day: "Setor Marista", name: "Kairós - Construtora Tapajós" },
            { id: "p7", day: "Setor Marista", name: "Hype Ricardo Paranhos - Terral Incorporadora" },
            { id: "p8", day: "Nova Suiça", name: "Fusion Dinâmica Home - Construtora Dinâmica" },
            { id: "p9", day: "Setor Coimbra", name: "Rota Panorama - Construtora EBM" },
            { id: "p10", day: "Setor Marista", name: "Casa Conceito Marista - Construtora Terral" }
        ]
    },
    {
        month: "Goiânia",
        year: "2026 - Parte 3",
        events: [
            { id: "p11", day: "Setor Marista", name: "Metropolitan Marista - Construtora EBM" },
            { id: "p12", day: "St. Pedro Ludovico", name: "Nativ Parque Areião - Construtora Castel Infinity" },
            { id: "p13", day: "Jardim Europa", name: "Icoon Home Resort - Somos" },
            { id: "p14", day: "Pq das Laranjeiras", name: "Surya By Palme - Palme" },
            { id: "p15", day: "Setor Marista", name: "Areião 1141 - Bambuí Empreendimentos" }
        ]
    },
    {
        month: "Goiânia",
        year: "2026 - Parte 4",
        events: [
            { id: "p16", day: "St. Pedro Ludovico", name: "Una Areião - Construtora CMO" },
            { id: "p17", day: "St. Bela Vista", name: "Haile Pinheiro Club House - Loft" },
            { id: "p18", day: "Setor Marista", name: "Le Blu Consciente - Consciente" },
            { id: "p19", day: "Vila Rosa", name: "Greco Parque Cascavel - GPL Incorporadora" },
            { id: "p20", day: "Santa Genoveva", name: "Visum Residence - Regional" }
        ]
    }
];`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('constants.ts', code);
    console.log("Patched Pipeline Separe");
} else {
    console.log("Not found Pipeline Separe");
}
