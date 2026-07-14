import React from 'react';
import type { Job, LaunchProject } from '../types';

interface PrintReportProps {
    jobs: Job[];
    launches: LaunchProject[];
}

export const PrintReport: React.FC<PrintReportProps> = ({ jobs, launches }) => {
    return (
        <div className="hidden print:block font-sans text-black p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-8 border-b-2 border-black pb-4 text-center">Relatório de Imóveis - Revendas e Lançamentos</h1>
            
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-gray-800">Lançamentos e Remanescentes</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-400">
                            <th className="py-2 px-2 font-bold text-sm uppercase">Empreendimento</th>
                            <th className="py-2 px-2 font-bold text-sm uppercase">Construtora</th>
                            <th className="py-2 px-2 font-bold text-sm uppercase">Localização</th>
                            <th className="py-2 px-2 font-bold text-sm uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {launches.map((l, i) => (
                            <tr key={l.id || i} className="border-b border-gray-200 break-inside-avoid">
                                <td className="py-2 px-2 text-sm font-semibold">{l.name}</td>
                                <td className="py-2 px-2 text-sm">{l.builder}</td>
                                <td className="py-2 px-2 text-sm">{l.location}</td>
                                <td className="py-2 px-2 text-sm">{l.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-gray-800">Revendas Nido</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-400">
                            <th className="py-2 px-2 font-bold text-sm uppercase w-20">Cód</th>
                            <th className="py-2 px-2 font-bold text-sm uppercase">Imóvel</th>
                            <th className="py-2 px-2 font-bold text-sm uppercase">Localização</th>
                            <th className="py-2 px-2 font-bold text-sm uppercase text-right w-32">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((j, i) => (
                            <tr key={j.id || i} className="border-b border-gray-200 break-inside-avoid">
                                <td className="py-2 px-2 text-sm font-bold">{j.jt}</td>
                                <td className="py-2 px-2 text-sm">{j.property.split(' | ')[0] || j.property}</td>
                                <td className="py-2 px-2 text-sm">{j.locationDetails || '-'}</td>
                                <td className="py-2 px-2 text-sm text-right font-medium">{j.valorVenda ? `R$ ${j.valorVenda}` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
