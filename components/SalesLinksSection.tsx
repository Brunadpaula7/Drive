import React, { useState } from 'react';
import { 
  FileText, 
  ClipboardList, 
  ExternalLink
} from 'lucide-react';

export const SalesLinksSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const generalLinks = [
        {
            title: "Proposta/Contraproposta de compra",
            url: "https://form.jotform.com/bpconsultoria/proposta-compra-contraproposta",
            desc: "Formulário oficial para envio de propostas e contrapropostas de compra de imóveis.",
            icon: <FileText className="w-5 h-5" />
        },
        {
            title: "Autorização de venda sem exclusividade",
            url: "https://form.jotform.com/bpconsultoria/autorizao-venda-sem-exclusividade",
            desc: "Contrato padrão de autorização simples de intermediação de vendas.",
            icon: <FileText className="w-5 h-5" />
        },
        {
            title: "Autorização de venda com exclusividade",
            url: "https://form.jotform.com/bpconsultoria/autorizao-de-venda-com-exclusividad",
            desc: "Contrato de autorização com exclusividade de venda e divulgação do imóvel.",
            icon: <FileText className="w-5 h-5" />
        },
        {
            title: "Captação Trello",
            url: "https://form.jotform.com/261938305611052",
            desc: "Formulário de cadastro de nova captação integrado diretamente ao painel Trello.",
            icon: <ClipboardList className="w-5 h-5" />
        }
    ];

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
                    Links de Vendas
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

            {isOpen && (
                <div className="space-y-6">
                    {/* Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {generalLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start p-5 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-sand/50 group"
                            >
                                <div className="bg-sand/30 p-3 rounded-xl text-forest group-hover:bg-forest group-hover:text-white transition-colors mr-4 shrink-0">
                                    {link.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <h3 className="text-base font-bold text-ink group-hover:text-forest transition-colors truncate">
                                            {link.title}
                                        </h3>
                                        <ExternalLink className="w-4 h-4 text-stone/30 group-hover:text-forest transition-colors shrink-0" />
                                    </div>
                                    <p className="text-xs text-stone/80 leading-relaxed line-clamp-2">
                                        {link.desc}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};
