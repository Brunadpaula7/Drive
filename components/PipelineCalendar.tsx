import React, { useState, useMemo } from 'react';
import type { PipelineMonth } from '../types';

interface PipelineCalendarProps {
    data: PipelineMonth[];
}

const MONTHS_PER_PAGE = 6;

export const PipelineCalendar: React.FC<PipelineCalendarProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / MONTHS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * MONTHS_PER_PAGE;
        return data.slice(startIndex, startIndex + MONTHS_PER_PAGE);
    }, [data, currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
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
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">Pipeline de Lançamentos</h2>
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
             
             {isOpen && (
                <>
                    <div className="space-y-12">
                        {paginatedData.map((item) => {
                            const hasEvents = item.events.length > 0;
                            return (
                                <div key={`${item.month}-${item.year}`}>
                                    <div className="flex justify-between items-end border-b border-stone/20 pb-2 mb-6 px-2">
                                        <span className="text-sm font-bold text-stone tracking-widest uppercase">{item.month}</span>
                                        <span className="text-xs font-semibold text-sand">{item.year}</span>
                                    </div>

                                    <div className="flex-grow">
                                        {hasEvents ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {item.events.map((event) => (
                                                    <div key={event.id} className="flex flex-col p-4 rounded-xl bg-bone border border-sand shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-stone transition-all duration-300">
                                                        <span className="text-xs font-bold text-forest mb-2 uppercase tracking-wide">{event.day}</span>
                                                        <span className="text-sm text-ink font-medium leading-snug">{event.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full py-8 bg-bone/50 border border-sand rounded-xl">
                                                <span className="text-sm text-sand italic">Sem eventos</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border shadow-sm  bg-bone/40 text-stone border-sand hover:bg-sand/70 hover:text-ink hover:border-stone disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Go to previous page"
                            >
                                Anterior
                            </button>
                            <span className="text-ink font-bold bg-sand px-3 py-1 rounded-lg border border-sand" aria-live="polite">
                                {currentPage} <span className="text-sand font-normal mx-1">/</span> {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border shadow-sm  bg-bone/40 text-stone border-sand hover:bg-sand/70 hover:text-ink hover:border-stone disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Go to next page"
                            >
                                Próximo
                            </button>
                        </div>
                    )}
                </>
             )}
        </section>
    );
};