
import React, { useState, useMemo, useEffect } from 'react';
import type { Job } from '../types';
import { Modal } from './Modal';

interface JobSectionProps {
    jobs: Job[];
    onRefresh?: () => void;
    isRefreshing?: boolean;
    globalSearch?: string;

}

const JtJobListItem: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => {
    let formattedJt = job.jt.replace(/^JT\s*/i, '');
    if (formattedJt.toUpperCase().startsWith('GT')) {
        formattedJt = 'GY' + formattedJt.substring(2);
    }
    if (formattedJt.startsWith('GY') && !formattedJt.includes(' ')) {
        formattedJt = `GY ${formattedJt.substring(2)}`;
    }
    const isSpecialJob = job.jt.startsWith('GY') || job.jt.startsWith('GT');
    
    const coverPhoto = Array.isArray(job.photos) && job.photos.length > 0 ? job.photos[0] : null;
    
    // Parse price safely
    let displayPrice = '';
    if (job.price) {
        displayPrice = String(job.price);
    }

    return (
        <div 
            className={`
                group relative flex flex-col h-[320px] w-full rounded-2xl border transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white
                ${isSpecialJob ? 'border-sand hover:border-stone hover:shadow-xl' : 'border-sand hover:border-stone hover:shadow-xl'}
                hover:-translate-y-1
            `}
            title={job.raw}
            onClick={onClick}
        >
            <div className="w-full h-[180px] bg-bone relative flex-shrink-0 overflow-hidden">
                {coverPhoto ? (
                    <img src={coverPhoto} alt={job.property} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone/40 bg-sand/20">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-ink/90 backdrop-blur-sm text-bone text-xs font-bold px-3 py-1.5 rounded-lg shadow-md tracking-wider">
                    {formattedJt}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-ink leading-tight line-clamp-2 mb-1 group-hover:text-forest transition-colors">
                    {job.property || 'Propriedade não listada'}
                </h3>
                {job.locationDetails && (
                    <p className="text-xs text-stone line-clamp-1 mb-3">{job.locationDetails}</p>
                )}
                
                <div className="mt-auto flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                        {job.quartos && (
                            <span className="text-[10px] font-semibold bg-sand/30 px-2 py-1 rounded text-stone">
                                {job.quartos} {String(job.quartos) === '1' ? 'quarto' : 'quartos'}
                            </span>
                        )}
                        {job.area && (
                            <span className="text-[10px] font-semibold bg-sand/30 px-2 py-1 rounded text-stone">
                                {job.area} m²
                            </span>
                        )}
                    </div>
                    {displayPrice && (
                        <p className="text-sm font-bold text-ink">{displayPrice}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const JOBS_PER_PAGE = 15;

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const btnBase = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border shadow-sm ";
    const btnActive = "bg-bone/40 text-stone border-sand hover:bg-sand/70 hover:text-ink hover:border-stone disabled:opacity-30 disabled:cursor-not-allowed";

    return (
        <div className="flex justify-center items-center space-x-4 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${btnBase} ${btnActive}`}
                aria-label="Go to previous page"
            >
                Anterior
            </button>
            <span className="text-ink font-bold bg-sand px-3 py-1 rounded-lg border border-sand" aria-live="polite">
                {currentPage} <span className="text-sand font-normal mx-1">/</span> {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${btnBase} ${btnActive}`}
                aria-label="Go to next page"
            >
                Próximo
            </button>
        </div>
    );
};



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
                                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activePhoto === photo ? 'border-forest ring-2 ring-forest/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={photo} alt={`Miniatura ${idx+1}`} className="w-full h-full object-cover" loading="lazy" />
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
                        <a href={`https://${job.url}`} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center bg-ink hover:bg-forest text-bone py-3.5 px-6 rounded-xl text-base font-bold shadow-md transition-all border border-transparent hover:border-forest/50">
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


export const JobSection: React.FC<JobSectionProps> = ({ jobs, onRefresh, isRefreshing, globalSearch }) => {
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

    useEffect(() => {
        const checkSyncTime = () => {
            const syncTime = localStorage.getItem('lastSyncTime');
            if (syncTime) {
                const date = new Date(parseInt(syncTime, 10));
                setLastSyncTime(date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
            }
        };
        checkSyncTime();
        const interval = setInterval(checkSyncTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);


    const filteredJobs = useMemo(() => {
        let result = jobs;
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            result = result.filter(job => (job.raw || '').toLowerCase().includes(searchLower));
        }
        if (query) {
            const queryLower = query.toLowerCase();
            result = result.filter(job => (job.raw || '').toLowerCase().includes(queryLower));
        }
        return result;
    }, [query, globalSearch, jobs]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [query, globalSearch]);

    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
        return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
    }, [filteredJobs, currentPage]);


    return (
        <section className="bg-bone/60 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-sand/40 my-8 transition-all duration-500 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <div 
                className="flex items-center justify-between mb-8 cursor-pointer group select-none "
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4 mr-3">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight group-hover:text-forest transition-colors">
                        Revendas Nido
                    </h2>
                    {onRefresh && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                            disabled={isRefreshing}
                            className="print:hidden text-sm font-semibold bg-forest text-bone px-3 py-1.5 rounded-lg hover:bg-ink transition-colors disabled:bg-sand flex items-center gap-2"
                        >
                            {isRefreshing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Atualizando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                    Sincronizar XML
                                </>
                            )}
                        </button>
                    )}
                    {lastSyncTime && (
                        <span className="print:hidden text-xs font-medium text-stone bg-sand/50 px-2.5 py-1 rounded-md border border-sand/50 flex items-center gap-1.5" title="Última sincronização dos dados">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
                            Última atualização: {lastSyncTime}
                        </span>
                    )}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-7 h-7 text-stone group-hover:text-ink transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''} print:hidden`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            <div id="job-list-section" className={!isOpen ? "hidden print:block" : "block"}>
                    <div className="mb-6 print:hidden">
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
                    <div className="mb-8 print:hidden">
                        <label htmlFor="search" className="sr-only">Buscar Imóvel</label>
                        <input 
                            type="text" 
                            id="search" 
                            placeholder="Buscar por código, empreendimento ou corretor..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full p-4 rounded-xl bg-bone border border-sand focus:outline-none focus:ring-2 focus:ring-stone focus:bg-bone text-lg transition-all placeholder-stone text-ink shadow-[0_4px_20px_rgb(0,0,0,0.03)]" 
                        />
                    </div>

                    {filteredJobs.length > 0 ? (
                        <>
                            <div id="job-list" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                                {paginatedJobs.map(job => <JtJobListItem key={job.id} job={job} onClick={() => setSelectedJob(job)} />)}
                            </div>
                             <div className="print:hidden">
                                <PaginationControls currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                         <div className="text-center py-12">
                            <p className="text-stone text-lg font-medium">Nenhum imóvel encontrado.</p>
                            <button onClick={() => setQuery('')} className="mt-2 text-stone hover:text-ink font-semibold hover:underline">Limpar busca</button>
                         </div>
                    )}
                </div>
            {selectedJob && (
                <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob.title || (typeof selectedJob.property === 'string' ? selectedJob.property.split(' | ')[0] : 'Detalhes do Imóvel')}>
        <JobDetailContent job={selectedJob} />
    </Modal>
            )}

        </section>
    );
};
