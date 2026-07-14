const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

// We need to inject a JobDetailContent component that maintains the state of the selected photo.
const jobDetailComponent = `
const JobDetailContent: React.FC<{ job: Job }> = ({ job }) => {
    const photos = Array.isArray(job.photos) ? job.photos.filter(p => typeof p === 'string') : [];
    const [activePhoto, setActivePhoto] = useState<string | null>(photos.length > 0 ? photos[0] : null);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 lg:w-3/5 space-y-4">
                {photos.length > 0 ? (
                    <div className="space-y-4">
                        <div className="w-full h-[300px] sm:h-[400px] bg-bone rounded-2xl overflow-hidden shadow-sm border border-sand">
                            <img src={activePhoto!} alt="Principal" className="w-full h-full object-cover" />
                        </div>
                        {photos.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                {photos.map((photo, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActivePhoto(photo)}
                                        className={\`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all \${activePhoto === photo ? 'border-forest ring-2 ring-forest/20' : 'border-transparent opacity-70 hover:opacity-100'}\`}
                                    >
                                        <img src={photo} alt={\`Miniatura \${idx+1}\`} className="w-full h-full object-cover" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-[300px] flex items-center justify-center bg-sand/30 rounded-2xl border border-sand text-stone/50">
                        <span className="font-medium">Sem fotos disponíveis</span>
                    </div>
                )}

                {job.description && (
                    <div className="bg-white p-6 rounded-2xl border border-sand/50 shadow-sm mt-6">
                        <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-sand pb-2">Descrição do Imóvel</h4>
                        <p className="text-base text-stone leading-relaxed whitespace-pre-line">{String(job.description)}</p>
                    </div>
                )}
            </div>
            
            <div className="flex-1 lg:w-2/5 flex flex-col space-y-6">
                <div className="bg-sand/30 p-6 rounded-2xl border border-sand">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[11px] font-bold text-stone uppercase tracking-wider mb-1">Código</p>
                            <p className="text-2xl font-black text-ink">{String(job.jt)}</p>
                        </div>
                        {job.operacao && (
                            <span className="bg-ink text-bone text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                {String(job.operacao)}
                            </span>
                        )}
                    </div>

                    {job.locationDetails && (
                        <div className="mb-6">
                            <p className="text-[11px] font-bold text-stone uppercase tracking-wider mb-1">Localização</p>
                            <p className="text-base font-semibold text-ink">{String(job.locationDetails)}</p>
                        </div>
                    )}

                    {(job.price || job.condominio || job.iptu) && (
                        <div className="space-y-3 mb-6 bg-white p-4 rounded-xl border border-sand/50">
                            {job.price && (
                                <div>
                                    <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Valor</p>
                                    <p className="text-2xl font-bold text-forest">{String(job.price)}</p>
                                </div>
                            )}
                            <div className="flex gap-4 pt-2">
                                {job.condominio && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Condomínio</p>
                                        <p className="text-sm font-semibold text-ink">R$ {Number(job.condominio).toLocaleString('pt-BR')}</p>
                                    </div>
                                )}
                                {job.iptu && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">IPTU {job.iptuTipo ? '(' + job.iptuTipo + ')' : ''}</p>
                                        <p className="text-sm font-semibold text-ink">R$ {Number(job.iptu).toLocaleString('pt-BR')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {job.tipo && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Tipo</p>
                                <p className="text-sm font-semibold text-ink">{String(job.tipo)}</p>
                            </div>
                        )}
                        {job.area && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Área Útil</p>
                                <p className="text-sm font-semibold text-ink">{String(job.area)} m²</p>
                            </div>
                        )}
                        {job.areaTotal && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Área Total</p>
                                <p className="text-sm font-semibold text-ink">{String(job.areaTotal)} m²</p>
                            </div>
                        )}
                        {job.quartos && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Quartos</p>
                                <p className="text-sm font-semibold text-ink">{String(job.quartos)}</p>
                            </div>
                        )}
                        {job.suites && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Suítes</p>
                                <p className="text-sm font-semibold text-ink">{String(job.suites)}</p>
                            </div>
                        )}
                        {job.salas && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Salas</p>
                                <p className="text-sm font-semibold text-ink">{String(job.salas)}</p>
                            </div>
                        )}
                        {job.bathrooms && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Banheiros</p>
                                <p className="text-sm font-semibold text-ink">{String(job.bathrooms)}</p>
                            </div>
                        )}
                        {job.parking && (
                            <div>
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Vagas</p>
                                <p className="text-sm font-semibold text-ink">{String(job.parking)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {Array.isArray(job.features) && job.features.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-sand/50 shadow-sm">
                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider mb-3">Características</p>
                        <div className="flex flex-wrap gap-2">
                            {job.features.map((feature, idx) => (
                                <span key={idx} className="bg-sand/30 text-ink px-3 py-1 rounded-full text-xs font-medium border border-sand">
                                    {String(feature)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-auto pt-6 flex flex-col gap-3 print:hidden">
                     {job.url && (
                        <a href={\`https://\${job.url}\`} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center bg-ink hover:bg-forest text-bone py-3.5 px-6 rounded-xl text-base font-bold shadow-md transition-all border border-transparent hover:border-forest/50">
                            Ver Imóvel no Site
                        </a>
                     )}
                     <button onClick={() => window.print()} className="w-full flex justify-center items-center bg-white hover:bg-bone text-ink py-3.5 px-6 rounded-xl text-base font-bold shadow-sm transition-all border border-sand">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0v-2.94a2.25 2.25 0 0 1 2.25-2.25h6a2.25 2.25 0 0 1 2.25 2.25v2.94ZM15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                         </svg>
                         Imprimir Ficha
                     </button>
                </div>
            </div>
        </div>
    );
};
`;

content = content.replace(/export const JobSection/, jobDetailComponent + "\n\nexport const JobSection");

// Now replace the modal content
const oldModalRegex = /<Modal isOpen=\{!!selectedJob\}[^>]*>([\s\S]*?)<\/Modal>/;
content = content.replace(oldModalRegex, 
    `<Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob.title || (typeof selectedJob.property === 'string' ? selectedJob.property.split(' | ')[0] : 'Detalhes do Imóvel')}>
        <JobDetailContent job={selectedJob} />
    </Modal>`
);

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched Job Modal");
