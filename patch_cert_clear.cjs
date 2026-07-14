const fs = require('fs');
let code = fs.readFileSync('components/CertidoesSection.tsx', 'utf8');

const searchClear = `    const handleClear = () => {
        if (window.confirm('Atenção: Tem certeza que deseja apagar todos os dados atuais e iniciar um novo dossiê?')) {
            saveState({});
        }
    };

    const handlePrint = () => {
        window.print();
    };`;

const replaceClear = `    const handleClear = () => {
        saveState({});
    };`;

const searchBtns = `                            <button onClick={handleClear} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-bone text-ink rounded-xl font-medium hover:bg-sand transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Limpar Dados</span>
                            </button>
                            <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition shadow-sm hover:shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m10 0a2 2 0 01-2 2H9a2 2 0 01-2-2m10 0H9m10-4v4m-10-4v4" />
                                </svg>
                                <span>Exportar Relatório</span>
                            </button>`;

const replaceBtns = `                            <button onClick={handleClear} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-bone text-ink rounded-xl font-medium hover:bg-sand transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Limpar Dados</span>
                            </button>`;

if (code.includes(searchClear)) {
    code = code.replace(searchClear, replaceClear);
} else {
    console.log("Could not find searchClear");
}

if (code.includes(searchBtns)) {
    code = code.replace(searchBtns, replaceBtns);
} else {
    console.log("Could not find searchBtns");
}

fs.writeFileSync('components/CertidoesSection.tsx', code);
console.log("Patched!");
