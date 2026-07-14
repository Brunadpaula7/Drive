import React, { useState, useMemo, useEffect } from 'react';
import type { Job } from '../types';
import { Modal } from './Modal';

interface JobSectionProps {
    jobs: Job[];
    onRefresh?: () => void;
    isRefreshing?: boolean;
    globalSearch?: string;
}

const JOBS_PER_PAGE = 12;

const JobDetailContent: React.FC<{ job: Job }> = ({ job }) => {
    const photos = Array.isArray(job.photos) ? job.photos.filter(p => typeof p === 'string') : [];
    const [activePhoto, setActivePhoto] = useState<string | null>(photos.length > 0 ? photos[0] : null);

    useEffect(() => {
        const newPhotos = Array.isArray(job.photos) ? job.photos.filter(p => typeof p === 'string') : [];
        setActivePhoto(newPhotos.length > 0 ? newPhotos[0] : null);
    }, [job]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 lg:w-3/5 space-y-4">
                {photos.length > 0 ? (
                    <div className="space-y-4">
                        <div className="w-full h-[300px] sm:h-[400px] bg-bone rounded-2xl overflow-hidden shadow-sm border border-sand">
                            {activePhoto && <img src={activePhoto} alt="Principal" className="w-full h-full object-cover" />}
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
                        <a href={job.url.startsWith('http') ? job.url : `https://${job.url}`} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center bg-ink hover:bg-forest text-bone py-3.5 px-6 rounded-xl text-base font-bold shadow-md transition-all border border-transparent hover:border-forest/50">
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
        const interval = setInterval(checkSyncTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const filteredJobs = useMemo(() => {
        let result = jobs;
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            result = result.filter(job => (job.raw || '').toLowerCase().includes(searchLower) || (job.property || '').toLowerCase().includes(searchLower) || (job.locationDetails || '').toLowerCase().includes(searchLower));
        }
        if (query) {
            const searchLower = query.toLowerCase();
            result = result.filter(job => (job.raw || '').toLowerCase().includes(searchLower) || (job.property || '').toLowerCase().includes(searchLower) || (job.locationDetails || '').toLowerCase().includes(searchLower));
        }
        return result;
    }, [jobs, query, globalSearch]);

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
                className="flex items-center justify-between mb-8 cursor-pointer group select-none print:hidden"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
            >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">
                        Revendas Nido
                    </h2>
                    <span className="text-sm font-medium text-stone bg-sand/50 px-3 py-1 rounded-full self-start">
                        {filteredJobs.length} {filteredJobs.length === 1 ? 'imóvel' : 'imóveis'}
                    </span>
                    {lastSyncTime && (
                        <span className="text-xs font-medium text-stone/70 sm:ml-2">
                            Atualizado: {lastSyncTime}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {onRefresh && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                            disabled={isRefreshing}
                            className={`p-2 rounded-full hover:bg-white border border-transparent hover:border-sand/50 transition-all ${isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                            title="Atualizar painel via link configurado"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-stone ${isRefreshing ? 'animate-spin' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    )}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className={`w-7 h-7 text-stone group-hover:text-ink transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="space-y-6">
                    <div className="relative group print:hidden max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-stone group-focus-within:text-forest transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Pesquisar revendas Nido..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-sand rounded-xl focus:ring-2 focus:ring-forest/20 focus:border-forest text-ink placeholder-stone transition-all shadow-sm font-medium"
                        />
                        {query && (
                            <button 
                                onClick={() => setQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone hover:text-ink"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {filteredJobs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {paginatedJobs.map((job) => (
                                    <div 
                                        key={job.id} 
                                        className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-sand/50 flex flex-col h-full cursor-pointer group"
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-bold bg-sand/30 text-stone px-2 py-1 rounded-md uppercase tracking-wider">{job.jt}</span>
                                            {job.tipo && <span className="text-xs font-semibold text-forest bg-forest/5 px-2 py-1 rounded-md">{job.tipo}</span>}
                                        </div>
                                        
                                        <h3 className="font-bold text-ink text-base line-clamp-2 leading-tight group-hover:text-forest transition-colors flex-grow">
                                            {job.property}
                                        </h3>
                                        
                                        {(job.locationDetails || job.price || job.area) && (
                                            <div className="mt-4 pt-4 border-t border-sand/30 space-y-2">
                                                {job.locationDetails && (
                                                    <div className="flex items-start text-xs text-stone">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5 shrink-0 text-stone/70">
                                                          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="line-clamp-1">{job.locationDetails}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center mt-2">
                                                    {job.area && (
                                                        <span className="text-xs font-semibold text-stone bg-sand/20 px-2 py-0.5 rounded">
                                                            {job.area} m²
                                                        </span>
                                                    )}
                                                    {job.price && (
                                                        <span className="text-sm font-black text-ink ml-auto">
                                                            {job.price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center items-center gap-2 print:hidden">
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl bg-white border border-sand text-stone hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                        aria-label="Página anterior"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                    </button>
                                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-md px-2 custom-scrollbar">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                            if (totalPages > 7 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
                                                if (page === 2 || page === totalPages - 1) return <span key={page} className="text-stone px-1">...</span>;
                                                return null;
                                            }
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-10 h-10 rounded-xl font-bold transition-all text-sm flex-shrink-0 ${currentPage === page ? 'bg-forest text-white shadow-md' : 'bg-white border border-sand text-stone hover:border-forest/30 hover:text-ink'}`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl bg-white border border-sand text-stone hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                        aria-label="Próxima página"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                         <div className="text-center py-12">
                            <p className="text-stone text-lg font-medium">Nenhum imóvel encontrado.</p>
                            <button onClick={() => setQuery('')} className="mt-2 text-stone hover:text-ink font-semibold hover:underline">Limpar busca</button>
                         </div>
                    )}
                </div>
            )}

            {selectedJob && (
                <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob.property || 'Detalhes do Imóvel'}>
                    <JobDetailContent job={selectedJob} />
                </Modal>
            )}
        </section>
    );
};
