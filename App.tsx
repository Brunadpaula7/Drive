
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { LogoSection } from './components/LogoSection';
import { JobSection } from './components/JobSection';
import { LaunchSection } from './components/LaunchSection';
import { CertidoesSection } from './components/CertidoesSection';
import { PrintReport } from './components/PrintReport';
import { SalesLinksSection } from './components/SalesLinksSection';
import { PipelineCalendar } from './components/PipelineCalendar';
import { Modal } from './components/Modal';
import { SettingsModal } from './components/SettingsModal';
import { EditLogoModal } from './components/EditLogoModal';
import { EditPipelineEventModal } from './components/EditPipelineEventModal';
import { 
    initialIncorporadorasData, 
    initialCidadesData, 
    initialRawJobData, 
    initialLaunchesData, 
    initialPipelineData,
        initialJetimoveisUrl,
    initialCoverPhotoUrl
} from './constants';
import type { Job, Logo, CitySection, LogoData, LaunchProject, PipelineMonth, InfoBoardData, PipelineEvent } from './types';

const App: React.FC = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');

    const handleRefreshJobs = async () => {
        if (!jetimoveisUrl) {
            alert('Por favor, configure a URL do XML nas configurações primeiro.');
            handleOpenSettings();
            return;
        }
        setIsRefreshingJobs(true);
        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(jetimoveisUrl)}`);
            if (!response.ok) {
                throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
            }
            const data = await response.text();
            setRawJobData(data);
            saveData('rawJobData', data);
            
            // Also update last sync time
            localStorage.setItem('lastSyncTime', Date.now().toString());
            
            alert('Dados de revendas atualizados com sucesso!');
        } catch (error) {
            console.error("Falha ao buscar dados da URL:", error);
            alert(`Não foi possível buscar os dados. Verifique a URL e a conexão com a internet.\nErro: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsRefreshingJobs(false);
        }
    };

    
    const [incorporadorasData, setIncorporadorasData] = useState<LogoData>([]);
    const [cidadesData, setCidadesData] = useState<CitySection[]>([]);
    const [rawJobData, setRawJobData] = useState('');
    const [launchesData, setLaunchesData] = useState<LaunchProject[]>([]);
    const [pipelineData, setPipelineData] = useState<PipelineMonth[]>([]);
        const [jetimoveisUrl, setJetimoveisUrl] = useState('');
    const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
    
    const [editingLogo, setEditingLogo] = useState<{ logo: Logo | null; section: 'incorporadoras' | 'cidades'; cityId?: string } | null>(null);
    const [editingEvent, setEditingEvent] = useState<{ event: PipelineEvent | null; month: string; year: string } | null>(null);

    // New state for LaunchSection modal
    const [selectedLaunchProject, setSelectedLaunchProject] = useState<LaunchProject | null>(null);
    const [isLaunchDetailModalOpen, setIsLaunchDetailModalOpen] = useState(false);

    useEffect(() => {
        const loadData = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, initialData: T) => {
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    setter(JSON.parse(stored));
                } else {
                    setter(initialData);
                }
            } catch (error) {
                console.error(`Failed to load ${key} from localStorage`, error);
                setter(initialData);
            }
        };

        loadData('incorporadorasData', setIncorporadorasData, initialIncorporadorasData);
        loadData('cidadesData', setCidadesData, initialCidadesData as CitySection[]);
        loadData('rawJobData', setRawJobData, initialRawJobData);
        loadData('launchesData', setLaunchesData, initialLaunchesData);
        loadData('pipelineData_v2', setPipelineData, initialPipelineData); // Versioned key to reset stale data
                loadData('jetimoveisUrl_v2', setJetimoveisUrl, initialJetimoveisUrl);
        loadData('coverPhotoUrl', setCoverPhotoUrl, initialCoverPhotoUrl);
    }, []);

    const saveData = <T,>(key: string, data: T) => {
        try {
            if (data !== null && data !== undefined) {
                const jsonData = JSON.stringify(data);
                localStorage.setItem(key, jsonData);
            }
        } catch (error) {
            console.error(`Failed to save ${key} to localStorage`, error);
        }
    };
    
    const handleOpenModal = (modalId: string) => setActiveModal(modalId);
    const handleCloseModal = () => setActiveModal(null);
    
    const handleOpenSettings = () => setIsSettingsModalOpen(true);
    const handleCloseSettings = () => setIsSettingsModalOpen(false);

    const handleOpenEditLogoModal = (logo: Logo | null, section: 'incorporadoras' | 'cidades', cityId?: string) => {
      setEditingLogo({ logo, section, cityId });
    };
    const handleCloseEditLogoModal = () => setEditingLogo(null);

    const handleSaveLogo = (logoData: Logo) => {
        if (!editingLogo) return;

        if (editingLogo.section === 'incorporadoras') {
            const existingLogoIndex = incorporadorasData.findIndex(item => 'id' in item && item.id === logoData.id);
            let newData;
            if (existingLogoIndex > -1) {
                newData = [...incorporadorasData];
                newData[existingLogoIndex] = logoData;
            } else {
                newData = [...incorporadorasData, logoData];
            }
            setIncorporadorasData(newData);
            saveData('incorporadorasData', newData);
        } else if (editingLogo.section === 'cidades' && editingLogo.cityId) {
            const newCidadesData = cidadesData.map(city => {
                if (city.id === editingLogo.cityId) {
                    const existingLogoIndex = city.logos.findIndex(l => l.id === logoData.id);
                    if (existingLogoIndex > -1) {
                        const updatedLogos = [...city.logos];
                        updatedLogos[existingLogoIndex] = logoData;
                        return { ...city, logos: updatedLogos };
                    } else {
                        return { ...city, logos: [...city.logos, logoData] };
                    }
                }
                return city;
            });
            setCidadesData(newCidadesData);
            saveData('cidadesData', newCidadesData);
        }
        handleCloseEditLogoModal();
    };

    const handleDeleteLogo = (logoId: string, section: 'incorporadoras' | 'cidades', cityId?: string) => {
        if (section === 'incorporadoras') {
            const newData = incorporadorasData.filter(item => !('id' in item) || item.id !== logoId);
            setIncorporadorasData(newData);
            saveData('incorporadorasData', newData);
        } else if (section === 'cidades' && cityId) {
            const newCidadesData = cidadesData.map(city => {
                if (city.id === cityId) {
                    return { ...city, logos: city.logos.filter(l => l.id !== logoId) };
                }
                return city;
            });
            setCidadesData(newCidadesData);
            saveData('cidadesData', newCidadesData);
        }
    };

     const handleAddCity = (cityName: string) => {
        if (cityName && !cidadesData.some(c => c.city.toLowerCase() === cityName.toLowerCase())) {
            const newCity: CitySection = {
                id: crypto.randomUUID(),
                city: cityName,
                logos: []
            };
            const newCidadesData = [...cidadesData, newCity];
            setCidadesData(newCidadesData);
            saveData('cidadesData', newCidadesData);
        }
    };

    const handleDeleteCity = (cityId: string) => {
        const newCidadesData = cidadesData.filter(city => city.id !== cityId);
        setCidadesData(newCidadesData);
        saveData('cidadesData', newCidadesData);
    };

    const handleUpdateCityName = (cityId: string, newName: string) => {
        if (!newName) return;
        const newCidadesData = cidadesData.map(city => {
            if (city.id === cityId) {
                return { ...city, city: newName };
            }
            return city;
        });
        setCidadesData(newCidadesData);
        saveData('cidadesData', newCidadesData);
    };

    const handleOpenEditEventModal = (event: PipelineEvent | null, month: string, year: string) => {
        setEditingEvent({ event, month, year });
    };

    const handleCloseEditEventModal = () => {
        setEditingEvent(null);
    };

    const handleSavePipelineEvent = (eventData: PipelineEvent) => {
        if (!editingEvent) return;

        const { month, year } = editingEvent;
        
        const updatedPipelineData = pipelineData.map(m => {
            if (m.month === month && m.year === year) {
                const eventExists = m.events.some(e => e.id === eventData.id);
                if (eventExists) {
                    // Update existing event
                    const updatedEvents = m.events.map(e => e.id === eventData.id ? eventData : e);
                    return { ...m, events: updatedEvents };
                } else {
                    // Add new event
                    return { ...m, events: [...m.events, eventData] };
                }
            }
            return m;
        });

        setPipelineData(updatedPipelineData);
        saveData('pipelineData_v2', updatedPipelineData);
        handleCloseEditEventModal();
    };

    const handleDeletePipelineEvent = (eventId: string, month: string, year: string) => {
        const updatedPipelineData = pipelineData.map(m => {
            if (m.month === month && m.year === year) {
                const updatedEvents = m.events.filter(e => e.id !== eventId);
                return { ...m, events: updatedEvents };
            }
            return m;
        });

        setPipelineData(updatedPipelineData);
        saveData('pipelineData_v2', updatedPipelineData);
    };

    const handleDeleteMonthFromPipeline = (month: string, year: string) => {
        const updatedPipelineData = pipelineData.filter(m => !(m.month === month && m.year === year));
        setPipelineData(updatedPipelineData);
        saveData('pipelineData_v2', updatedPipelineData);
    };

    const handleAddNextMonthToPipeline = () => {
        setPipelineData(prevData => {
            if (prevData.length === 0) {
                const now = new Date();
                const newMonth: PipelineMonth = {
                    month: now.toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + now.toLocaleString('pt-BR', { month: 'long' }).slice(1),
                    year: now.getFullYear().toString(),
                    events: []
                };
                const newData = [newMonth];
                saveData('pipelineData_v2', newData);
                return newData;
            }

            const lastMonthEntry = prevData[prevData.length - 1];
            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const lastMonthIndex = months.findIndex(m => m.toLowerCase() === lastMonthEntry.month.toLowerCase());
            
            let nextMonthIndex = lastMonthIndex + 1;
            let nextYear = parseInt(lastMonthEntry.year, 10);

            if (nextMonthIndex > 11) {
                nextMonthIndex = 0;
                nextYear += 1;
            }

            const nextMonthName = months[nextMonthIndex];
            
            const newMonth: PipelineMonth = {
                month: nextMonthName,
                year: nextYear.toString(),
                events: []
            };

            const newData = [...prevData, newMonth];
            saveData('pipelineData_v2', newData);
            return newData;
        });
    };

    const handleOpenLaunchDetailModal = (project: LaunchProject) => {
        setSelectedLaunchProject(project);
        setIsLaunchDetailModalOpen(true);
    };

    const handleCloseLaunchDetailModal = () => {
        setIsLaunchDetailModalOpen(false);
        setSelectedLaunchProject(null);
    };

    

    const parsedJobs = useMemo((): Job[] => {
        const data = rawJobData.trim();
        if (!data) return [];
        
        let parsedJobsResult: Job[] = [];
        
        // JSON Parser for Google Apps Script
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
                        job,
                        jt,
                        property,
                        agents: [],
                        raw,
                        locationDetails,
                        area: item.area || item.area_privativa,
                        areaTotal: item.area_total,
                        quartos: item.quartos,
                        suites: item.suites,
                        bathrooms: item.banheiros,
                        parking: item.vagas,
                        price,
                        condominio: item.condominio,
                        iptu: item.iptu,
                        description: item.descricao ? String(item.descricao) : undefined,
                        photos,
                        features: item.features,
                        operacao: item.operacao ? String(item.operacao) : undefined,
                        tipo: item.tipo ? String(item.tipo) : undefined,
                        url: item.url ? String(item.url) : ''
                    };
                });
            } catch (e) {
                console.error("Error processing JSON job data:", e);
            }
        }
        
        // XML Parser for JetImoveis VrSync format
        if (data.startsWith('<') && parsedJobsResult.length === 0) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const parserError = xmlDoc.getElementsByTagName("parsererror");
                if (parserError.length) {
                  console.error("XML parsing error:", parserError[0].textContent);
                  // We'll fall through to the text parser if XML fails
                } else {
                    // Find imovel tags case-insensitively
                    let imoveis = Array.from(xmlDoc.getElementsByTagName('Imovel'));
                    if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('imovel'));
                    if (imoveis.length === 0) imoveis = Array.from(xmlDoc.getElementsByTagName('IMOVEL'));
                    
                    parsedJobsResult = imoveis.map((imovel, index) => {
                        const getTagContent = (tagName: string) => {
                            let tag = imovel.getElementsByTagName(tagName)[0];
                            if (!tag) tag = imovel.getElementsByTagName(tagName.toLowerCase())[0];
                            if (!tag) tag = imovel.getElementsByTagName(tagName.toUpperCase())[0];
                            return tag?.textContent?.trim() || '';
                        };
                        
                        let jt = getTagContent('CodigoImovel') || getTagContent('codigo') || getTagContent('referencia') || 'N/A';
                        
                        let tipo = getTagContent('TipoImovel') || getTagContent('tipo');
                        let subtipo = getTagContent('SubTipoImovel') || getTagContent('subtipo');
                        let property = getTagContent('TituloImovel') || getTagContent('titulo') || (tipo ? `${tipo}${subtipo ? ' - ' + subtipo : ''}` : 'Propriedade não informada');
                        
                        let bairro = getTagContent('Bairro') || getTagContent('bairro');
                        let cidade = getTagContent('Cidade') || getTagContent('cidade');
                        let uf = getTagContent('UF') || getTagContent('uf');
                        
                        if (bairro) property += ' - ' + bairro;
                        
                        let agents = (getTagContent('Corretor') || '').split('/').map(a => a.trim()).filter(Boolean);
                        
                        const job = `JOB_XML_${index}`;
                        const raw = `${jt} (${property} ${agents.length > 0 ? '- ' + agents.join(' / ') : ''})`.trim();
                        
                        // New fields for the modal
                        let locationDetails = [bairro, cidade, uf].filter(Boolean).join(', ');
                        
                        let area = getTagContent('AreaUtil') || getTagContent('areautil') || getTagContent('AreaPrivativa');
                        let areaTotal = getTagContent('AreaTotal') || getTagContent('areatotal');
                        let quartos = getTagContent('QtdDormitorios') || getTagContent('quartos');
                        let suites = getTagContent('QtdSuites') || getTagContent('suites');
                        let salas = getTagContent('QtdSalas') || getTagContent('salas');
                        let bathrooms = getTagContent('QtdBanheiros') || getTagContent('banheiros');
                        let parking = getTagContent('QtdVagas') || getTagContent('vagas');
                        
                        let price = getTagContent('PrecoVenda') || getTagContent('precovenda');
                        if (price && !price.startsWith('R$')) price = 'R$ ' + Number(price).toLocaleString('pt-BR');
                        
                        let condominio = getTagContent('ValorCondominio') || getTagContent('valorcondominio');
                        let iptu = getTagContent('ValorIPTU') || getTagContent('valoriptu');
                        
                        let description = getTagContent('Observacao') || getTagContent('descricao') || getTagContent('Descricao');
                        
                        let photos: string[] = [];
                        let fotosNode = imovel.getElementsByTagName('Fotos')[0] || imovel.getElementsByTagName('fotos')[0];
                        if (fotosNode) {
                            let fotoNodes = Array.from(fotosNode.getElementsByTagName('Foto'));
                            if(fotoNodes.length === 0) fotoNodes = Array.from(fotosNode.getElementsByTagName('foto'));
                            photos = fotoNodes.map(f => {
                                let urlNode = f.getElementsByTagName('URLArquivo')[0] || f.getElementsByTagName('url')[0] || f.getElementsByTagName('URL')[0];
                                return urlNode?.textContent?.trim();
                            }).filter((u): u is string => Boolean(u));
                        }
                        
                        // Parse JetImoveis URL if available
                        let url = getTagContent('URLImovel') || getTagContent('link');
                        
                        return {
                            id: `${job}-${jt}-${Math.random()}`,
                            job,
                            jt,
                            property,
                            agents,
                            raw,
                            locationDetails,
                            area,
                            areaTotal,
                            quartos,
                            suites,
                            salas,
                            bathrooms,
                            parking,
                            price,
                            condominio,
                            iptu,
                            description,
                            photos,
                            url
                        };
                    });
                }
            } catch (e) {
                console.error("Error processing XML job data:", e);
            }
        }
        
        if (parsedJobsResult.length > 0) {
            return parsedJobsResult;
        }

        // Original Text Parser
        return data.split('\n').map(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return null;
            
            const jobMatch = cleanLine.match(/^(JOB|TRABALHO|EMPREGO)(\d*)\s*/i);
            const jtMatch = cleanLine.match(/(JT\d+|GY\d+|GT\d+|JT\?|JT\s\?)/i);
            const contentMatch = cleanLine.match(/\((.*?)\)/);
            
            let itemJob = '';
            if (jobMatch) {
                itemJob = `JOB${jobMatch[2]}`;
            } else {
                itemJob = `JOB_MISSING_${Math.random().toString(36).substring(2, 9)}`;
            }
            
            const jt = jtMatch ? jtMatch[1].toUpperCase() : 'N/A';
            const content = contentMatch ? contentMatch[1] : '';
            
            let property = '';
            let agents: string[] = [];
            
            if (content) {
                const parts = content.split(' - ');
                property = parts[0] || '';
                if (parts.length > 1) {
                    agents = parts.slice(1).join(' - ').split('/').map(a => a.trim());
                }
            } else {
                property = cleanLine;
            }

            return {
                id: `${itemJob}-${jt}-${Math.random()}`,
                job: itemJob,
                jt,
                property,
                agents,
                raw: cleanLine
            };
        }).filter((item): item is Job => item !== null && !!item.job && true);
    }, [rawJobData]);

    const buttonClass = "block w-full text-center bg-zinc-900 hover:bg-zinc-800 text-white p-3 rounded-xl text-lg font-medium shadow-lg shadow-zinc-900/10 transition-all transform hover:scale-[1.01] border border-zinc-800";

    return (
        <div className="p-4 md:p-8 font-sans min-h-screen">
            <div className="max-w-7xl mx-auto relative">
                <button
                  onClick={handleOpenSettings}
                  className="absolute -top-2 -left-2 sm:top-0 sm:left-0 z-20 p-3 bg-white/30 backdrop-blur-lg rounded-full shadow-md border border-white/40 text-zinc-600 hover:text-zinc-900 hover:bg-white/50 transition-all transform hover:scale-110"
                  aria-label="Abrir configurações"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </button>
                <button
                  onClick={() => window.print()}
                  className="print:hidden absolute -top-2 right-2 sm:top-0 sm:right-0 z-20 p-3 bg-white/30 backdrop-blur-lg rounded-full shadow-md border border-white/40 text-zinc-600 hover:text-zinc-900 hover:bg-white/50 transition-all transform hover:scale-110"
                  aria-label="Imprimir Relatório"
                  title="Imprimir Relatório"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0v-2.94a2.25 2.25 0 0 1 2.25-2.25h6a2.25 2.25 0 0 1 2.25 2.25v2.94ZM15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <div className="print:hidden">
                    <Header coverPhotoUrl={coverPhotoUrl} />
                    <div className="px-4 md:px-8 mt-2 mb-8 max-w-3xl mx-auto print:hidden">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone group-focus-within:text-forest transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Busca global em todas as seções..."
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                                className="w-full py-4 pl-12 pr-4 bg-white/80 backdrop-blur-md border border-sand rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent text-lg text-ink placeholder-stone transition-all"
                            />
                        </div>
                    </div>
                    <SalesLinksSection />
                </div>
                <div className="print:hidden">
                    <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} globalSearch={globalSearch} />
                </div>
                
                <div className="print:hidden">
                    <LogoSection 
                        title="Acesso Rápido - Incorporadoras e Construtoras"
                        data={incorporadorasData}
                        onLogoClick={handleOpenModal}
                        searchPlaceholder="Buscar por incorporadora ou construtora..."
                        globalSearch={globalSearch}
                    />
                    <LogoSection 
                        title="Acesso Rápido - Cidades"
                        data={cidadesData}
                        onLogoClick={handleOpenModal}
                        isCitySection={true}
                        searchPlaceholder="Buscar por empreendimento ou cidade..."
                        globalSearch={globalSearch}
                    />
                </div>
                <div className="print:hidden">
                    <LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} globalSearch={globalSearch} />
                </div>
                <div className="print:hidden">
                    <PipelineCalendar data={pipelineData} />
                    <CertidoesSection />
                </div>
                <PrintReport jobs={parsedJobs} launches={launchesData} />
            </div>

            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={handleCloseSettings}
                incorporadorasData={incorporadorasData}
                cidadesData={cidadesData}
                                launchesData={launchesData}
                pipelineData={pipelineData}
                rawJobData={rawJobData}
                jetimoveisUrl={jetimoveisUrl}
                coverPhotoUrl={coverPhotoUrl}
                                onSaveLaunches={data => { setLaunchesData(data); saveData('launchesData', data); }}
                onSaveRawJobs={data => { setRawJobData(data); saveData('rawJobData', data); }}
                onSaveJetimoveisUrl={url => { setJetimoveisUrl(url); saveData('jetimoveisUrl_v2', url); }}
                onSaveCoverPhoto={url => { setCoverPhotoUrl(url); saveData('coverPhotoUrl', url); }}
                onEditLogo={handleOpenEditLogoModal}
                onDeleteLogo={handleDeleteLogo}
                onAddCity={handleAddCity}
                onDeleteCity={handleDeleteCity}
                onUpdateCityName={handleUpdateCityName}
                onEditPipelineEvent={handleOpenEditEventModal}
                onDeletePipelineEvent={handleDeletePipelineEvent}
                onAddNextMonthToPipeline={handleAddNextMonthToPipeline}
                onDeleteMonthFromPipeline={handleDeleteMonthFromPipeline} 
            />

            {editingLogo && (
                <EditLogoModal 
                    isOpen={!!editingLogo}
                    onClose={handleCloseEditLogoModal}
                    logo={editingLogo.logo}
                    onSave={handleSaveLogo}
                />
            )}

            {editingEvent && (
                <EditPipelineEventModal
                    isOpen={!!editingEvent}
                    onClose={handleCloseEditEventModal}
                    event={editingEvent.event}
                    onSave={handleSavePipelineEvent}
                />
            )}

            <Modal 
                isOpen={activeModal === 'opus-modal'} 
                onClose={handleCloseModal}
                title="Drives Opus"
            >
                <div className="space-y-4">
                    <a href="https://beacons.ai/opuslancamento" target="_blank" rel="noopener noreferrer" className={buttonClass}>
                        LANÇAMENTO
                    </a>
                    <a href="https://beacons.ai/marcorelioopus" target="_blank" rel="noopener noreferrer" className={buttonClass}>
                        OPUS MARCO AURELIO
                    </a>
                    <a href="https://beacons.ai/opuspremium" target="_blank" rel="noopener noreferrer" className={buttonClass}>
                        OPUS PREMIUM LEANDRO
                    </a>
                    <a href="https://beacons.ai/denisbranco" target="_blank" rel="noopener noreferrer" className={buttonClass}>
                        OPUS YBITI DENIS
                    </a>
                </div>
            </Modal>

             <Modal 
                isOpen={activeModal === 'ggc-modal'} 
                onClose={handleCloseModal}
                title="Goiania Golfe Clube"
            >
                <div className="space-y-4">
                     <a href="https://goianiagolfe.com.br/#expansao" target="_blank" rel="noopener noreferrer"
                        className={buttonClass}>
                        Site Oficial (Expansão)
                    </a>
                    <a href="https://drive.google.com/drive/folders/1Z84Mvehh41UhUJAcScmeau1IowlXavFy" target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass}>
                        Drive de Materiais
                    </a>
                </div>
            </Modal>

            {/* Launch Detail Modal - Reused for OpenSalesSection and LaunchSection */}
            {selectedLaunchProject && (
                <Modal
                    isOpen={isLaunchDetailModalOpen}
                    onClose={handleCloseLaunchDetailModal}
                    title={selectedLaunchProject.name}
                >
                    <div className="space-y-4 text-zinc-700">
                        <p className="text-base font-medium"><strong>Construtora:</strong> {selectedLaunchProject.builder}</p>
                        <p className="text-sm"><strong>Localização:</strong> {selectedLaunchProject.location}</p>
                        <p className="text-sm"><strong>Status:</strong> {selectedLaunchProject.status}</p>
                        <p className="text-sm"><strong>Entrega:</strong> {selectedLaunchProject.delivery}</p>
                        <p className="text-sm"><strong>Tipologias:</strong> {selectedLaunchProject.typologies}</p>
                        <p className="text-sm"><strong>Metragem:</strong> {selectedLaunchProject.size}</p>
                        <p className="text-lg font-bold text-zinc-900"><strong>Preço:</strong> {selectedLaunchProject.price}</p>
                        <p className="text-sm leading-relaxed">{selectedLaunchProject.description}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};
export default App;
