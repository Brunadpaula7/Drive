import React, { useState, useEffect } from 'react';

const DB = {
    PJ: [
        { 
            id: 'pj-rf', 
            nome: '1. Certidão da Receita Federal (CNPJ)', 
            link: 'https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cnpj', 
            descricao: 'Certidão Conjunta de Débitos Relativos a Tributos Federais e à Dívida Ativa da União.',
            importancia: 'Mitiga o risco de Fraude à Execução Fiscal (Art. 185 do CTN). Se a empresa alienar o imóvel possuindo débitos inscritos e não reservar bens suficientes para o passivo, a venda pode ser declarada ineficaz e o imóvel ser penhorado pela União.',
            obsPositiva: 'Acesso restrito via E-CAC (Gov.br ou Certificado Digital).', 
            obsOQueSignifica: 'Impostos federais, contribuições previdenciárias ou dívida ativa da União pendentes.' 
        },
        { 
            id: 'pj-sefaz', 
            nome: '2. Certidão SEFAZ Estadual (Goiás)', 
            link: 'https://www.sefaz.go.gov.br/Certidao/Emissao/', 
            descricao: 'Certidão de Regularidade Fiscal Estadual perante a Secretaria da Economia.',
            importancia: 'Comprova a inexistência de débitos tributários estaduais (ICMS, ITCMD, IPVA). Passivos não quitados podem gerar ajuizamento de execução fiscal, cujas penhoras atingirão os imóveis que compõem o ativo da empresa.',
            obsOQueSignifica: 'Pendências de ICMS, IPVA ou tributos estaduais inscritos em dívida ativa.' 
        },
        { 
            id: 'pj-trf-civel', 
            nome: '3. Certidão TRF 1ª Região - Cível', 
            link: 'https://sistemas.trf1.jus.br/certidao/#/solicitacao', 
            descricao: 'Certidão de Distribuição de Ações e Execuções Cíveis na Justiça Federal.',
            importancia: 'Identifica litígios da empresa contra entes federais (Caixa, INSS, IBAMA, autarquias). O ajuizamento de execuções ou ações de ressarcimento contra a PJ pode recair de forma imediata sobre a titularidade de seus bens imóveis.',
            obsOQueSignifica: 'Ações cíveis federais em andamento (ex: execuções fiscais de autarquias federais).' 
        },
        { 
            id: 'pj-trf-criminal', 
            nome: '4. Certidão TRF 1ª Região - Criminal', 
            link: 'https://sistemas.trf1.jus.br/certidao/#/solicitacao', 
            descricao: 'Certidão de Distribuição de Ações Criminais na Justiça Federal.',
            importancia: 'Apura a existência de crimes corporativos gravosos (lavagem de capitais, crimes contra o sistema financeiro ou ordem tributária). Processos desta natureza podem gerar sequestro cautelar de bens ou o perdimento definitivo do imóvel em favor do Estado.',
            obsOQueSignifica: 'Processos criminais federais (crimes tributários, lavagem de dinheiro).' 
        },
        { 
            id: 'pj-tst', 
            nome: '5. Certidão TST - Justiça do Trabalho', 
            link: 'http://www.tst.jus.br/certidao', 
            descricao: 'Certidão Negativa de Débitos Trabalhistas (CNDT).',
            importancia: 'Atesta que a empresa não consta no Banco Nacional de Devedores Trabalhistas (BNDT). É imprescindível pois débitos trabalhistas possuem privilégio absoluto (crédito alimentar), sobrepondo-se muitas vezes a outros credores na constrição de imóveis.',
            obsOQueSignifica: 'Débitos trabalhistas incontroversos (fase de execução) registrados no BNDT.' 
        },
        { 
            id: 'pj-tj-civel', 
            nome: '6. Distribuidor Cível - TJGO', 
            link: 'https://wa.me/5562936207832', 
            descricao: 'Certidão de Feitos Ajuizados (Ações Cíveis, Comerciais, Falência e Recuperação Judicial).',
            importancia: 'Crucial para verificar a solvência civil. Detecta execuções de terceiros (fornecedores, bancos) e, principalmente, se há decretação de falência — situação onde a venda do imóvel se torna nula ou ineficaz perante a massa falida.',
            observacaoGeral: 'Solicitação via WhatsApp, com custo aproximado de R$ 74,25, sujeito à cobrança adicional de encargos de consulta para emissão da certidão em pessoa jurídica.',
            obsPositiva: 'Requer avaliação detalhada do processo para medir risco patrimonial.', 
            obsOQueSignifica: 'Ações cíveis estaduais (cobranças, execuções, indenizações, falência/recuperação judicial).' 
        },
        { 
            id: 'pj-tj-criminal', 
            nome: '7. Distribuidor Criminal - TJGO', 
            link: 'https://wa.me/5562936207832', 
            descricao: 'Certidão do Distribuidor Criminal Estadual.',
            importancia: 'Levanta processos da justiça comum que indiquem atuação empresarial fraudulenta (estelionato, falsidade ideológica), corroborando para o background check e prevenindo a participação involuntária em esquemas ilícitos (Compliance).',
            observacaoGeral: 'Solicitação via WhatsApp, com custo aproximado de R$ 74,25, sujeito à cobrança adicional de encargos de consulta para emissão da certidão em pessoa jurídica.',
            obsPositiva: 'Analisar potencial restrição de bens atrelados ao inquérito/processo.', 
            obsOQueSignifica: 'Processos criminais estaduais ativos.' 
        },
        { 
            id: 'pj-trt', 
            nome: '8. Certidão TRT 18ª Região (Goiás)', 
            link: 'https://sistemas.trt18.jus.br/consultasPortal/pages/Processuais/Certidao.seam', 
            descricao: 'Certidão de Ações Trabalhistas em Tramitação (Regional).',
            importancia: 'Diferente da CNDT (que foca em dívidas em execução), esta mapeia riscos contingentes, ou seja, processos que ainda estão em andamento, permitindo analisar futuras restrições ao patrimônio.',
            obsOQueSignifica: 'Ações trabalhistas em trâmite específico no Estado de Goiás.' 
        },
        { 
            id: 'pj-fisco', 
            nome: '9. Certidão FISCO Municipal (Goiânia)', 
            link: 'https://www.goiania.go.gov.br/sistemas/sccer/asp/sccer00300f0.asp', 
            descricao: 'Certidão de Regularidade Fiscal Municipal Atrelada ao CNPJ.',
            importancia: 'Assegura a ausência de débitos ligados à municipalidade (ISS, Alvarás, Multas Urbanísticas). Previne a alienação com passivos que o município tentará executar futuramente contra o patrimônio livre da sociedade.',
            obsOQueSignifica: 'Débitos municipais (ISS, Alvarás, Taxas de Licença) em aberto.' 
        }
    ],
    PF: [
        { 
            id: 'pf-rf', 
            nome: '1. Certidão da Receita Federal (CPF)', 
            link: 'https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cpf', 
            descricao: 'Certidão Conjunta de Débitos de Tributos Federais e Dívida Ativa da União.',
            importancia: 'Garante que o vendedor não é um devedor federal (IRPF, malha fina). Evita o risco extremo de a venda do imóvel ser desfeita sob alegação de Fraude à Execução, visando a proteção do crédito tributário nacional.',
            obsOQueSignifica: 'Pendências de IRPF, malha fina ou dívida ativa da União.' 
        },
        { 
            id: 'pf-sefaz', 
            nome: '2. Certidão SEFAZ Estadual (Goiás)', 
            link: 'https://www.sefaz.go.gov.br/Certidao/Emissao/', 
            descricao: 'Situação Fiscal Estadual do Cidadão.',
            importancia: 'Assegura que o Estado não tem pretensões executórias contra o vendedor (como inadimplência grave de IPVA ou ITCMD). Débitos ativos podem ser judicializados e gerar bloqueio indiscriminado de CPF (SISBAJUD) e imóveis (CNIB).',
            obsOQueSignifica: 'Inadimplência estadual (ITCMD, IPVA, taxas).' 
        },
        { 
            id: 'pf-trf-civel', 
            nome: '3. Certidão TRF 1ª Região - Cível', 
            link: 'https://sistemas.trf1.jus.br/certidao/#/solicitacao', 
            descricao: 'Distribuição Cível Federal para Pessoas Físicas.',
            importancia: 'Checa a existência de ações contra o vendedor propostas por estatais ou órgãos federais. Impede a surpresa de constatar penhoras ordenadas por varas federais derivadas de dívidas bancárias federais (ex: alienação fiduciária da Caixa) ou multas do IBAMA.',
            obsOQueSignifica: 'Ações contra o CPF movidas por autarquias federais (Caixa, INSS, IBAMA).' 
        },
        { 
            id: 'pf-trf-criminal', 
            nome: '4. Certidão TRF 1ª Região - Criminal', 
            link: 'https://sistemas.trf1.jus.br/certidao/#/solicitacao', 
            descricao: 'Antecedentes Criminais na Esfera Federal.',
            importancia: 'Rastreia delitos como contrabando, evasão de divisas ou tráfico internacional. Em casos de condenação por crimes graves, os bens vinculados ao réu podem ser submetidos a perdimento, dissolvendo a posse do comprador (mesmo de boa-fé).',
            obsOQueSignifica: 'Processos penais na esfera federal.' 
        },
        { 
            id: 'pf-tst', 
            nome: '5. Certidão TST - Justiça do Trabalho', 
            link: 'http://www.tst.jus.br/certidao', 
            descricao: 'Banco Nacional de Devedores Trabalhistas (CPF).',
            importancia: 'Verifica execuções trabalhistas diretas contra o indivíduo. É vital para mapear o risco da Desconsideração da Personalidade Jurídica: se o vendedor foi sócio de uma empresa que faliu, os débitos trabalhistas recaem pessoalmente sobre ele e seu patrimônio imobiliário.',
            obsOQueSignifica: 'O CPF consta no Banco Nacional de Devedores Trabalhistas.' 
        },
        { 
            id: 'pf-tj-civel', 
            nome: '6. Distribuidor Cível - TJGO', 
            link: 'https://projudi.tjgo.jus.br/CertidaoNegativaPositivaPublica?PaginaAtual=1&TipoArea=1', 
            descricao: 'Certidão Cível do Estado (Incluindo Família e Sucessões).',
            importancia: 'A mais sensível de todas as varas. Avalia desde a capacidade legal de quem vende (ex: processos de interdição), divórcios litigiosos pendentes de partilha, até execuções e ações monitórias interpostas por bancos, pessoas ou condomínios.',
            obsPositiva: 'Se positiva, requer emissão de Certidão Narrativa (ônus do solicitante).', 
            obsOQueSignifica: 'Processos de execução, divórcio litigioso com partilha de bens, interdição.' 
        },
        { 
            id: 'pf-tj-criminal', 
            nome: '7. Distribuidor Criminal - TJGO', 
            link: 'https://projudi.tjgo.jus.br/CertidaoNegativaPositivaPublica?PaginaAtual=1&TipoArea=2', 
            descricao: 'Feitos Criminais Comuns.',
            importancia: 'Garante o background de idoneidade civil do promitente vendedor, atenuando o risco do comprador ser implicado em inquéritos policiais de investigação de fraude, estelionato ou ocultação de patrimônio (laranjas).',
            obsPositiva: 'Requer emissão de Certidão Narrativa se constar apontamento.', 
            obsOQueSignifica: 'Verificação de idoneidade civil baseada em antecedentes criminais estaduais.' 
        },
        { 
            id: 'pf-trt', 
            nome: '8. Certidão TRT 18ª Região (Goiás)', 
            link: 'https://sistemas.trt18.jus.br/consultasPortal/pages/Processuais/Certidao.seam', 
            descricao: 'Ações Trabalhistas Regionais (Abertas e Iniciais).',
            importancia: 'Identifica reclamações ativas em desfavor do vendedor (ex: domésticas, motoristas ou pleitos contra empresas da qual faz parte). Ajuda a calcular as contingências ocultas antes mesmo delas transitarem em julgado.',
            obsOQueSignifica: 'Processos trabalhistas na jurisdição GO contra o CPF do vendedor (risco de fraude à execução).' 
        },
        { 
            id: 'pf-fisco', 
            nome: '9. Certidão FISCO Municipal (Goiânia)', 
            link: 'https://www.goiania.go.gov.br/sistemas/sccer/asp/sccer00300f0.asp', 
            descricao: 'Certidão Negativa Geral de Tributos Municipais (CPF).',
            importancia: 'Pesquisa se o CPF não figura como devedor solidário de ISS, ou atrelado à dívida ativa por outros imóveis e execuções que o município promova contra a pessoa, afetando sua capacidade de livremente dispor de bens.',
            obsOQueSignifica: 'Inadimplência com tributos municipais atrelados ao CPF (IPTU de outros imóveis, ISS autônomo).' 
        }
    ],
    Imovel: [
        { 
            id: 'imovel-cadastro', 
            nome: '1. Certidão de Cadastro do Imóvel', 
            link: 'https://www.goiania.go.gov.br/sistemas/sccer/asp/sccer00202f0.asp', 
            descricao: 'Espelho Cadastral Imobiliário Municipal.',
            importancia: 'Cruza a metragem (área construída/lote) e identificação física cadastrada na Prefeitura com a averbação existente na Matrícula no Cartório de Imóveis (CRI). Divergências aqui costumam bloquear o financiamento bancário.',
            obsOQueSignifica: 'Confronta os dados físicos/metragem registrados na Prefeitura com a matrícula e a realidade.' 
        },
        { 
            id: 'imovel-pagamento', 
            nome: '2. Comprovação de Pagamento IPTU/ITU', 
            link: 'https://www.goiania.go.gov.br/sistemas/sccer/asp/sccer00500f0.asp', 
            descricao: 'Extrato de Lançamento e Pagamentos do IPTU Vigente.',
            importancia: 'O IPTU configura obrigação "Propter Rem" (acompanha a coisa). Isto significa que quem compra o imóvel, automaticamente herda as dívidas anteriores se não certificar a quitação prévia das parcelas deste tributo predial.',
            obsPositiva: 'A existência de pagamento não isenta a certidão de débitos.', 
            obsOQueSignifica: 'Demonstra o histórico de compensação bancária dos tributos imobiliários.' 
        },
        { 
            id: 'imovel-debitos', 
            nome: '3. Certidão de Débitos Imobiliários', 
            link: 'https://www.goiania.go.gov.br/sistemas/sccer/asp/sccer00201f0.asp', 
            descricao: 'CND - Certidão Negativa de Débitos do Imóvel.',
            importancia: 'Documento OBRIGATÓRIO por força da Lei nº 7.433/1985 para a lavratura de Escrituras Públicas. Atesta solenemente a inexistência de débitos fiscais históricos que vinculam legalmente o objeto da transação.',
            obsOQueSignifica: 'Certidão Negativa de Débitos (CND) atrelada à Inscrição Cadastral. Essencial para lavratura de escritura pública.' 
        },
        { 
            id: 'imovel-taxa', 
            nome: '4. Emissão de Guia (DUAM) IPTU/ITU', 
            link: 'https://tributos.goiania.go.gov.br/PortalTributos/ConsultaTributos', 
            descricao: 'Portal de Consulta e Geração de Boletos Vencidos.',
            importancia: 'Ferramenta corretiva e não atestatória. Utilizada na Due Diligence para gerar imediatamente as guias de recolhimento de eventuais inadimplências encontradas, destravando a emissão da CND Imobiliária.',
            obsPositiva: 'Não é certidão. Acesso rápido para gerar boletos pendentes.', 
            obsOQueSignifica: 'Acesso ao espelho do IPTU e emissão de segunda via para quitação.' 
        },
        {
            id: 'imovel-saec',
            nome: '5. SAEC (Certidão Matrícula/Ônus)',
            link: 'https://ridigital.org.br/Acesso.aspx',
            descricao: 'Serviço de Atendimento Eletrônico Compartilhado (SAEC).',
            importancia: 'Permite solicitar certidões digitais de matrícula e verificar a existência de ônus, alienações ou penhoras averbadas na matrícula do imóvel.',
            obsOQueSignifica: 'Acesso às informações do Registro de Imóveis.'
        }
    ]
};

