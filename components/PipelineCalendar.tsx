import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { PipelineMonth } from '../types';

interface PipelineCalendarProps {
    data: PipelineMonth[];
}

const MONTHS_PER_PAGE = 6;

export const PipelineCalendar: React.FC<PipelineCalendarProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / MONTHS_PER_PAGE);
    
    const chartData = useMemo(() => {
        return data.map(item => {
            let displayName = `${item.month} / ${item.year}`;
            if (item.month === 'Goiânia') {
                displayName = 'Goiânia';
            } else if (item.month === 'Lançamentos Previstos') {
                displayName = item.year;
            }
            return {
                name: displayName,
                displayName: displayName,
                'Eventos': item.events.length,
            };
        });
    }, [data]);

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
                    {/* Visualização de Carga de Trabalho */}
                    <div className="mb-10 bg-white/40 border border-sand/40 p-4 md:p-6 rounded-2xl print:hidden">
                        <h3 className="text-sm font-bold text-stone uppercase tracking-wider mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.625C7.5 19.375 6.996 19.5 6.375 19.5h-2.25A1.125 1.125 0 0 1 3 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.625c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
                            </svg>
                            Volume de Lançamentos (Eventos por Mês)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D2C6" opacity={0.3} vertical={false} />
                                    <XAxis 
                                        dataKey="displayName" 
                                        stroke="#767469" 
                                        fontSize={11} 
                                        tickLine={false} 
                                        axisLine={{ stroke: '#D4D2C6', strokeWidth: 1 }}
                                    />
                                    <YAxis 
                                        stroke="#767469" 
                                        fontSize={11} 
                                        tickLine={false} 
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#ECEBE3', 
                                            border: '1px solid #D4D2C6', 
                                            borderRadius: '0.75rem',
                                            color: '#141A17',
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '12px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }}
                                        cursor={{ fill: 'rgba(31, 58, 46, 0.04)' }}
                                    />
                                    <Bar 
                                        dataKey="Eventos" 
                                        fill="#1F3A2E" 
                                        radius={[6, 6, 0, 0]} 
                                        maxBarSize={50}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.Eventos > 0 ? '#1F3A2E' : '#D4D2C6'} 
                                                opacity={entry.Eventos > 0 ? 0.95 : 0.4}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {paginatedData.map((item) => {
                            const hasEvents = item.events.length > 0;
                            return (
                                <div key={`${item.month}-${item.year}`}>
                                    <div className="flex justify-between items-center border-b border-stone/30 pb-2 mb-6 px-2">
                                        <span className="text-base font-bold text-forest tracking-wider uppercase">{item.month}</span>
                                        <span className="text-sm font-bold text-ink bg-sand/40 px-2.5 py-1 rounded-lg border border-sand/60 shadow-sm">{item.year}</span>
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