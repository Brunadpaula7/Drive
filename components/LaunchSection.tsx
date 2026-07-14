

import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import type { LaunchProject } from '../types';

interface LaunchCardProps {
    project: LaunchProject;
    onClick: (project: LaunchProject) => void;
}

const LaunchCard: React.FC<LaunchCardProps> = ({ project, onClick }) => {
    return (
        <div
            className="group flex flex-col p-6 rounded-2xl bg-white border border-sand shadow-sm hover:shadow-md hover:border-stone hover:-translate-y-1 transition-all duration-500 h-full cursor-pointer"
            onClick={() => onClick(project)}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-ink leading-tight pr-2">{project.name}</h3>
                <span className="inline-block bg-ink text-bone text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap">
                    {project.status}
                </span>
            </div>
            
            <div className="mb-4">
                <p className="text-sm font-semibold text-stone">{project.builder}</p>
                <p className="text-xs text-stone font-medium">{project.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-5 border-t border-sand pt-4">
                <div>
                    <span className="block text-[10px] text-stone uppercase tracking-wide font-bold">Entrega</span>
                    <span className="text-sm text-ink font-semibold">{project.delivery}</span>
                </div>
                <div>
                    <span className="block text-[10px] text-stone uppercase tracking-wide font-bold">Tipologia</span>
                    <span className="text-sm text-ink font-semibold">{project.typologies}</span>
                </div>
                <div className="col-span-2">
                    <span className="block text-[10px] text-stone uppercase tracking-wide font-bold">Metragem</span>
                    <span className="text-sm text-ink font-semibold">{project.size}</span>
                </div>
            </div>

             <div className="mt-auto">
                <p className="text-lg font-bold text-ink mb-3">{project.price}</p>
                <p className="text-sm text-stone leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                    {project.description}
                </p>
            </div>
        </div>
    );
};

const LAUNCHES_PER_PAGE = 9;

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

interface LaunchSectionProps {
    data: LaunchProject[];
    onProjectClick: (project: LaunchProject) => void;
    globalSearch?: string;
}

export const LaunchSection = forwardRef<HTMLElement, LaunchSectionProps>(({ data, onProjectClick, globalSearch }, ref) => {
    const [filterStatus, setFilterStatus] = useState('Todos');
    const onFilterChange = setFilterStatus;
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const uniqueStatuses = useMemo(() => {
        const statuses = new Set<string>();
        data.forEach(project => statuses.add(project.status));
        return ['Todos', ...Array.from(statuses).sort()];
    }, [data]);

    const filteredProjects = useMemo(() => {
        let result = data;
        if (filterStatus !== 'Todos') {
            result = result.filter(project => project.status === filterStatus);
        }
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            result = result.filter(project => 
                (project.name || '').toLowerCase().includes(searchLower) ||
                (project.builder || '').toLowerCase().includes(searchLower) ||
                (project.location || '').toLowerCase().includes(searchLower) ||
                (project.status || '').toLowerCase().includes(searchLower)
            );
        }
        return result;
    }, [data, filterStatus, globalSearch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, globalSearch]);

    const totalPages = Math.ceil(filteredProjects.length / LAUNCHES_PER_PAGE);
    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * LAUNCHES_PER_PAGE;
        return filteredProjects.slice(startIndex, startIndex + LAUNCHES_PER_PAGE);
    }, [filteredProjects, currentPage]);

    return (
        <section ref={ref} className="bg-bone/60 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-sand/40 my-8 transition-all duration-500 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
            <div 
                className="flex items-center justify-between mb-8 cursor-pointer group select-none "
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
            >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">Lançamentos e Remanescentes</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-7 h-7 text-stone group-hover:text-ink transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''} print:hidden`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            <div className={!isOpen ? "hidden print:block" : "block"}>
                    <div className="mb-10 max-w-lg mx-auto relative group print:hidden">
                        <label htmlFor="status-filter" className="sr-only">Filtrar por Status</label>
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="relative w-full p-4 rounded-xl bg-bone border border-sand focus:outline-none focus:ring-2 focus:ring-stone focus:bg-bone text-ink text-lg shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all appearance-none"
                        >
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProjects.map(project => (
                            <LaunchCard key={project.id} project={project} onClick={onProjectClick} />
                        ))}
                    </div>
                    
                    <div className="print:hidden">
                                <PaginationControls currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                                />
                            </div>
                </div>
        </section>
    );
});
