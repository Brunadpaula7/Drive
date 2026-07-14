const fs = require('fs');
let code = fs.readFileSync('components/JobSection.tsx', 'utf8');

const search = `            {isOpen && (
                <div id="job-list-section">
                    <div className="mb-8">
                        <label htmlFor="search" className="sr-only">Buscar Imóvel</label>`;

const replace = `            {isOpen && (
                <div id="job-list-section">
                    <div className="mb-6">
                        <a 
                            href="https://brunadpaula7.github.io/apresenta-espdf/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center w-full sm:w-auto bg-forest text-bone hover:bg-ink px-6 py-3 rounded-xl font-bold transition-colors shadow-sm text-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            Gerar PDF de Apresentação
                        </a>
                    </div>
                    <div className="mb-8">
                        <label htmlFor="search" className="sr-only">Buscar Imóvel</label>`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('components/JobSection.tsx', code);
    console.log("Patched PDF Button");
} else {
    console.log("Not found PDF Button");
}
