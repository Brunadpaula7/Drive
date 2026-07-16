import React, { useState, useMemo, useEffect } from 'react';
import { 
    Calculator, 
    TrendingUp, 
    Percent, 
    Calendar, 
    DollarSign, 
    Plus, 
    Trash2, 
    Info, 
    ArrowRight, 
    Copy, 
    RotateCcw, 
    Sparkles,
    Scale,
    ExternalLink,
    Home,
    Building2,
    Layers,
    Map,
    Eye,
    EyeOff,
    SlidersHorizontal,
    Compass
} from 'lucide-react';

// Interfaces
interface CompListing {
    id: string;
    unidade: string;
    produto: string;
    metragem: number;
    precoPedido: number;
    link: string;
}

type PropertyType = 'lote' | 'casa' | 'apartamento' | 'comercial' | 'outro';

interface AgioCalculationState {
    tipoImovel: PropertyType;
    nomeImovel: string;
    unidadeImovel: string;
    vaga: string;
    escaninho: string;
    quadra: string;
    lote: string;
    m2: number;
    m2Privativo: number;
    m2Total: number;
    valorVenda: number;
    recebidoPago: number;
    saldoDevedor: number;
    comissaoPct: number;
    taxaCessaoPct: number;
    dataCompra: string;
    
    // Visibilidade dos campos
    showNome: boolean;
    showUnidadeImovel: boolean;
    showVaga: boolean;
    showEscaninho: boolean;
    showQuadra: boolean;
    showLote: boolean;
    showM2Geral: boolean;
    showM2Privativo: boolean;
    showM2Total: boolean;
}

// Vinhas Default Data (from PDF screenshots)
const DEFAULT_CALC_STATE: AgioCalculationState = {
    tipoImovel: 'lote',
    nomeImovel: 'Vinhas Anápolis',
    unidadeImovel: 'QD 13 LT 281',
    vaga: '2 Vagas',
    escaninho: 'Escaninho 12',
    quadra: '13',
    lote: '281',
    m2: 439.29,
    m2Privativo: 0,
    m2Total: 439.29,
    valorVenda: 399000.00,
    recebidoPago: 289679.00,
    saldoDevedor: 145000.00,
    comissaoPct: 5,
    taxaCessaoPct: 1, // Default to 1% for assignment of rights
    dataCompra: '2021-03-10', // 10/03/2021
    
    // Visibilidade inicial padrão para lote
    showNome: true,
    showUnidadeImovel: false,
    showVaga: false,
    showEscaninho: false,
    showQuadra: true,
    showLote: true,
    showM2Geral: true,
    showM2Privativo: false,
    showM2Total: false
};

const DEFAULT_COMPARATIVES: CompListing[] = [
    { id: '1', unidade: 'QD.07 LT.143 EBM', produto: 'Vinhas Anápolis', metragem: 490, precoPedido: 698551.93, link: 'https://arquivos.ebm.com.br/?path=An%C3%A1polis/Vinhas%20Anapolis/Tabelas' },
    { id: '2', unidade: 'QD.13 LT.278 EBM', produto: 'Vinhas Anápolis', metragem: 360, precoPedido: 513221.82, link: 'https://arquivos.ebm.com.br/?path=An%C3%A1polis/Vinhas%20Anapolis/Tabelas' },
    { id: '3', unidade: 'OLX (Quitado) Proprietário', produto: 'Vinhas Anápolis', metragem: 440, precoPedido: 510000.00, link: 'https://go.olx.com.br/grande-goiania-e-anapolis/terrenos/terreno-no-condominio-vinhas-anapolis-1470911979?lis=listing_no_category' },
    { id: '4', unidade: 'OLX Sarto Imóveis', produto: 'Vinhas Anápolis', metragem: 360, precoPedido: 340000.00, link: 'https://go.olx.com.br/grande-goiania-e-anapolis/terrenos/lote-a-venda-no-vinhas-anapolis-360-metros-1514145234?lis=listing_no_category' },
    { id: '5', unidade: 'OLX Marcos Holanda', produto: 'Vinhas Anápolis', metragem: 360, precoPedido: 345000.00, link: 'https://go.olx.com.br/grande-goiania-e-anapolis/terrenos/excelente-lote-com-360m2-no-vinhas-anapolis-1495219719?lis=listing_no_category' },
    { id: '6', unidade: 'OLX QD. 03', produto: 'Vinhas Anápolis', metragem: 483, precoPedido: 488384.00, link: 'https://go.olx.com.br/grande-goiania-e-anapolis/terrenos/lote-a-venda-no-condominio-vinhas-anapolis-1448473074?lis=listing_no_category' }
];

