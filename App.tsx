import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { JobSection } from './components/JobSection';
import { LogoSection } from './components/LogoSection';
import { PipelineCalendar } from './components/PipelineCalendar';
import { CertidoesSection } from './components/CertidoesSection';
import { SalesLinksSection } from './components/SalesLinksSection';
import { LaunchSection } from './components/LaunchSection';
import { SettingsModal } from './components/SettingsModal';
import { PrintReport } from './components/PrintReport';
import { Modal } from './components/Modal';
import { EditLogoModal } from './components/EditLogoModal';
import { EditPipelineEventModal } from './components/EditPipelineEventModal';
import type { Job, LogoData, LaunchProject, PipelineMonth, InfoBoardData, CitySection, Logo, PipelineEvent } from './types';
import { 
  initialIncorporadorasData, initialCidadesData, initialLaunchesData,
  initialRawJobData, initialPipelineData, initialInfoBoardData,
  initialJetimoveisUrl, initialCoverPhotoUrl 
} from './constants';

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

    const [incorporadorasData, setIncorporadorasData] = useState<LogoData>(loadData('incorporadorasData', initialIncorporadorasData));
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
            const stored = localStorage.getItem('coverPhotoUrl');
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return initialCoverPhotoUrl;
    });

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);

    // Edit Modals State
    const [editingLogo, setEditingLogo] = useState<{ logo: Logo | null, section: 'incorporadoras' | 'cidades', cityId?: string } | null>(null);
    const [editingEvent, setEditingEvent] = useState<{ event: PipelineEvent | null, month: string, year: string } | null>(null);

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
                    
                    let price = getTagContent('PrecoVenda') || getTagContent('ListPrice');
                    if (price && !price.startsWith('R$')) price = 'R$ ' + Number(price).toLocaleString('pt-BR');
                    
                    let condominio = getTagContent('ValorCondominio') || getTagContent('PropertyAdministrationFee');
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
                        description, photos, url
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
                
                <div className="print:hidden mt-8">
                    <JobSection 
                        jobs={parsedJobs} 
                        onRefresh={handleRefreshJobs} 
                        isRefreshing={isRefreshingJobs} 
                        globalSearch={globalSearch} 
                    />
                </div>

                <div className="print:hidden mt-8">
                    <LogoSection 
                        title="Acesso Rápido - Incorporadoras e Construtoras"
                        data={incorporadorasData}
                        onLogoClick={() => {}}
                        searchPlaceholder="Buscar por incorporadora ou construtora..."
                        globalSearch={globalSearch}
                    />
                    <LogoSection 
                        title="Acesso Rápido - Cidades"
                        data={cidadesData}
                        onLogoClick={() => {}}
                        isCitySection={true}
                        searchPlaceholder="Buscar por empreendimento ou cidade..."
                        globalSearch={globalSearch}
                    />
                </div>

                <div className="print:hidden mt-8">
                    <PipelineCalendar data={pipelineData} />
                    <div className="mt-8">
                        <SalesLinksSection />
                    </div>
                    <div className="mt-8">
                        <LaunchSection launches={launchesData} globalSearch={globalSearch} />
                    </div>
                    <div className="mt-8">
                        <CertidoesSection />
                    </div>
                </div>

                <PrintReport jobs={parsedJobs} launches={launchesData} />
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
                onSaveCoverPhoto={(url) => { setCoverPhotoUrl(url); saveData('coverPhotoUrl', url); }}
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
        </div>
    );
};

export default App;
