import React, { useState, useMemo } from 'react';
import type { LaunchProject } from '../types';
import { Search, Building2, MapPin, Activity, RotateCcw, ChevronDown } from 'lucide-react';

interface LaunchSectionProps {
    launches: LaunchProject[];
    globalSearch?: string;
}

const getNeighborhood = (location: string): string => {
    if (!location) return 'Outros';
    const parts = location.split(',').map(p => p.trim());
    if (parts.length >= 2) {
        // Look for typical neighborhood indicators
        for (const part of parts) {
            const l = part.toLowerCase();
            if (
                l.includes('setor') || 
                l.includes('jardim') || 
                l.includes('parque') || 
                l.includes('condomínio') || 
                l.includes('residencial') || 
                l.includes('centro') || 
                l.includes('vila') ||
                l.includes('santa') ||
                l.includes('lago') ||
                l.includes('chácaras')
            ) {
                return part;
            }
        }
        // Fallback to the second to last segment if it exists and isn't Goiânia or State
        const candidate = parts[parts.length - 2];
        if (candidate && !candidate.toLowerCase().includes('goiânia') && !candidate.toLowerCase().includes('goiania') && !candidate.toLowerCase().includes('go')) {
            return candidate;
        }
    }
    return 'Outros';
};

export const LaunchSection: React.FC<LaunchSectionProps> = ({ launches, globalSearch = '' }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBuilder, setSelectedBuilder] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');

    // Dynamically extract filter lists based on current data
    const builders = useMemo(() => {
        return Array.from(new Set(launches.map(l => l.builder).filter(Boolean))).sort();
    }, [launches]);

    const statuses = useMemo(() => {
        return Array.from(new Set(launches.map(l => l.status).filter(Boolean))).sort();
    }, [launches]);

    const neighborhoods = useMemo(() => {
        return Array.from(new Set(launches.map(l => getNeighborhood(l.location)).filter(n => n && n !== 'Outros'))).sort();
    }, [launches]);

    // Apply combined filters
    const filteredLaunches = useMemo(() => {
        return launches.filter(launch => {
            // Global search filter
            const matchGlobal = !globalSearch || (() => {
                const searchLower = globalSearch.toLowerCase();
                return (
                    launch.name.toLowerCase().includes(searchLower) ||
                    launch.builder.toLowerCase().includes(searchLower) ||
                    launch.location.toLowerCase().includes(searchLower) ||
                    (launch.description && launch.description.toLowerCase().includes(searchLower))
                );
            })();

            // Local search input filter
            const matchLocalSearch = !searchQuery || (() => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    launch.name.toLowerCase().includes(searchLower) ||
                    launch.builder.toLowerCase().includes(searchLower) ||
                    launch.location.toLowerCase().includes(searchLower) ||
                    (launch.description && launch.description.toLowerCase().includes(searchLower))
                );
            })();

            // Builder filter
            const matchBuilder = selectedBuilder === 'all' || launch.builder === selectedBuilder;

            // Status filter
            const matchStatus = selectedStatus === 'all' || launch.status === selectedStatus;

            // Neighborhood filter
            const matchNeighborhood = selectedNeighborhood === 'all' || getNeighborhood(launch.location) === selectedNeighborhood;

            return matchGlobal && matchLocalSearch && matchBuilder && matchStatus && matchNeighborhood;
        });
    }, [launches, globalSearch, searchQuery, selectedBuilder, selectedStatus, selectedNeighborhood]);

    const totalCount = launches.length;
    const filteredCount = filteredLaunches.length;
    const hasActiveFilters = searchQuery !== '' || selectedBuilder !== 'all' || selectedStatus !== 'all' || selectedNeighborhood !== 'all';

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBuilder('all');
        setSelectedStatus('all');
        setSelectedNeighborhood('all');
    };

    if (filteredLaunches.length === 0 && globalSearch && !hasActiveFilters) return null;

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
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">
                    Lançamentos e Remanescentes
                </h2>
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
            
            {(isOpen || globalSearch) && (
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="bg-white/50 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-sand/40 space-y-4 print:hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Text Search */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone/70 mb-1.5">Buscar</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nome, construtora, etc..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white border border-sand/60 rounded-xl pl-9 pr-4 py-2 text-sm text-ink focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/30 transition-all placeholder:text-stone/40"
                                    />
                                    <Search className="w-4 h-4 text-stone/50 absolute left-3 top-3" />
                                </div>
                            </div>

                            {/* Builder Select */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone/70 mb-1.5">Construtora</label>
                                <div className="relative">
                                    <select
                                        value={selectedBuilder}
                                        onChange={(e) => setSelectedBuilder(e.target.value)}
                                        className="w-full bg-white border border-sand/60 rounded-xl pl-9 pr-8 py-2 text-sm text-ink focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/30 appearance-none cursor-pointer"
                                    >
                                        <option value="all">Todas</option>
                                        {builders.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    <Building2 className="w-4 h-4 text-stone/50 absolute left-3 top-3 pointer-events-none" />
                                    <ChevronDown className="w-4 h-4 text-stone/50 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>

                            {/* Neighborhood Select */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone/70 mb-1.5">Bairro / Região</label>
                                <div className="relative">
                                    <select
                                        value={selectedNeighborhood}
                                        onChange={(e) => setSelectedNeighborhood(e.target.value)}
                                        className="w-full bg-white border border-sand/60 rounded-xl pl-9 pr-8 py-2 text-sm text-ink focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/30 appearance-none cursor-pointer"
                                    >
                                        <option value="all">Todos os Bairros</option>
                                        {neighborhoods.map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                        <option value="Outros">Outros</option>
                                    </select>
                                    <MapPin className="w-4 h-4 text-stone/50 absolute left-3 top-3 pointer-events-none" />
                                    <ChevronDown className="w-4 h-4 text-stone/50 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>

                            {/* Status Select */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone/70 mb-1.5">Status</label>
                                <div className="relative">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full bg-white border border-sand/60 rounded-xl pl-9 pr-8 py-2 text-sm text-ink focus:outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/30 appearance-none cursor-pointer"
                                    >
                                        <option value="all">Todos os Status</option>
                                        {statuses.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <Activity className="w-4 h-4 text-stone/50 absolute left-3 top-3 pointer-events-none" />
                                    <ChevronDown className="w-4 h-4 text-stone/50 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Search Info Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-stone border-t border-sand/20">
                            <span>
                                Mostrando <strong className="text-forest font-semibold">{filteredCount}</strong> de <strong className="text-ink font-semibold">{totalCount}</strong> lançamentos.
                            </span>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 text-forest hover:text-ink font-bold transition-colors cursor-pointer select-none"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Limpar Filtros
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Grid */}
                    {filteredCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredLaunches.map((launch) => (
                                <div key={launch.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-sand/50 flex flex-col h-full">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-ink mb-1">{launch.name}</h3>
                                        <p className="text-forest font-medium text-sm">{launch.builder || 'Não informado'}</p>
                                    </div>
                                    
                                    <div className="space-y-3 flex-grow text-sm text-stone">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 shrink-0 text-forest/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span>{launch.location}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 shrink-0 text-forest/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            <span className="font-medium text-ink">{launch.status}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 shrink-0 text-forest/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span>Entrega: {launch.delivery}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 shrink-0 text-forest/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                            <span>{launch.size}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 shrink-0 text-forest/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                            <span>{launch.typologies}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 shrink-0 text-forest/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="font-semibold text-ink">{launch.price}</span>
                                        </div>
                                    </div>
                                    
                                    {launch.description && (
                                        <div className="mt-4 pt-4 border-t border-sand/30">
                                            <p className="text-xs text-stone leading-relaxed">{launch.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/50 rounded-xl border border-sand/30">
                            <p className="text-stone">Nenhum lançamento corresponde aos filtros ativos.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-forest text-white text-sm font-bold rounded-xl shadow-sm hover:bg-forest/95 active:scale-95 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Limpar Todos os Filtros
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {filteredCount === 0 && !globalSearch && !hasActiveFilters && (
                <div className="text-center py-12 bg-white/50 rounded-xl border border-sand/30">
                    <p className="text-stone">Nenhum lançamento cadastrado.</p>
                </div>
            )}
        </section>
    );
};