const STORAGE_KEY = '@ChecklistCertidoes:state_v1';

export const CertidoesSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'PF' | 'PJ' | 'Imovel'>('PF');
    const [statuses, setStatuses] = useState<Record<string, 'negativa' | 'positiva'>>({});

    useEffect(() => {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (parsed && parsed.statuses) {
                    setStatuses(parsed.statuses);
                }
            }
        } catch (e) {
            console.error('Error loading checklist state', e);
        }
    }, []);

    const saveState = (newStatuses: Record<string, 'negativa' | 'positiva'>) => {
        setStatuses(newStatuses);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ statuses: newStatuses }));
        } catch (e) {
            console.error('Error saving checklist state', e);
        }
    };

    const handleClear = () => {
        saveState({});
    };

    const toggleStatus = (id: string, status: 'negativa' | 'positiva') => {
        const currentStatus = statuses[id];
        const newStatuses = { ...statuses };
        
        if (currentStatus === status) {
            delete newStatuses[id];
        } else {
            newStatuses[id] = status;
        }
        
        saveState(newStatuses);
    };

    const renderItem = (item: any) => {
        const status = statuses[item.id];
        
        return (
            <div key={item.id} className="border border-sand/50 bg-white/40 p-5 transition-all duration-200 hover:shadow-md rounded-2xl mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="flex-grow pr-4 mb-3 md:mb-0">
                        <h3 className="text-base font-bold text-ink leading-tight">{item.nome}</h3>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-forest hover:text-forest/80 hover:underline print:hidden inline-flex items-center space-x-1 mt-1 font-medium">
                            <span>Acessar Portal Emissor</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        <div className="mt-3 mb-2 p-3 bg-bone rounded-xl border border-sand text-sm text-stone leading-relaxed">
                            <p className="mb-1"><span className="font-semibold text-ink">Definição Técnica:</span> {item.descricao}</p>
                            <p><span className="font-semibold text-ink">Análise de Risco (Impacto na Venda):</span> {item.importancia}</p>
                            {item.observacaoGeral && (
                                <div className="mt-3 p-2.5 bg-forest/10 border border-forest/20 rounded-md text-forest text-sm font-medium flex items-start space-x-2 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{item.observacaoGeral}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex space-x-2 flex-shrink-0 w-full md:w-auto print:hidden">
                        <button 
                            onClick={() => toggleStatus(item.id, 'negativa')}
                            className={`flex-1 md:flex-none flex items-center justify-center space-x-1 px-4 py-2 text-sm font-bold rounded-xl border transition-colors \${
                                status === 'negativa' 
                                ? 'bg-forest text-white border-forest shadow-md' 
                                : 'bg-zinc-200 text-zinc-900 border-zinc-300 hover:bg-zinc-300 font-bold'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors \${status === 'negativa' ? 'text-white' : 'text-ink/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>NADA CONSTA</span>
                        </button>
                        <button 
                            onClick={() => toggleStatus(item.id, 'positiva')}
                            className={`flex-1 md:flex-none flex items-center justify-center space-x-1 px-4 py-2 text-sm font-bold rounded-xl border transition-colors \${
                                status === 'positiva' 
                                ? 'bg-red-600 text-white border-red-700 shadow-md' 
                                : 'bg-zinc-200 text-zinc-900 border-zinc-300 hover:bg-zinc-300 font-bold'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors \${status === 'positiva' ? 'text-white' : 'text-ink/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>PENDÊNCIA</span>
                        </button>
                    </div>
                </div>
                
                {status === 'negativa' && (
                    <div className="mt-3 p-3 rounded-xl bg-forest/10 border border-forest/20">
                        <p className="text-forest text-sm font-semibold flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>Status Verificado: Certidão Negativa (Regular)</span>
                        </p>
                    </div>
                )}

                {status === 'positiva' && (
                    <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
                        <p className="text-red-800 text-sm font-bold flex items-center space-x-1 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>Status Verificado: Certidão Positiva (Irregularidade Detectada)</span>
                        </p>
                        <ul className="text-red-900 text-sm space-y-1 ml-1 border-t border-red-200 pt-2">
                            <li className="flex items-start"><span className="font-bold mr-1">Risco Analisado:</span> {item.obsOQueSignifica}</li>
                            {item.obsPositiva && (
                                <li className="mt-1 flex items-start"><span className="font-bold text-red-900 mr-1">Alerta:</span> {item.obsPositiva}</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        );
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
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">
                    Certidões Cíveis, Criminais e Imóvel
                </h2>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className={`w-6 h-6 text-sand group-hover:text-ink transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            
            {isOpen && (
                <div className="bg-bone/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-sand">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 print:hidden gap-4">
                        <div>
                            <p className="text-stone text-sm">Validação e Due Diligence Imobiliária/Empresarial</p>
                        </div>
                        <div className="flex space-x-3 w-full md:w-auto">
                            <button onClick={handleClear} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-900 shadow-md transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Limpar Dados</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex border-b border-sand mb-6 print:hidden overflow-x-auto hide-scrollbar">
                        <button 
                            className={`py-3 px-6 text-sm font-bold rounded-t-lg whitespace-nowrap border-b-2 transition-colors \${activeTab === 'PF' ? 'bg-forest text-white font-black shadow-md border-none' : 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400 border-none'}`}
                            onClick={() => setActiveTab('PF')}
                        >
                            Pessoa Física (CPF)
                        </button>
                        <button 
                            className={`py-3 px-6 text-sm font-bold rounded-t-lg whitespace-nowrap border-b-2 transition-colors \${activeTab === 'PJ' ? 'bg-forest text-white font-black shadow-md border-none' : 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400 border-none'}`}
                            onClick={() => setActiveTab('PJ')}
                        >
                            Pessoa Jurídica (CNPJ)
                        </button>
                        <button 
                            className={`py-3 px-6 text-sm font-bold rounded-t-lg whitespace-nowrap border-b-2 transition-colors \${activeTab === 'Imovel' ? 'bg-forest text-white font-black shadow-md border-none' : 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400 border-none'}`}
                            onClick={() => setActiveTab('Imovel')}
                        >
                            Certidões do Imóvel
                        </button>
                    </div>

                    <div className="space-y-2">
                        {activeTab === 'PF' && DB.PF.map(renderItem)}
                        {activeTab === 'PJ' && DB.PJ.map(renderItem)}
                        {activeTab === 'Imovel' && (
                            <>
                                <div className="border border-forest/20 bg-forest/10/50 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between print:hidden">
                                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                        <div className="p-2 bg-forest/20 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1zm0 4h1zm0 4h1zm0 4h1zm4-12h1zm0 4h1zm0 4h1zm0 4h1z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-ink">Atalho Rápido: Painel Geral da Prefeitura de Goiânia</span>
                                    </div>
                                    <a href="https://www.goiania.go.gov.br/sistemas/saces/asp/saces00000f0.asp?sigla=sccer" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-forest text-sm font-semibold rounded-lg border border-forest/20 hover:bg-forest/10 transition shadow-sm inline-flex items-center space-x-1">
                                        <span>Acessar Painel</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                                {DB.Imovel.map(renderItem)}
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};