export const AgioCalculator: React.FC = () => {
    // Persistent LocalStorage hook for calculations
    const [calcState, setCalcState] = useState<AgioCalculationState>(() => {
        try {
            const saved = localStorage.getItem('agio_calc_state_v2');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure default fallbacks for newly introduced fields
                return {
                    ...DEFAULT_CALC_STATE,
                    ...parsed
                };
            }
            return DEFAULT_CALC_STATE;
        } catch {
            return DEFAULT_CALC_STATE;
        }
    });

    // Persistent LocalStorage hook for comparatives
    const [comparatives, setComparatives] = useState<CompListing[]>(() => {
        try {
            const saved = localStorage.getItem('agio_comparatives_v1');
            return saved ? JSON.parse(saved) : DEFAULT_COMPARATIVES;
        } catch {
            return DEFAULT_COMPARATIVES;
        }
    });

    // Toggle for Field Options accordion
    const [showFieldConfig, setShowFieldConfig] = useState(false);

    // Form inputs for adding a new comparison listing
    const [newComp, setNewComp] = useState({
        unidade: '',
        produto: 'Geral / Região',
        metragem: '',
        precoPedido: '',
        link: ''
    });

    // Save states to local storage
    useEffect(() => {
        localStorage.setItem('agio_calc_state_v2', JSON.stringify(calcState));
    }, [calcState]);

    useEffect(() => {
        localStorage.setItem('agio_comparatives_v1', JSON.stringify(comparatives));
    }, [comparatives]);

    // Handle quick preset based on property type
    const applyTypePreset = (type: PropertyType) => {
        setCalcState(prev => {
            const updated = { ...prev, tipoImovel: type };
            
            // Apply sensible defaults of what fields make sense to show by default
            switch (type) {
                case 'apartamento':
                    updated.showNome = true;
                    updated.showUnidadeImovel = true;
                    updated.showVaga = true;
                    updated.showEscaninho = true;
                    updated.showQuadra = false;
                    updated.showLote = false;
                    updated.showM2Geral = false;
                    updated.showM2Privativo = true;
                    updated.showM2Total = true;
                    if (updated.m2Privativo === 0) updated.m2Privativo = 85;
                    if (updated.m2Total === 0) updated.m2Total = 110;
                    break;
                case 'casa':
                    updated.showNome = true;
                    updated.showUnidadeImovel = false;
                    updated.showVaga = true;
                    updated.showEscaninho = false;
                    updated.showQuadra = true;
                    updated.showLote = true;
                    updated.showM2Geral = false;
                    updated.showM2Privativo = true;
                    updated.showM2Total = true;
                    if (updated.m2Privativo === 0) updated.m2Privativo = 180;
                    if (updated.m2Total === 0) updated.m2Total = 360;
                    break;
                case 'comercial':
                    updated.showNome = true;
                    updated.showUnidadeImovel = true;
                    updated.showVaga = false;
                    updated.showEscaninho = false;
                    updated.showQuadra = false;
                    updated.showLote = false;
                    updated.showM2Geral = true;
                    updated.showM2Privativo = false;
                    updated.showM2Total = false;
                    break;
                case 'lote':
                default:
                    updated.showNome = true;
                    updated.showUnidadeImovel = false;
                    updated.showVaga = false;
                    updated.showEscaninho = false;
                    updated.showQuadra = true;
                    updated.showLote = true;
                    updated.showM2Geral = true;
                    updated.showM2Privativo = false;
                    updated.showM2Total = false;
                    break;
            }
            return updated;
        });
    };

    const handleClearComparatives = () => {
        setComparatives([]);
    };

    const handleClearFields = () => {
        setCalcState(prev => ({
            ...prev,
            nomeImovel: '',
            unidadeImovel: '',
            vaga: '',
            escaninho: '',
            quadra: '',
            lote: '',
            m2: 0,
            m2Privativo: 0,
            m2Total: 0,
            valorVenda: 0,
            recebidoPago: 0,
            saldoDevedor: 0,
            comissaoPct: 0,
            taxaCessaoPct: 0,
            dataCompra: ''
        }));
    };

    // Format helpers
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const formatPercent = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2,
            signDisplay: 'exceptZero' 
        }).format(val) + '%';
    };

    const formatNumber = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
    };

    // Calculate months difference
    const tempoMeses = useMemo(() => {
        if (!calcState.dataCompra) return 0;
        const purchase = new Date(calcState.dataCompra + 'T00:00:00');
        const today = new Date();
        
        const yearsDiff = today.getFullYear() - purchase.getFullYear();
        const monthsDiff = today.getMonth() - purchase.getMonth();
        
        const total = (yearsDiff * 12) + monthsDiff;
        return total > 0 ? total : 0;
    }, [calcState.dataCompra]);

    // Choose the active/relevant M² area based on active visibility fields
    const activeM2 = useMemo(() => {
        if (calcState.showM2Privativo && calcState.m2Privativo > 0) {
            return calcState.m2Privativo;
        }
        if (calcState.showM2Geral && calcState.m2 > 0) {
            return calcState.m2;
        }
        if (calcState.showM2Total && calcState.m2Total > 0) {
            return calcState.m2Total;
        }
        return calcState.m2 || 1; // Prevent division by zero
    }, [calcState.showM2Privativo, calcState.m2Privativo, calcState.showM2Geral, calcState.m2, calcState.showM2Total, calcState.m2Total]);

    // Financial formulas derived from PDF calculations
    const recebidoMaisReceber = calcState.recebidoPago + calcState.saldoDevedor;
    const comissaoRs = calcState.valorVenda * (calcState.comissaoPct / 100);
    const taxaCessaoRs = calcState.valorVenda * ((calcState.taxaCessaoPct || 0) / 100);
    const reaisPorM2 = activeM2 > 0 ? calcState.valorVenda / activeM2 : 0;
    
    // Formula from PDF: Ágio = $ Venda - $ Saldo Devedor
    const agio = calcState.valorVenda - calcState.saldoDevedor;
    
    // Formula from PDF (Updated): Ágio Líquido = $ Ágio - $ Comissão - $ Cessão
    const agioLiquido = agio - comissaoRs - taxaCessaoRs;
    
    // Formula from PDF: Lucro = Ágio Líquido - Recebido/Pago
    const lucro = agioLiquido - calcState.recebidoPago;
    
    // Formula from PDF: Lucro % = Lucro / Recebido/Pago
    const lucroPct = calcState.recebidoPago > 0 ? (lucro / calcState.recebidoPago) * 100 : 0;
    
    // Formula from PDF: Lucro Liquido a.m = Lucro % / T/Compra
    const lucroLiquidoAm = tempoMeses > 0 ? lucroPct / tempoMeses : 0;

    // Market Comparatives Calculations
    const calculatedComparatives = useMemo(() => {
        return comparatives.map(item => ({
            ...item,
            reaisPorM2: item.metragem > 0 ? item.precoPedido / item.metragem : 0
        }));
    }, [comparatives]);

    const mediaReaisPorM2 = useMemo(() => {
        if (calculatedComparatives.length === 0) return 0;
        const total = calculatedComparatives.reduce((acc, curr) => acc + curr.reaisPorM2, 0);
        return total / calculatedComparatives.length;
    }, [calculatedComparatives]);

    // Estimated value for current unit size based on average market price per m²
    const valorEstimadoMercado = useMemo(() => {
        return activeM2 * mediaReaisPorM2;
    }, [activeM2, mediaReaisPorM2]);

    // Reset back to example data
    const handleReset = () => {
        if (confirm('Deseja redefinir os dados para o exemplo padrão de lote do Vinhas?')) {
            setCalcState(DEFAULT_CALC_STATE);
            setComparatives(DEFAULT_COMPARATIVES);
        }
    };

    // Add comparative listing
    const handleAddComp = (e: React.FormEvent) => {
        e.preventDefault();
        const metragemNum = parseFloat(newComp.metragem);
        const precoNum = parseFloat(newComp.precoPedido);

        if (!newComp.unidade || isNaN(metragemNum) || isNaN(precoNum)) {
            alert('Por favor, preencha Unidade, Metragem e Preço válidos.');
            return;
        }

        const item: CompListing = {
            id: Date.now().toString(),
            unidade: newComp.unidade,
            produto: newComp.produto || 'Geral / Região',
            metragem: metragemNum,
            precoPedido: precoNum,
            link: newComp.link
        };

        setComparatives([...comparatives, item]);
        setNewComp({
            unidade: '',
            produto: 'Geral / Região',
            metragem: '',
            precoPedido: '',
            link: ''
        });
    };

    // Delete comparative listing
    const handleDeleteComp = (id: string) => {
        setComparatives(comparatives.filter(item => item.id !== id));
    };

    // Apply estimated market value as current sale value
    const handleApplyEstimatedValue = () => {
        if (valorEstimadoMercado > 0) {
            setCalcState(prev => ({
                ...prev,
                valorVenda: Math.round(valorEstimadoMercado)
            }));
        }
    };

    return (
        <div className="space-y-10 pb-16">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-forest to-forest/90 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-forest/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <span className="bg-white/10 text-white/90 text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                            Inteligência Imobiliária Flexível
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight">Cálculo de Ágio & Comparativo</h2>
                        <p className="text-white/80 max-w-2xl text-sm md:text-base leading-relaxed">
                            Simule os ganhos de ágio, comissões de cessão e analise o valor de mercado de lotes, apartamentos ou casas, ocultando campos que não fazem parte do seu cálculo atual.
                        </p>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/25 border border-white/20 px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-sm shrink-0 cursor-pointer text-white self-start md:self-auto"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Exemplo de Lote
                    </button>
                </div>
            </div>

            {/* Field Visibility Toggles Accordion */}
            <div className="bg-bone border border-sand rounded-3xl p-6 shadow-sm space-y-4">
                <button
                    onClick={() => setShowFieldConfig(!showFieldConfig)}
                    className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sand/50 rounded-xl text-forest">
                            <SlidersHorizontal className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-ink">Personalizar Exibição de Campos</h4>
                            <p className="text-xs text-stone mt-0.5">Oculte ou mostre informações da unidade que não fazem parte do cálculo</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-forest bg-white px-3 py-1.5 rounded-xl border border-sand/70 hover:bg-sand/10 transition-colors">
                        {showFieldConfig ? 'Fechar Opções' : 'Configurar Campos'}
                    </span>
                </button>

                {showFieldConfig && (
                    <div className="pt-4 border-t border-sand/50 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                        {/* Toggles */}
                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showNome}
                                onChange={(e) => setCalcState({ ...calcState, showNome: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Nome do Imóvel</p>
                                <p className="text-[10px] text-stone">Ex: Vinhas Anápolis</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showUnidadeImovel}
                                onChange={(e) => setCalcState({ ...calcState, showUnidadeImovel: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Nº da Unidade</p>
                                <p className="text-[10px] text-stone">Ex: Apt 1403 / Box 4</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showQuadra}
                                onChange={(e) => setCalcState({ ...calcState, showQuadra: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Quadra / Bloco</p>
                                <p className="text-[10px] text-stone">Para lotes ou torres</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showLote}
                                onChange={(e) => setCalcState({ ...calcState, showLote: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Lote / Casa</p>
                                <p className="text-[10px] text-stone">Identificador numérico</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showVaga}
                                onChange={(e) => setCalcState({ ...calcState, showVaga: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Vagas de Garagem</p>
                                <p className="text-[10px] text-stone">Nº ou descrição da vaga</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showEscaninho}
                                onChange={(e) => setCalcState({ ...calcState, showEscaninho: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Escaninho / Depósito</p>
                                <p className="text-[10px] text-stone">Espaço de armazenamento</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showM2Geral}
                                onChange={(e) => setCalcState({ ...calcState, showM2Geral: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">Metragem Geral (m²)</p>
                                <p className="text-[10px] text-stone">Campo de área unificado</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={calcState.showM2Privativo}
                                onChange={(e) => setCalcState({ ...calcState, showM2Privativo: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">m² Privativo (Útil)</p>
                                <p className="text-[10px] text-stone">Área interna construída</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-sand/50 cursor-pointer hover:bg-bone/50 transition-colors col-span-2 md:col-span-1">
                            <input 
                                type="checkbox" 
                                checked={calcState.showM2Total}
                                onChange={(e) => setCalcState({ ...calcState, showM2Total: e.target.checked })}
                                className="rounded text-forest focus:ring-forest w-4 h-4"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-ink">m² Total (Terreno)</p>
                                <p className="text-[10px] text-stone">Área total do lote/fração</p>
                            </div>
                        </label>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Section 1: Inputs & Parameters */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-sand/50 shadow-sm p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-sand pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-sand/40 rounded-xl text-forest">
                                <Calculator className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-ink">Dados de Entrada</h3>
                        </div>
                        <button
                            type="button"
                            onClick={handleClearFields}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-100 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
                            title="Limpar todos os campos de cálculo"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Limpar Campos
                        </button>
                    </div>

                    {/* Property Type Selector */}
                    <div>
                        <label className="block text-xs font-bold text-stone mb-2 uppercase tracking-wide">Fórmula e Estilo Padrão</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5 gap-2">
                            <button
                                type="button"
                                onClick={() => applyTypePreset('lote')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                    calcState.tipoImovel === 'lote'
                                    ? 'bg-forest text-white border-forest shadow-sm'
                                    : 'bg-bone text-stone border-sand hover:bg-sand/20'
                                }`}
                            >
                                <Map className="w-4 h-4 mb-1" />
                                Terreno
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTypePreset('casa')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                    calcState.tipoImovel === 'casa'
                                    ? 'bg-forest text-white border-forest shadow-sm'
                                    : 'bg-bone text-stone border-sand hover:bg-sand/20'
                                }`}
                            >
                                <Home className="w-4 h-4 mb-1" />
                                Casa
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTypePreset('apartamento')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                    calcState.tipoImovel === 'apartamento'
                                    ? 'bg-forest text-white border-forest shadow-sm'
                                    : 'bg-bone text-stone border-sand hover:bg-sand/20'
                                }`}
                            >
                                <Building2 className="w-4 h-4 mb-1" />
                                Apto
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTypePreset('comercial')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                    calcState.tipoImovel === 'comercial'
                                    ? 'bg-forest text-white border-forest shadow-sm'
                                    : 'bg-bone text-stone border-sand hover:bg-sand/20'
                                }`}
                            >
                                <Layers className="w-4 h-4 mb-1" />
                                Comercial
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTypePreset('outro')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1 ${
                                    calcState.tipoImovel === 'outro'
                                    ? 'bg-forest text-white border-forest shadow-sm'
                                    : 'bg-bone text-stone border-sand hover:bg-sand/20'
                                }`}
                            >
                                <Calculator className="w-4 h-4 mb-1" />
                                Outro
                            </button>
                        </div>
                    </div>

                    {/* Conditional Unit Inputs */}
                    <div className="space-y-4 pt-2">
                        {calcState.showNome && (
                            <div>
                                <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Nome do Imóvel / Condomínio</label>
                                <input 
                                    type="text"
                                    value={calcState.nomeImovel}
                                    onChange={(e) => setCalcState({...calcState, nomeImovel: e.target.value})}
                                    className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                    placeholder="Ex: Condomínio Vinhas Anápolis"
                                />
                            </div>
                        )}

                        {calcState.showUnidadeImovel && (
                            <div>
                                <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Identificação / Nº da Unidade</label>
                                <input 
                                    type="text"
                                    value={calcState.unidadeImovel}
                                    onChange={(e) => setCalcState({...calcState, unidadeImovel: e.target.value})}
                                    className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                    placeholder="Ex: Apt 1402-A"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {calcState.showQuadra && (
                                <div>
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Quadra / Bloco</label>
                                    <input 
                                        type="text"
                                        value={calcState.quadra}
                                        onChange={(e) => setCalcState({...calcState, quadra: e.target.value})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 13"
                                    />
                                </div>
                            )}
                            {calcState.showLote && (
                                <div>
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Lote / Casa Nº</label>
                                    <input 
                                        type="text"
                                        value={calcState.lote}
                                        onChange={(e) => setCalcState({...calcState, lote: e.target.value})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 281"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {calcState.showVaga && (
                                <div>
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Vaga(s) Garagem</label>
                                    <input 
                                        type="text"
                                        value={calcState.vaga}
                                        onChange={(e) => setCalcState({...calcState, vaga: e.target.value})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 2 Vagas gaveta"
                                    />
                                </div>
                            )}
                            {calcState.showEscaninho && (
                                <div>
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Escaninho / Depósito</label>
                                    <input 
                                        type="text"
                                        value={calcState.escaninho}
                                        onChange={(e) => setCalcState({...calcState, escaninho: e.target.value})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: Escaninho 45"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Metragens */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {calcState.showM2Geral && (
                                <div className="sm:col-span-3">
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Área do Imóvel (m²)</label>
                                    <input 
                                        type="number"
                                        step="any"
                                        value={calcState.m2 || ''}
                                        onChange={(e) => setCalcState({...calcState, m2: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 439.29"
                                    />
                                </div>
                            )}

                            {calcState.showM2Privativo && (
                                <div className={calcState.showM2Total ? 'col-span-1' : 'col-span-2 sm:col-span-3'}>
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">m² Privativo (Construído)</label>
                                    <input 
                                        type="number"
                                        step="any"
                                        value={calcState.m2Privativo || ''}
                                        onChange={(e) => setCalcState({...calcState, m2Privativo: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 180"
                                    />
                                </div>
                            )}

                            {calcState.showM2Total && (
                                <div className={calcState.showM2Privativo ? 'col-span-1' : 'col-span-2 sm:col-span-3'}>
                                    <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">m² Total (Fração / Lote)</label>
                                    <input 
                                        type="number"
                                        step="any"
                                        value={calcState.m2Total || ''}
                                        onChange={(e) => setCalcState({...calcState, m2Total: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 360"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Data de Aquisição</label>
                            <input 
                                type="date"
                                value={calcState.dataCompra}
                                onChange={(e) => setCalcState({...calcState, dataCompra: e.target.value})}
                                className="w-full bg-bone border border-sand/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest font-medium text-stone font-mono"
                            />
                        </div>
                    </div>

                    {/* Financial Values Inputs */}
                    <div className="space-y-4 pt-4 border-t border-sand/50">
                        <div>
                            <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Valor de Venda Pretendido (R$)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-stone text-sm font-semibold">R$</span>
                                <input 
                                    type="number"
                                    value={calcState.valorVenda || ''}
                                    onChange={(e) => setCalcState({...calcState, valorVenda: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-bone border border-sand/70 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-forest font-bold text-forest"
                                    placeholder="Ex: 399.000,00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Valor Já Pago / Investido (R$)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-stone text-sm font-semibold">R$</span>
                                <input 
                                    type="number"
                                    value={calcState.recebidoPago || ''}
                                    onChange={(e) => setCalcState({...calcState, recebidoPago: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-bone border border-sand/70 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                    placeholder="Ex: 289.679,00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Saldo Devedor / A Pagar (R$)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-stone text-sm font-semibold">R$</span>
                                <input 
                                    type="number"
                                    value={calcState.saldoDevedor || ''}
                                    onChange={(e) => setCalcState({...calcState, saldoDevedor: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-bone border border-sand/70 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                    placeholder="Ex: 145.000,00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Comissão de Venda (%)</label>
                                <div className="relative">
                                    <span className="absolute right-4 top-3 text-stone text-sm font-semibold">%</span>
                                    <input 
                                        type="number"
                                        value={calcState.comissaoPct !== undefined ? calcState.comissaoPct : ''}
                                        onChange={(e) => setCalcState({...calcState, comissaoPct: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 5"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wide">Taxa de Cessão (%)</label>
                                <div className="relative">
                                    <span className="absolute right-4 top-3 text-stone text-sm font-semibold">%</span>
                                    <input 
                                        type="number"
                                        value={calcState.taxaCessaoPct !== undefined ? calcState.taxaCessaoPct : ''}
                                        onChange={(e) => setCalcState({...calcState, taxaCessaoPct: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-bone border border-sand/70 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-forest font-medium"
                                        placeholder="Ex: 1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Financial Summary Cards */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                    {/* Primary Calculation Dashboard */}
                    <div className="bg-bone border border-sand rounded-3xl p-6 md:p-8 flex-grow space-y-6 shadow-inner">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand pb-4 gap-2">
                            <h3 className="text-xl font-bold text-ink flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-forest" />
                                Demonstrativo de Ágio
                            </h3>
                            <div className="text-xs bg-forest/10 text-forest font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                                {calcState.showNome && calcState.nomeImovel ? calcState.nomeImovel : 'Imóvel'} 
                                {calcState.showUnidadeImovel && calcState.unidadeImovel ? ` - Unidade ${calcState.unidadeImovel}` : ''}
                                {calcState.showQuadra && calcState.quadra ? ` | Q. ${calcState.quadra}` : ''}
                                {calcState.showLote && calcState.lote ? ` L. ${calcState.lote}` : ''}
                            </div>
                        </div>

                        {/* Informative Header list of visible secondary metadata */}
                        {(calcState.showVaga || calcState.showEscaninho || calcState.showM2Privativo || calcState.showM2Total) && (
                            <div className="flex flex-wrap gap-2 text-xs bg-sand/30 p-3 rounded-2xl border border-sand/50">
                                {calcState.showVaga && calcState.vaga && (
                                    <span className="bg-white px-2.5 py-1 rounded-lg font-medium text-stone border border-sand/50">
                                        {calcState.vaga}
                                    </span>
                                )}
                                {calcState.showEscaninho && calcState.escaninho && (
                                    <span className="bg-white px-2.5 py-1 rounded-lg font-medium text-stone border border-sand/50">
                                        {calcState.escaninho}
                                    </span>
                                )}
                                {calcState.showM2Privativo && calcState.m2Privativo > 0 && (
                                    <span className="bg-white px-2.5 py-1 rounded-lg font-bold text-forest border border-sand/50">
                                        Privativo: {formatNumber(calcState.m2Privativo)} m²
                                    </span>
                                )}
                                {calcState.showM2Total && calcState.m2Total > 0 && (
                                    <span className="bg-white px-2.5 py-1 rounded-lg font-medium text-stone border border-sand/50">
                                        Total: {formatNumber(calcState.m2Total)} m²
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Highlighted Panel: Valor de Venda Total & Detailed Legend */}
                        <div className="bg-white p-6 rounded-2xl border-2 border-forest/20 shadow-sm space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-extrabold text-forest uppercase tracking-widest flex items-center gap-1">
                                        Valor Total de Venda Definido
                                    </span>
                                    <p className="text-3xl font-black text-ink">{formatCurrency(calcState.valorVenda)}</p>
                                </div>
                                <div className="text-left md:text-right space-y-1">
                                    <p className="text-xs text-stone font-semibold">Composição total do preço do imóvel</p>
                                    <p className="text-[10px] text-stone/80">Saldo Devedor + Ágio de Venda (Bruto)</p>
                                </div>
                            </div>

                            {/* Split Progress Bar */}
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                                    <div 
                                        style={{ width: `${calcState.valorVenda > 0 ? (calcState.saldoDevedor / calcState.valorVenda) * 100 : 0}%` }}
                                        className="h-full bg-amber-500/85 transition-all duration-500"
                                        title={`Saldo Devedor: ${calcState.valorVenda > 0 ? ((calcState.saldoDevedor / calcState.valorVenda) * 100).toFixed(1) : 0}%`}
                                    />
                                    <div 
                                        style={{ width: `${calcState.valorVenda > 0 ? (agio / calcState.valorVenda) * 100 : 0}%` }}
                                        className="h-full bg-forest transition-all duration-500"
                                        title={`Ágio de Venda: ${calcState.valorVenda > 0 ? ((agio / calcState.valorVenda) * 100).toFixed(1) : 0}%`}
                                    />
                                </div>

                                {/* Custom Legend & Value Breakdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {/* Left Card: Saldo Devedor */}
                                    <div className="flex items-start gap-2.5 bg-stone-50/70 p-3 rounded-xl border border-sand/40">
                                        <div className="w-3.5 h-3.5 rounded bg-amber-500/85 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-0.5 w-full">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] font-bold text-stone uppercase tracking-wider">Saldo Devedor (Quitação)</p>
                                                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                                    {calcState.valorVenda > 0 ? ((calcState.saldoDevedor / calcState.valorVenda) * 100).toFixed(1) : 0}%
                                                </span>
                                            </div>
                                            <p className="text-xl font-black text-ink leading-tight">{formatCurrency(calcState.saldoDevedor)}</p>
                                            <p className="text-[10px] text-stone">Parte assumida ou quitada pelo comprador</p>
                                        </div>
                                    </div>

                                    {/* Right Card: Ágio de Venda */}
                                    <div className="flex items-start gap-2.5 bg-forest-50/10 p-3 rounded-xl border border-forest/10">
                                        <div className="w-3.5 h-3.5 rounded bg-forest mt-0.5 flex-shrink-0" />
                                        <div className="space-y-0.5 w-full">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] font-bold text-forest uppercase tracking-wider font-semibold">Ágio de Venda (Bruto)</p>
                                                <span className="text-[10px] font-extrabold text-forest bg-forest/5 px-1.5 py-0.5 rounded">
                                                    {calcState.valorVenda > 0 ? ((agio / calcState.valorVenda) * 100).toFixed(1) : 0}%
                                                </span>
                                            </div>
                                            <p className="text-xl font-black text-forest leading-tight">{formatCurrency(agio)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Card: Ágio Bruto Details */}
                            <div className="bg-white p-5 rounded-2xl border border-sand/60 shadow-sm space-y-1">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider flex items-center gap-1">
                                    Ágio Bruto (Antes de Descontos)
                                    <Info className="w-3 h-3 text-stone/70 cursor-help" title="Valor de Venda - Saldo Devedor (Não inclui deduções de comissão e cessão)" />
                                </span>
                                <p className="text-2xl font-black text-ink">{formatCurrency(agio)}</p>
                                <p className="text-[10px] text-stone">Fórmula: Venda ({formatCurrency(calcState.valorVenda)}) - Saldo Devedor ({formatCurrency(calcState.saldoDevedor)})</p>
                            </div>

                            {/* Card: Ágio Líquido Details */}
                            <div className="bg-white p-5 rounded-2xl border border-sand/60 shadow-sm space-y-1">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider flex items-center gap-1">
                                    Ágio Líquido (Pós-Custos)
                                    <Info className="w-3 h-3 text-stone/70 cursor-help" title="Ágio - Comissão de Venda - Taxa de Cessão" />
                                </span>
                                <p className="text-2xl font-black text-forest">{formatCurrency(agioLiquido)}</p>
                                <p className="text-[10px] text-stone">Fórmula: Ágio ({formatCurrency(agio)}) - Comis. ({formatCurrency(comissaoRs)}) - Cessão ({formatCurrency(taxaCessaoRs)})</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 pt-2">
                            <div className="bg-white/60 p-3.5 rounded-xl border border-sand/40">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Preço / m²</span>
                                <p className="text-sm font-black text-ink mt-0.5" title={`Dividido pela área ativa de ${formatNumber(activeM2)} m²`}>
                                    {formatCurrency(reaisPorM2)}
                                </p>
                                <p className="text-[9px] text-stone">Área: {formatNumber(activeM2)} m²</p>
                            </div>
                            <div className="bg-white/60 p-3.5 rounded-xl border border-sand/40">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Período</span>
                                <p className="text-sm font-black text-ink mt-0.5">{tempoMeses} meses</p>
                                <p className="text-[9px] text-stone">Desde a aquisição</p>
                            </div>
                            <div className="bg-white/60 p-3.5 rounded-xl border border-sand/40">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Comissão</span>
                                <p className="text-sm font-black text-stone mt-0.5">{formatCurrency(comissaoRs)}</p>
                                <p className="text-[9px] text-stone">{calcState.comissaoPct}% do total</p>
                            </div>
                            <div className="bg-white/60 p-3.5 rounded-xl border border-sand/40">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Taxa Cessão</span>
                                <p className="text-sm font-black text-stone mt-0.5">{formatCurrency(taxaCessaoRs)}</p>
                                <p className="text-[9px] text-stone">{calcState.taxaCessaoPct}% do total</p>
                            </div>
                            <div className="bg-white/60 p-3.5 rounded-xl border border-sand/40 col-span-2 sm:col-span-1">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Valor Pago + Devido</span>
                                <p className="text-sm font-black text-ink mt-0.5" title="Recebido + Saldo Devedor">{formatCurrency(recebidoMaisReceber)}</p>
                                <p className="text-[9px] text-stone">Custo total original</p>
                            </div>
                        </div>

                        {/* Bottom Highlight: Profit / Loss Statement */}
                        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            lucro >= 0 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                            : 'bg-rose-50/70 border-rose-200 text-rose-950'
                        }`}>
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone">Resultado Líquido Operacional</span>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-3xl font-black">{formatCurrency(lucro)}</h4>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        lucro >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {formatPercent(lucroPct)}
                                    </span>
                                </div>
                                <p className="text-xs text-stone/90">Fórmula: Ágio Líquido ({formatCurrency(agioLiquido)}) - Valor Pago/Investido ({formatCurrency(calcState.recebidoPago)})</p>
                            </div>

                            <div className="text-left sm:text-right space-y-0.5 border-t sm:border-t-0 sm:border-l border-sand sm:pl-6 pt-3 sm:pt-0 w-full sm:w-auto">
                                <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Rentabilidade a.m.</span>
                                <p className="text-xl font-bold tracking-tight">{formatPercent(lucroLiquidoAm)} a.m.</p>
                                <p className="text-[10px] text-stone">Retorno Simples Mensalizado</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Smart Action Card */}
                    {mediaReaisPorM2 > 0 && (
                        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex gap-3">
                                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg self-start sm:self-auto">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-stone uppercase tracking-wide">Avaliação do Mercado Regional</p>
                                    <p className="text-sm text-stone mt-0.5">
                                        Média regional de anúncios: <strong className="text-ink">{formatCurrency(mediaReaisPorM2)}/m²</strong>. O valor estimado para a área de cálculo ativa ({formatNumber(activeM2)} m²) é de <strong className="text-forest">{formatCurrency(valorEstimadoMercado)}</strong>.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleApplyEstimatedValue}
                                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-all shadow-sm cursor-pointer border-none"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                Usar Avaliação
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 3: Comparative Analysis Table */}
            <div className="bg-white rounded-3xl border border-sand/50 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand pb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sand/40 rounded-xl text-forest">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-ink">Pesquisa mercadológica do mercado imobiliário com base em anúncios de imóveis ativos e disponíveis na região</h3>
                            <p className="text-xs text-stone mt-0.5">Balizamento de preços por metro quadrado</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-bone border border-sand px-4 py-2.5 rounded-2xl text-xs font-bold">
                            Média de Mercado: <span className="text-forest text-sm ml-1 font-black">{formatCurrency(mediaReaisPorM2)}/m²</span>
                        </div>
                        <div className="bg-bone border border-sand px-4 py-2.5 rounded-2xl text-xs font-bold">
                            Avaliação do Imóvel: <span className="text-forest text-sm ml-1 font-black">{formatCurrency(valorEstimadoMercado)}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleClearComparatives}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-rose-100 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer h-[38px] border-solid"
                            title="Limpar todos os anúncios da pesquisa"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Limpar Tudo
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-sand/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bone border-b border-sand text-stone text-[11px] font-extrabold uppercase tracking-wider">
                                <th className="px-5 py-4">Unidade</th>
                                <th className="px-5 py-4">Empreendimento</th>
                                <th className="px-5 py-4 text-right">Área (m²)</th>
                                <th className="px-5 py-4 text-right">Preço (R$)</th>
                                <th className="px-5 py-4 text-right">R$/m²</th>
                                <th className="px-5 py-4 text-center">Anúncio</th>
                                <th className="px-5 py-4 text-center w-20">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sand/40 text-sm">
                            {calculatedComparatives.map((item) => (
                                <tr key={item.id} className="hover:bg-bone/40 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-ink">{item.unidade}</td>
                                    <td className="px-5 py-4 text-stone">{item.produto}</td>
                                    <td className="px-5 py-4 text-right font-medium text-stone">{formatNumber(item.metragem)} m²</td>
                                    <td className="px-5 py-4 text-right font-bold text-ink">{formatCurrency(item.precoPedido)}</td>
                                    <td className="px-5 py-4 text-right font-black text-forest">{formatCurrency(item.reaisPorM2)}/m²</td>
                                    <td className="px-5 py-4 text-center">
                                        {item.link ? (
                                            <a 
                                                href={item.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center gap-1 text-xs text-forest hover:text-forest/80 font-bold hover:underline"
                                            >
                                                Anúncio <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-stone/50">-</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button 
                                            onClick={() => handleDeleteComp(item.id)}
                                            className="text-stone hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
                                            title="Excluir Comparativo"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {calculatedComparatives.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-stone font-medium">
                                        Nenhum lote ou imóvel comparativo cadastrado. Adicione um abaixo!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Form to Add New Comparative */}
                <form onSubmit={handleAddComp} className="bg-bone border border-sand/70 rounded-2xl p-5 space-y-4">
                    <p className="text-xs font-extrabold text-stone uppercase tracking-wider flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Adicionar Imóvel Comparativo
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-stone mb-1 uppercase">Unidade</label>
                            <input 
                                type="text"
                                value={newComp.unidade}
                                onChange={(e) => setNewComp({...newComp, unidade: e.target.value})}
                                className="w-full bg-white border border-sand/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-forest"
                                placeholder="Ex: QD.15 LT.04"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-stone mb-1 uppercase">Área (m²)</label>
                            <input 
                                type="number"
                                step="any"
                                value={newComp.metragem}
                                onChange={(e) => setNewComp({...newComp, metragem: e.target.value})}
                                className="w-full bg-white border border-sand/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-forest"
                                placeholder="Ex: 360"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-stone mb-1 uppercase">Preço (R$)</label>
                            <input 
                                type="number"
                                step="any"
                                value={newComp.precoPedido}
                                onChange={(e) => setNewComp({...newComp, precoPedido: e.target.value})}
                                className="w-full bg-white border border-sand/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-forest"
                                placeholder="Ex: 450000"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-stone mb-1 uppercase">Empreendimento</label>
                            <input 
                                type="text"
                                value={newComp.produto}
                                onChange={(e) => setNewComp({...newComp, produto: e.target.value})}
                                className="w-full bg-white border border-sand/70 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-forest"
                                placeholder="Ex: Vinhas Anápolis"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-stone mb-1 uppercase">Link do Anúncio</label>
                            <input 
                                type="url"
                                value={newComp.link}
                                onChange={(e) => setNewComp({...newComp, link: e.target.value})}
                                className="w-full bg-white border border-sand/70 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-forest"
                                placeholder="https://exemplo.com/anuncio"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-end">
                            <button 
                                type="submit"
                                className="w-full bg-forest hover:bg-forest/90 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
