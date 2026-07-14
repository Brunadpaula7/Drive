const fs = require('fs');
let code = fs.readFileSync('components/JobSection.tsx', 'utf8');

const search1 = `                        {selectedJob.url && (
                             <div className="pt-4">
                                <a href={\`https://\${selectedJob.url}\`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-ink hover:bg-forest text-bone p-3 rounded-xl text-lg font-medium shadow-lg transition-all border border-forest">
                                    Ver no Site
                                </a>
                             </div>
                        )}
                    </div>`;
                    
const replace1 = `                        <div className="pt-4 flex flex-col sm:flex-row gap-3 print:hidden">
                             {selectedJob.url && (
                                <a href={\`https://\${selectedJob.url}\`} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center text-center bg-ink hover:bg-forest text-bone p-3 rounded-xl text-lg font-medium shadow-lg transition-all border border-forest">
                                    Ver no Site
                                </a>
                             )}
                             <button onClick={() => window.print()} className="flex-1 flex justify-center items-center text-center bg-white hover:bg-bone text-ink p-3 rounded-xl text-lg font-medium shadow-sm transition-all border border-sand">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0v-2.94a2.25 2.25 0 0 1 2.25-2.25h6a2.25 2.25 0 0 1 2.25 2.25v2.94ZM15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                 </svg>
                                 Imprimir Ficha
                             </button>
                        </div>
                    </div>`;

if (code.includes(search1)) {
    code = code.replace(search1, replace1);
    fs.writeFileSync('components/JobSection.tsx', code);
    console.log("Patched JobSection with print button");
} else {
    console.log("Search 1 not found");
}

