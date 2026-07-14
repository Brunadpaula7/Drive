import React, { useState, useMemo, useEffect } from 'react';
import type { LogoData, CitySection, Logo } from '../types';
import { LogoItem } from './LogoItem';

interface LogoSectionProps {
    title: string;
    data: LogoData;
    onLogoClick: (modalId: string) => void;
    searchPlaceholder: string;
    isCitySection?: boolean;
    globalSearch?: string;
}

const isCitySectionTypeGuard = (item: Logo | CitySection): item is CitySection => {
    return (item as CitySection).city !== undefined;
};

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const btnBase = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border shadow-sm ";
    const btnActive = "bg-bone/40 text-stone border-sand hover:bg-bone/70 hover:text-ink hover:border-stone disabled:opacity-30 disabled:cursor-not-allowed";

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

const LOGOS_PER_PAGE = 32;

export const LogoSection: React.FC<LogoSectionProps> = ({ title, data, onLogoClick, searchPlaceholder, isCitySection = false, globalSearch }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [query, globalSearch]);

    const filteredData = useMemo(() => {
        if (!query) return data;
        const lowerCaseQuery = query.toLowerCase();

        if (isCitySection) {
            return data.map(section => {
                if (!isCitySectionTypeGuard(section)) return null;
                const cityMatch = (section.city || '').toLowerCase().includes(lowerCaseQuery);
                const filteredLogos = section.logos.filter(logo => (logo.name || '').toLowerCase().includes(lowerCaseQuery));
                
                if (cityMatch || filteredLogos.length > 0) {
                    return { ...section, logos: cityMatch ? section.logos : filteredLogos };
                }
                return null;
            }).filter((item): item is CitySection => item !== null);
        } else {
            return data.filter(item => {
                 if (isCitySectionTypeGuard(item)) return false;
                 return (item.name || '').toLowerCase().includes(lowerCaseQuery)
            });
        }
    }, [query, data, isCitySection]);

    const totalPages = useMemo(() => {
        if (isCitySection) return 1;
        return Math.ceil((filteredData as Logo[]).length / LOGOS_PER_PAGE);
    }, [filteredData, isCitySection]);

    const paginatedData = useMemo(() => {
        if (isCitySection) {
            return filteredData;
        }
        const startIndex = (currentPage - 1) * LOGOS_PER_PAGE;
        return (filteredData as Logo[]).slice(startIndex, startIndex + LOGOS_PER_PAGE);
    }, [filteredData, isCitySection, currentPage]);


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
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">{title}</h2>
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
                <div>
                    <div className="mb-10 max-w-lg mx-auto relative group">
                        <label htmlFor={`logo-search-${title}`} className="sr-only">{searchPlaceholder}</label>
                        <div className="absolute inset-0 bg-bone/20 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <input
                            type="text"
                            id={`logo-search-${title}`}
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="relative w-full p-4 rounded-xl bg-bone border border-sand focus:outline-none focus:ring-2 focus:ring-stone focus:bg-bone text-ink placeholder-stone text-lg shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all"
                        />
                    </div>
                    {isCitySection ? (
                        <div id="cidades-grid-container">
                            {(paginatedData as CitySection[]).map(citySection => (
                                <div key={citySection.id} className="city-section mb-12">
                                    <div className="inline-block mb-6">
                                        <h3 className="text-xl font-semibold text-ink border-b-2 border-stone/50 pb-1 px-2">{citySection.city}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
                                        {citySection.logos.map(logo => (
                                            <LogoItem key={logo.id} logo={logo} onClick={onLogoClick} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div id="logo-grid" className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
                                {(paginatedData as Logo[]).map(logo => (
                                    <LogoItem key={logo.id} logo={logo} onClick={onLogoClick} />
                                ))}
                            </div>
                            <PaginationControls 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            )}
        </section>
    );
};