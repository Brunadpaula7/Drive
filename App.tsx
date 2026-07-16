import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { JobSection } from './components/JobSection';
import { LogoSection } from './components/LogoSection';
import { PipelineCalendar } from './components/PipelineCalendar';
import { CertidoesSection } from './components/CertidoesSection';
import { SalesLinksSection } from './components/SalesLinksSection';
import { LaunchSection } from './components/LaunchSection';
import { SettingsModal } from './components/SettingsModal';
import { Modal } from './components/Modal';
import { EditLogoModal } from './components/EditLogoModal';
import { EditPipelineEventModal } from './components/EditPipelineEventModal';
import { 
  Building2, 
  Search, 
  Calendar, 
  Link2, 
  FileCheck, 
  TrendingUp,
  Sparkles,
  User,
  FolderOpen,
  Table,
  ExternalLink,
  FileText,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Job, LogoData, LaunchProject, PipelineMonth, InfoBoardData, CitySection, Logo, PipelineEvent } from './types';
import { 
  initialIncorporadorasData, initialCidadesData, initialLaunchesData,
  initialRawJobData, initialPipelineData, initialInfoBoardData,
  initialJetimoveisUrl, initialCoverPhotoUrl 
} from './constants';
import { AgioCalculator } from './components/AgioCalculator';

const App = () => {
    const loadData = <T,>(key: string, initial: T): T => {
        try {
            const stored = localStorage.getItem(key);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return initial;
    };

    const saveData = (key: string, value: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
    };

    const [incorporadorasData, setIncorporadorasData] = useState<LogoData>(() => {
        const loaded = loadData('incorporadorasData', initialIncorporadorasData) as Logo[];
        
        // Ensure 'opus' is in the array with correct modalId and no href
        const opusIndex = loaded.findIndex(item => item.id === 'opus');
        if (opusIndex >= 0) {
            loaded[opusIndex] = {
                ...loaded[opusIndex],
                href: undefined,
                modalId: 'opus-modal'
            };
        } else {
            loaded.unshift({
                id: 'opus',
                name: 'Opus',
                imgSrc: 'https://placehold.co/100x100/d1fae5/065f46?text=Opus',
                modalId: 'opus-modal'
            });
        }

        // Ensure 'city' is in the array with correct modalId and no href
        const cityIndex = loaded.findIndex(item => item.id === 'city');
        if (cityIndex >= 0) {
            loaded[cityIndex] = {
                ...loaded[cityIndex],
                href: undefined,
                modalId: 'city-modal'
            };
        } else {
            loaded.unshift({
                id: 'city',
                name: 'CITY',
                imgSrc: 'https://placehold.co/100x100/d1fae5/065f46?text=CITY',
                modalId: 'city-modal'
            });
        }

        return loaded;
    });
    const [cidadesData, setCidadesData] = useState<CitySection[]>(loadData('cidadesData', initialCidadesData));
    const [launchesData, setLaunchesData] = useState<LaunchProject[]>(loadData('launchesData', initialLaunchesData));
    const [pipelineData, setPipelineData] = useState<PipelineMonth[]>(loadData('pipelineData_v2', initialPipelineData));
    const [rawJobData, setRawJobData] = useState<string>(() => {
        try {
            const stored = localStorage.getItem('rawJobData');
            if (stored) return stored;
        } catch (e) {}
        return initialRawJobData;
    });
    const [jetimoveisUrl, setJetimoveisUrl] = useState<string>(() => {
        try {
            const stored = localStorage.getItem('jetimoveisUrl_v2');
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return initialJetimoveisUrl;
    });
    const [coverPhotoUrl, setCoverPhotoUrl] = useState<string>(() => {
        try {
            const stored = localStorage.getItem('coverPhotoUrl_v2');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed === "https://i.ibb.co/gLFs8xyx/Captura-de-tela-2026-07-14-114757.jpg") {
                    localStorage.removeItem('coverPhotoUrl_v2');
                    return initialCoverPhotoUrl;
                }
                return parsed;
            }
        } catch (e) {}
        return initialCoverPhotoUrl;
    });

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);
    const [activeTab, setActiveTab] = useState<'revendas' | 'launches' | 'pipeline' | 'logos' | 'links' | 'certidoes' | 'agio'>(() => loadData('activeTab', 'links'));

    const handleTabChange = (tab: 'revendas' | 'launches' | 'pipeline' | 'logos' | 'links' | 'certidoes' | 'agio') => {
        setActiveTab(tab);
        saveData('activeTab', tab);
    };

    // Edit Modals State
    const [editingLogo, setEditingLogo] = useState<{ logo: Logo | null, section: 'incorporadoras' | 'cidades', cityId?: string } | null>(null);
    const [editingEvent, setEditingEvent] = useState<{ event: PipelineEvent | null, month: string, year: string } | null>(null);
    const [activeLogoModalId, setActiveLogoModalId] = useState<string | null>(null);

    const parsedJobs = useMemo((): Job[] => {
        const data = rawJobData.trim();
        if (!data) return [];
        
        let parsedJobsResult: Job[] = [];
        
        // JSON Parser
        if (data.startsWith('[')) {
            try {
                const jsonData = JSON.parse(data);
                parsedJobsResult = jsonData.map((item: any, index: number) => {
                    const jt = item.id ? String(item.id) : 'N/A';
                    let property = item.titulo ? String(item.titulo) : (item.tipo ? String(item.tipo) : 'Propriedade não informada');
                    if (!item.titulo && item.bairro) property += ' - ' + String(item.bairro);
                    
                    const job = `JOB_JSON_${index}`;
                    const raw = `${jt} (${property})`.trim();
                    
                    let locationDetails = [item.bairro ? String(item.bairro) : '', item.cidade ? String(item.cidade) : ''].filter(Boolean).join(', ');
                    if (item.endereco) {
                        locationDetails = String(item.endereco) + ', ' + locationDetails;
                    }
                    
                    let price = item.valor ? (typeof item.valor === 'string' && item.valor.startsWith('R') ? item.valor : 'R$ ' + Number(item.valor).toLocaleString('pt-BR')) : undefined;
                    
                    let photos = item.fotos || [];
                    if (typeof photos === 'string') {
                        try { photos = JSON.parse(photos); } catch (e) { photos = [photos]; }
                    }
                    return {
                        id: `${job}-${jt}-${Math.random()}`,
                        job, jt, property, agents: [], raw, locationDetails,
                        area: item.area || item.area_privativa, areaTotal: item.area_total,
                        quartos: item.quartos, suites: item.suites, bathrooms: item.banheiros,
                        parking: item.vagas, price, condominio: item.condominio, iptu: item.iptu,
                        description: item.descricao ? String(item.descricao) : undefined,
                        photos, features: item.features, operacao: item.operacao ? String(item.operacao) : undefined,
                        tipo: item.tipo ? String(item.tipo) : undefined, url: item.url ? String(item.url) : ''
                    };
                });
            } catch (e) {}
        }
        
        // XML Parser
        if (data.startsWith('<') && parsedJobsResult.length === 0) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                let imoveis = Array.from(xmlDoc.getElementsByTagName('Imovel'));
                if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('imovel'));
                if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('IMOVEL'));
                if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('Listing')); // Support VRSync listings
                
                parsedJobsResult = imoveis.map((imovel, index) => {
                    const getTagContent = (tagName: string) => {
                        let tag = imovel.getElementsByTagName(tagName)[0];
                        if (!tag) tag = imovel.getElementsByTagName(tagName.toLowerCase())[0];
                        if (!tag) tag = imovel.getElementsByTagName(tagName.toUpperCase())[0];
                        return tag?.textContent?.trim() || '';
                    };
                    
                    let jt = getTagContent('CodigoImovel') || getTagContent('codigo') || getTagContent('ListingID') || 'N/A';
                    let tipo = getTagContent('TipoImovel') || getTagContent('PropertyType');
                    let subtipo = getTagContent('SubTipoImovel') || getTagContent('subtipo');
                    let property = getTagContent('TituloImovel') || getTagContent('Title') || (tipo ? `${tipo}${subtipo ? ' - ' + subtipo : ''}` : 'Propriedade não informada');
                    
                    // clean CDATA wrapper
                    property = property.replace("<![CDATA[", "").replace("]]>", "").trim();
                    
                    let bairro = getTagContent('Bairro') || getTagContent('Neighborhood');
                    bairro = bairro.replace("<![CDATA[", "").replace("]]>", "").trim();
                    let cidade = getTagContent('Cidade') || getTagContent('City');
                    cidade = cidade.replace("<![CDATA[", "").replace("]]>", "").trim();
                    let uf = getTagContent('UF') || getTagContent('State');
                    
                    if (bairro && !property.includes(bairro)) property += ' - ' + bairro;
                    
                    let agents = (getTagContent('Corretor') || '').split('/').map(a => a.trim()).filter(Boolean);
                    const job = `JOB_XML_${index}`;
                    const raw = `${jt} (${property} ${agents.length > 0 ? '- ' + agents.join(' / ') : ''})`.trim();
                    
                    let locationDetails = [bairro, cidade, uf].filter(Boolean).join(', ');
                    
                    let area = getTagContent('AreaUtil') || getTagContent('LivingArea');
                    let areaTotal = getTagContent('AreaTotal') || getTagContent('LotArea');
                    let quartos = getTagContent('QtdDormitorios') || getTagContent('Bedrooms');
                    let suites = getTagContent('QtdSuites') || getTagContent('Suites');
                    let salas = getTagContent('QtdSalas');
                    let bathrooms = getTagContent('QtdBanheiros') || getTagContent('Bathrooms');
                    let parking = getTagContent('QtdVagas') || getTagContent('Garage');
                    
                    let price = getTagContent('PrecoVenda') || getTagContent('ListPrice') || getTagContent('RentalPrice');
                    if (price && !price.startsWith('R$')) price = 'R$ ' + Number(price).toLocaleString('pt-BR');

                    let operacao = getTagContent('TipoOferta') || getTagContent('TransactionType');
                    if (operacao === 'For Sale') operacao = 'Venda';
                    if (operacao === 'For Rent') operacao = 'Locação';

                    let condominio = getTagContent('ValorCondominio') || getTagContent('PropertyAdministrationFee');

                    let features: string[] = [];
                    let featuresNode = imovel.getElementsByTagName('Features')[0];
                    if (featuresNode) {
                        features = Array.from(featuresNode.getElementsByTagName('Feature')).map(f => f.textContent?.trim()).filter(Boolean) as string[];
                    }
                    
                    let iptu = getTagContent('ValorIPTU') || getTagContent('Iptu');
                    
                    let description = getTagContent('Observacao') || getTagContent('Description');
                    description = description.replace("<![CDATA[", "").replace("]]>", "").trim();
                    
                    let photos: string[] = [];
                    let fotosNode = imovel.getElementsByTagName('Fotos')[0] || imovel.getElementsByTagName('Media')[0];
                    if (fotosNode) {
                        let fotoNodes = Array.from(fotosNode.getElementsByTagName('Foto'));
                        if (fotoNodes.length === 0) fotoNodes = Array.from(fotosNode.getElementsByTagName('Item'));
                        photos = fotoNodes.map(f => {
                            let urlNode = f.getElementsByTagName('URLArquivo')[0] || f.getElementsByTagName('url')[0] || f.getElementsByTagName('URL')[0];
                            return urlNode?.textContent?.trim() || f.textContent?.trim();
                        }).filter((u): u is string => Boolean(u));
                    }
                    
                    let url = getTagContent('URLImovel') || getTagContent('DetailViewUrl');
                    
                    return {
                        id: `${job}-${jt}-${Math.random()}`,
                        job, jt, property, agents, raw, locationDetails, area, areaTotal,
                        quartos, suites, salas, bathrooms, parking, price, condominio, iptu,
                        description, photos, url, features, operacao, tipo
                    };
                });
            } catch (e) {}
        }
        
        return parsedJobsResult;
    }, [rawJobData]);

    const handleRefreshJobs = async () => {
        if (!jetimoveisUrl) {
            alert('Por favor, configure a URL do XML nas configurações primeiro.');
            setIsSettingsModalOpen(true);
            return;
        }
        setIsRefreshingJobs(true);
        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(jetimoveisUrl)}`);
            if (!response.ok) throw new Error(`Erro de rede: ${response.status}`);
            const xmlText = await response.text();
            setRawJobData(xmlText);
            saveData('rawJobData', xmlText);
            localStorage.setItem('lastSyncTime', Date.now().toString());
            alert('Dados de revendas atualizados com sucesso!');
        } catch (e) {
            alert('Não foi possível buscar os dados.');
        } finally {
            setIsRefreshingJobs(false);
        }
    };

    const revendasCount = parsedJobs.length;
    const launchesCount = launchesData.length;
    const pipelineCount = useMemo(() => {
        return pipelineData.reduce((acc, item) => acc + item.events.length, 0);
    }, [pipelineData]);

    interface AppTab {
        id: 'revendas' | 'launches' | 'pipeline' | 'logos' | 'links' | 'certidoes' | 'agio';
        label: string;
        icon: React.ReactNode;
        count?: number;
    }

    const tabs: AppTab[] = [
        { id: 'links', label: 'Links de Vendas', icon: <Link2 className="w-4 h-4" /> },
        { id: 'revendas', label: 'Revendas (XML)', icon: <Search className="w-4 h-4" />, count: revendasCount },
        { id: 'launches', label: 'Lançamentos', icon: <TrendingUp className="w-4 h-4" />, count: launchesCount },
        { id: 'pipeline', label: 'Cronograma', icon: <Calendar className="w-4 h-4" />, count: pipelineCount },
        { id: 'logos', label: 'Incorp. & Cidades', icon: <Building2 className="w-4 h-4" /> },
        { id: 'agio', label: 'Cálculo de Ágio', icon: <Calculator className="w-4 h-4" /> },
        { id: 'certidoes', label: 'Certidões', icon: <FileCheck className="w-4 h-4" /> },
    ];

    return (
        <div className="p-4 md:p-8 font-sans min-h-screen relative">
            <div className="max-w-7xl mx-auto relative">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="absolute -top-2 -left-2 sm:top-0 sm:left-0 z-20 p-3 bg-white/30 backdrop-blur-lg rounded-full shadow-md border border-white/40 text-zinc-600 hover:text-zinc-900 hover:bg-white/50 transition-all transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div className="print:hidden">
                    <Header 
                        coverPhotoUrl={coverPhotoUrl}
                        onSearch={setGlobalSearch}
                    />
                </div>
                
                {/* Navigation Tab Buttons */}
                <div className="print:hidden mt-8 mb-6 border-b border-sand pb-6 flex items-center justify-between gap-4 flex-wrap">
                    <div className="grid grid-cols-2 xs:grid-cols-3 lg:flex lg:flex-wrap gap-2 md:gap-3 w-full">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-300 border cursor-pointer select-none ${
                                        isActive 
                                        ? 'bg-forest text-white border-forest shadow-[0_4px_14px_rgba(31,58,46,0.2)]' 
                                        : 'bg-white/50 hover:bg-sand/30 border-sand/40 text-stone hover:text-ink'
                                    } transform active:scale-95`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-sand text-stone font-bold'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="print:hidden mt-4 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            {activeTab === 'revendas' && (
                                <JobSection 
                                    jobs={parsedJobs} 
                                    onRefresh={handleRefreshJobs} 
                                    isRefreshing={isRefreshingJobs} 
                                    globalSearch={globalSearch} 
                                />
                            )}
                            {activeTab === 'launches' && (
                                <LaunchSection launches={launchesData} globalSearch={globalSearch} />
                            )}
                            {activeTab === 'pipeline' && (
                                <PipelineCalendar data={pipelineData} />
                            )}
                            {activeTab === 'logos' && (
                                <div className="space-y-8">
                                    <LogoSection 
                                        title="Acesso Rápido - Incorporadoras e Construtoras"
                                        data={incorporadorasData}
                                        onLogoClick={(id) => setActiveLogoModalId(id)}
                                        searchPlaceholder="Buscar por incorporadora ou construtora..."
                                        globalSearch={globalSearch}
                                    />
                                    <LogoSection 
                                        title="Acesso Rápido - Cidades"
                                        data={cidadesData}
                                        onLogoClick={(id) => setActiveLogoModalId(id)}
                                        isCitySection={true}
                                        searchPlaceholder="Buscar por empreendimento ou cidade..."
                                        globalSearch={globalSearch}
                                    />
                                </div>
                            )}
                            {activeTab === 'links' && (
                                <SalesLinksSection />
                            )}
                            {activeTab === 'agio' && (
                                <AgioCalculator />
                            )}
                            {activeTab === 'certidoes' && (
                                <CertidoesSection />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                incorporadorasData={incorporadorasData}
                cidadesData={cidadesData}
                launchesData={launchesData}
                pipelineData={pipelineData}
                rawJobData={rawJobData}
                jetimoveisUrl={jetimoveisUrl}
                coverPhotoUrl={coverPhotoUrl}
                onSaveLaunches={(data) => { setLaunchesData(data); saveData('launchesData', data); }}
                onSaveRawJobs={(data) => { setRawJobData(data); saveData('rawJobData', data); }}
                onSaveJetimoveisUrl={(url) => { setJetimoveisUrl(url); saveData('jetimoveisUrl_v2', url); }}
                onSaveCoverPhoto={(url) => { setCoverPhotoUrl(url); saveData('coverPhotoUrl_v2', url); }}
                onEditLogo={(logo, section, cityId) => setEditingLogo({ logo, section, cityId })}
                onDeleteLogo={(logoId, section, cityId) => {
                    if (section === 'incorporadoras') {
                        const newData = incorporadorasData.filter(item => !('id' in item) || item.id !== logoId);
                        setIncorporadorasData(newData); saveData('incorporadorasData', newData);
                    } else if (section === 'cidades' && cityId) {
                        const newCidades = cidadesData.map(c => c.id === cityId ? { ...c, logos: c.logos.filter(l => l.id !== logoId) } : c);
                        setCidadesData(newCidades); saveData('cidadesData', newCidades);
                    }
                }}
                onAddCity={(cityName) => {
                    if (cityName && !cidadesData.some(c => c.city.toLowerCase() === cityName.toLowerCase())) {
                        const newCity: CitySection = { id: crypto.randomUUID(), city: cityName, logos: [] };
                        const newCidades = [...cidadesData, newCity];
                        setCidadesData(newCidades); saveData('cidadesData', newCidades);
                    }
                }}
                onDeleteCity={(cityId) => {
                    const newCidades = cidadesData.filter(c => c.id !== cityId);
                    setCidadesData(newCidades); saveData('cidadesData', newCidades);
                }}
                onUpdateCityName={(cityId, newName) => {
                    const newCidades = cidadesData.map(c => c.id === cityId ? { ...c, city: newName } : c);
                    setCidadesData(newCidades); saveData('cidadesData', newCidades);
                }}
                onEditPipelineEvent={(event, month, year) => setEditingEvent({ event, month, year })}
                onDeletePipelineEvent={(eventId, month, year) => {
                    const newData = pipelineData.map(m => (m.month === month && m.year === year) ? { ...m, events: m.events.filter(e => e.id !== eventId) } : m);
                    setPipelineData(newData); saveData('pipelineData_v2', newData);
                }}
                onAddNextMonthToPipeline={() => {}}
                onDeleteMonthFromPipeline={() => {}}
            />

            {editingLogo && (
                <EditLogoModal 
                    isOpen={true}
                    onClose={() => setEditingLogo(null)}
                    logo={editingLogo.logo}
                    onSave={(logo) => {
                        if (editingLogo.section === 'incorporadoras') {
                            const newData = [...incorporadorasData];
                            const idx = newData.findIndex(l => !('city' in l) && l.id === logo.id);
                            if (idx >= 0) newData[idx] = logo; else newData.push(logo);
                            setIncorporadorasData(newData); saveData('incorporadorasData', newData);
                        } else if (editingLogo.section === 'cidades' && editingLogo.cityId) {
                            const newCidades = cidadesData.map(c => {
                                if (c.id === editingLogo.cityId) {
                                    const logos = [...c.logos];
                                    const idx = logos.findIndex(l => l.id === logo.id);
                                    if (idx >= 0) logos[idx] = logo; else logos.push(logo);
                                    return { ...c, logos };
                                }
                                return c;
                            });
                            setCidadesData(newCidades); saveData('cidadesData', newCidades);
                        }
                        setEditingLogo(null);
                    }}
                />
            )}

            {editingEvent && (
                <EditPipelineEventModal 
                    isOpen={true}
                    onClose={() => setEditingEvent(null)}
                    event={editingEvent.event}
                    onSave={(event) => {
                        const newData = pipelineData.map(m => {
                            if (m.month === editingEvent.month && m.year === editingEvent.year) {
                                const events = [...m.events];
                                const idx = events.findIndex(e => e.id === event.id);
                                if (idx >= 0) events[idx] = event; else events.push(event);
                                return { ...m, events };
                            }
                            return m;
                        });
                        setPipelineData(newData); saveData('pipelineData_v2', newData);
                        setEditingEvent(null);
                    }}
                />
            )}

            {activeLogoModalId && (
                <Modal 
                    isOpen={true} 
                    onClose={() => setActiveLogoModalId(null)} 
                    title={
                        activeLogoModalId === 'opus-modal' 
                        ? "OPUS Incorporadora - Links e Materiais" 
                        : activeLogoModalId === 'city-modal' 
                        ? "City Soluções Urbanas - Links e Materiais" 
                        : "Informações e Links Rápidos"
                    }
                >
                    {activeLogoModalId === 'opus-modal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                            {[
                                {
                                    title: "OPUS Lançamento",
                                    url: "https://beacons.ai/opuslancamento",
                                    desc: "Materiais comerciais, books, imagens e tabelas de lançamentos mais recentes da OPUS.",
                                    icon: <Building2 className="w-5 h-5 text-forest" />
                                },
                                {
                                    title: "OPUS Marco Aurélio",
                                    url: "https://beacons.ai/marcorelioopus",
                                    desc: "Canal e materiais comerciais vinculados ao gestor Marco Aurélio (OPUS).",
                                    icon: <User className="w-5 h-5 text-forest" />
                                },
                                {
                                    title: "OPUS Premium",
                                    url: "https://beacons.ai/opuspremium",
                                    desc: "Materiais exclusivos de alto padrão para a carteira de imóveis OPUS Premium.",
                                    icon: <Sparkles className="w-5 h-5 text-forest" />
                                },
                                {
                                    title: "OPUS Denis Branco",
                                    url: "https://beacons.ai/denisbranco",
                                    desc: "Acesso a materiais comerciais e novidades sob gestão de Denis Branco (OPUS).",
                                    icon: <User className="w-5 h-5 text-forest" />
                                },
                                {
                                    title: "OPUS Saul Júnior",
                                    url: "https://beacons.ai/sauljunior",
                                    desc: "Acesso a materiais e contatos comerciais sob gestão de Saul Júnior (OPUS).",
                                    icon: <User className="w-5 h-5 text-forest" />
                                },
                                {
                                    title: "Portal do Corretor OPUS",
                                    url: "https://portaldocorretor.opus.inc/login?redirectTo=https%3A%2F%2Fportaldocorretor.opus.inc%2F",
                                    desc: "Portal oficial logado para corretores parceiros com tabelas e espelhos de vendas.",
                                    icon: <Link2 className="w-5 h-5 text-forest" />
                                }
                            ].map((link, idx) => (
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
                    )}
                    {activeLogoModalId === 'city-modal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                            {[
                                {
                                    title: "Drive de Materiais City",
                                    url: "https://drive.google.com/drive/folders/1wN5H6feWbW3hebFSSLw_Xstui74nOAp_?usp=sharing",
                                    desc: "Pasta oficial no Google Drive com todos os materiais de divulgação, fotos e plantas.",
                                    icon: <FolderOpen className="w-5 h-5 text-forest" />
                                },
                                {
                                    title: "Tabela de Vendas City",
                                    url: "https://www.city-solucoes.com/tabela-de-vendas",
                                    desc: "Tabela oficial atualizada de preços e disponibilidades dos empreendimentos City.",
                                    icon: <Table className="w-5 h-5 text-forest" />
                                }
                            ].map((link, idx) => (
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
                    )}
                    {activeLogoModalId !== 'opus-modal' && activeLogoModalId !== 'city-modal' && (
                        <div className="p-8 text-center text-stone">
                            <Link2 className="w-12 h-12 text-sand mx-auto mb-4" />
                            <p className="text-lg font-bold text-ink mb-2">Materiais comerciais em breve</p>
                            <p className="text-sm">Os links e arquivos para esta incorporadora serão cadastrados em breve por nossa equipe.</p>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default App;
