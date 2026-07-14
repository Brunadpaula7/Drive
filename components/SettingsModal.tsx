import React, { useState, useEffect } from 'react';
import type { Logo, CitySection, InfoBoardData, LaunchProject, PipelineMonth, LogoData, PipelineEvent } from '../types';
import { InputField } from './EditLogoModal'; // Reusing InputField from EditLogoModal for consistency

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    incorporadorasData: LogoData;
    cidadesData: CitySection[];
    launchesData: LaunchProject[];
    pipelineData: PipelineMonth[];
    rawJobData: string;
    jetimoveisUrl: string;
    coverPhotoUrl: string; 
    onSaveLaunches: (data: LaunchProject[]) => void;
    onSaveRawJobs: (data: string) => void;
    onSaveJetimoveisUrl: (url: string) => void;
    onSaveCoverPhoto: (url: string) => void; 
    onEditLogo: (logo: Logo | null, section: 'incorporadoras' | 'cidades', cityId?: string) => void;
    onDeleteLogo: (logoId: string, section: 'incorporadoras' | 'cidades', cityId?: string) => void;
    onAddCity: (cityName: string) => void;
    onDeleteCity: (cityId: string) => void;
    onUpdateCityName: (cityId: string, newName: string) => void;
    onEditPipelineEvent: (event: PipelineEvent | null, month: string, year: string) => void;
    onDeletePipelineEvent: (eventId: string, month: string, year: string) => void;
    onAddNextMonthToPipeline: () => void;
    onDeleteMonthFromPipeline: (month: string, year: string) => void;
    isHighContrast?: boolean;
    onToggleHighContrast?: (value: boolean) => void;
}

type Tab = 'incorporadoras' | 'cidades' | 'lancamentos' | 'pipeline' | 'jobs' | 'coverPhoto' | 'appearance'; 

const TabButton: React.FC<{ activeTab: Tab, tabName: Tab, onClick: (tab: Tab) => void, children: React.ReactNode }> = ({ activeTab, tabName, onClick, children }) => (
    <button
        onClick={() => onClick(tabName)}
        className={`flex-shrink-0 md:w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === tabName ? 'bg-sand text-ink' : 'text-stone hover:bg-sand'}`}
    >
        {children}
    </button>
);

const TextAreaInput: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, helpText?: string, rows?: number }> = ({ label, value, onChange, helpText, rows = 8 }) => (
    <div>
        <label className="block text-sm font-bold text-stone mb-2">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full p-3 rounded-lg bg-bone/60 border border-stone/70 focus:outline-none focus:ring-2 focus:ring-stone/50 transition-all text-sm font-mono"
        />
        {helpText && <p className="text-xs text-stone mt-2">{helpText}</p>}
    </div>
);

// Helper function to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose, incorporadorasData, cidadesData, launchesData, pipelineData, rawJobData, jetimoveisUrl, coverPhotoUrl,
    onSaveLaunches, onSaveRawJobs, onSaveJetimoveisUrl, onSaveCoverPhoto, onEditLogo, onDeleteLogo,
    onAddCity, onDeleteCity, onUpdateCityName, onEditPipelineEvent, onDeletePipelineEvent, onAddNextMonthToPipeline, onDeleteMonthFromPipeline, isHighContrast, onToggleHighContrast
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('incorporadoras');
    
        const [localLaunches, setLocalLaunches] = useState('');
    const [localJobs, setLocalJobs] = useState('');
    const [localUrl, setLocalUrl] = useState('');
    const [localCoverPhotoUrl, setLocalCoverPhotoUrl] = useState(''); 
    const [isFetching, setIsFetching] = useState(false);
    const [newCityName, setNewCityName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLocalLaunches(JSON.stringify(launchesData, null, 2));
            setLocalJobs(rawJobData);
            setLocalUrl(jetimoveisUrl);
            setLocalCoverPhotoUrl(coverPhotoUrl); 
        }
    }, [isOpen, launchesData, rawJobData, jetimoveisUrl, coverPhotoUrl]);

    const handleFetchData = async () => {
        if (!localUrl) {
            alert('Por favor, insira uma URL.');
            return;
        }
        setIsFetching(true);
        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(localUrl)}`);
            if (!response.ok) {
                throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
            }
            const data = await response.text();
            setLocalJobs(data);
            alert('Dados atualizados com sucesso a partir da URL!');
        } catch (error) {
            console.error("Falha ao buscar dados da URL:", error);
            alert(`Não foi possível buscar os dados. Verifique a URL e a conexão com a internet.\nErro: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsFetching(false);
        }
    };

    const handleAddNewCity = () => {
        if(newCityName.trim()) {
            onAddCity(newCityName.trim());
            setNewCityName('');
        }
    };

    const handleSave = () => {
        try {
            
            onSaveLaunches(JSON.parse(localLaunches));
            onSaveRawJobs(localJobs);
            onSaveJetimoveisUrl(localUrl);
            onSaveCoverPhoto(localCoverPhotoUrl); 
            onClose();
        } catch (error) {
            alert('Erro ao salvar os dados. Verifique se o formato JSON está correto.');
            console.error(error);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-bone rounded-3xl shadow-2xl w-11/12 h-[90vh] max-w-6xl m-4 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-6 border-b border-sand flex-shrink-0">
                    <h2 className="text-xl font-bold text-ink">Configurações do Sistema</h2>
                    <button onClick={onClose} className="text-sand hover:text-ink text-3xl font-bold">&times;</button>
                </header>
                
                <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                    <aside className="w-full md:w-56 flex-shrink-0 p-4 border-b md:border-b-0 md:border-r border-sand bg-bone">
                        <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-hidden -mx-4 px-4 pb-2 md:pb-0">
                            <TabButton activeTab={activeTab} tabName="incorporadoras" onClick={setActiveTab}>Incorporadoras</TabButton>
                            <TabButton activeTab={activeTab} tabName="cidades" onClick={setActiveTab}>Cidades</TabButton>
                                                        <TabButton activeTab={activeTab} tabName="lancamentos" onClick={setActiveTab}>Lançamentos</TabButton>
                            <TabButton activeTab={activeTab} tabName="pipeline" onClick={setActiveTab}>Pipeline</TabButton>
                            <TabButton activeTab={activeTab} tabName="jobs" onClick={setActiveTab}>Revendas (Drive)</TabButton>
                            <TabButton activeTab={activeTab} tabName="coverPhoto" onClick={setActiveTab}>Materiais & Drive</TabButton>
                            <TabButton activeTab={activeTab} tabName="appearance" onClick={setActiveTab}>Acessibilidade</TabButton>
                        </div>
                    </aside>

                    <main className="flex-grow p-6 overflow-y-auto">
                        {activeTab === 'incorporadoras' && (
                           <LogoEditor 
                                title="Gerenciar Incorporadoras e Construtoras"
                                data={incorporadorasData} 
                                onEdit={(logo) => onEditLogo(logo, 'incorporadoras')} 
                                onDelete={(id) => onDeleteLogo(id, 'incorporadoras')}
                            />
                        )}
                        {activeTab === 'cidades' && (
                            <div className="space-y-8">
                                {cidadesData.map(citySection => (
                                    <CityEditor 
                                        key={citySection.id}
                                        citySection={citySection}
                                        onEditLogo={(logo) => onEditLogo(logo, 'cidades', citySection.id)}
                                        onDeleteLogo={(logoId) => onDeleteLogo(logoId, 'cidades', citySection.id)}
                                        onDeleteCity={() => onDeleteCity(citySection.id)}
                                        onUpdateCityName={(newName) => onUpdateCityName(citySection.id, newName)}
                                    />
                                ))}
                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="text-lg font-bold text-ink mb-4">Adicionar Nova Cidade</h3>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newCityName}
                                            onChange={(e) => setNewCityName(e.target.value)}
                                            placeholder="Nome da nova cidade"
                                            className="flex-grow p-3 rounded-lg bg-bone/60 border border-stone/70 focus:outline-none focus:ring-2 focus:ring-stone/50 transition-all text-sm"
                                        />
                                        <button onClick={handleAddNewCity} className="px-4 py-2 text-sm font-semibold bg-forest text-bone rounded-lg hover:bg-forest transition-colors">
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                         
                        {activeTab === 'lancamentos' && (
                             <TextAreaInput label="Dados dos Lançamentos (JSON)" value={localLaunches} onChange={(e) => setLocalLaunches(e.target.value)} helpText="Edite os dados no formato JSON. Cuidado para não quebrar a estrutura." rows={20} />
                        )}
                        {activeTab === 'pipeline' && (
                            <PipelineEditor
                                title="Gerenciar Pipeline de Lançamentos"
                                data={pipelineData}
                                onEdit={onEditPipelineEvent}
                                onDelete={onDeletePipelineEvent}
                                onAddNextMonth={onAddNextMonthToPipeline}
                                onDeleteMonth={onDeleteMonthFromPipeline} // Pass new prop
                            />
                        )}
                        {activeTab === 'jobs' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-ink">Gerenciar Revendas</h3>
                                <div>
                                    <InputField
                                        label="URL do XML de Integração"
                                        value={localUrl}
                                        onChange={(e) => setLocalUrl(e.target.value)}
                                        placeholder="https://.../VrSync.xml"
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={handleFetchData}
                                            disabled={isFetching}
                                            className="px-4 py-2 text-xs font-semibold bg-forest text-bone rounded-lg hover:bg-ink transition-colors disabled:bg-sand"
                                        >
                                            {isFetching ? 'Atualizando...' : 'Atualizar Dados via URL'}
                                        </button>
                                         <button
                                            onClick={() => setLocalUrl('')}
                                            className="px-4 py-2 text-xs font-semibold bg-sand text-stone rounded-lg hover:bg-sand transition-colors"
                                        >
                                            Limpar URL
                                        </button>
                                    </div>
                                    <p className="text-xs text-stone mt-2">Cole a URL do XML e clique em 'Atualizar' para carregar os dados. O sistema tentará usar um proxy para evitar erros de CORS.</p>
                                </div>
                                <TextAreaInput label="Dados Brutos (XML/Texto)" value={localJobs} onChange={(e) => setLocalJobs(e.target.value)} helpText="Os dados da URL serão carregados aqui. Você pode editá-los antes de salvar." rows={15} />
                            </div>
                        )}
                        {activeTab === 'coverPhoto' && ( 
                            <CoverPhotoEditor
                                currentCoverPhotoUrl={localCoverPhotoUrl}
                                onSave={(url) => setLocalCoverPhotoUrl(url)} 
                            />
                        )}
                        {activeTab === 'appearance' && (
                            <div className="flex flex-col h-full space-y-6">
                                <h3 className="text-lg font-bold text-ink">Acessibilidade</h3>
                                <div className="bg-sand/30 p-5 rounded-xl border border-sand">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-base font-semibold text-ink">Alto Contraste</h4>
                                            <p className="text-sm text-stone mt-1">Aumenta o contraste das cores para facilitar a leitura de documentos e informações.</p>
                                        </div>
                                        <button 
                                            onClick={() => onToggleHighContrast?.(!isHighContrast)}
                                            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isHighContrast ? 'bg-forest' : 'bg-stone/30'}`}
                                        >
                                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isHighContrast ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                <footer className="p-4 border-t border-sand bg-bone flex justify-end space-x-4 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold bg-bone border border-stone text-stone hover:bg-bone transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-semibold bg-forest text-bone hover:bg-ink transition-colors">Salvar Alterações</button>
                </footer>
            </div>
        </div>
    );
};

interface LogoEditorProps {
    title: string;
    data: LogoData;
    onEdit: (logo: Logo | null) => void;
    onDelete: (id: string) => void;
}

const LogoEditor: React.FC<LogoEditorProps> = ({ title, data, onEdit, onDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <button onClick={() => onEdit(null)} className="px-4 py-2 text-xs font-semibold bg-forest text-bone rounded-lg hover:bg-forest transition-colors">
                    Adicionar Novo
                </button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-bone">
                {(data as Logo[]).map((logo) => (
                    <div key={logo.id} className="flex items-center p-3 border-b last:border-b-0">
                        <img src={logo.imgSrc} alt={logo.name} className="w-10 h-10 rounded-full object-cover mr-4" />
                        <span className="flex-grow text-sm font-medium text-stone">{logo.name}</span>
                        <div className="space-x-2">
                             <button onClick={() => onEdit(logo)} className="text-xs font-semibold text-forest hover:underline">Editar</button>
                             <button onClick={() => window.confirm('Tem certeza?') && onDelete(logo.id)} className="text-xs font-semibold text-red-600 hover:underline">Excluir</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface PipelineEditorProps {
    title: string;
    data: PipelineMonth[];
    onEdit: (event: PipelineEvent | null, month: string, year: string) => void;
    onDelete: (eventId: string, month: string, year: string) => void;
    onAddNextMonth: () => void;
    onDeleteMonth: (month: string, year: string) => void; // New prop
}

const PipelineEditor: React.FC<PipelineEditorProps> = ({ title, data, onEdit, onDelete, onAddNextMonth, onDeleteMonth }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <button onClick={onAddNextMonth} className="px-4 py-2 text-xs font-semibold bg-green-600 text-bone rounded-lg hover:bg-green-700 transition-colors">
                    Adicionar Próximo Mês
                </button>
            </div>
            <div className="space-y-6">
                {data.map(month => (
                    <div key={`${month.month}-${month.year}`} className="border rounded-lg p-4 bg-bone">
                        <div className="flex justify-between items-center mb-3"> {/* Changed items-end to items-center for better alignment with new button */}
                            <h4 className="font-semibold text-stone">{month.month} {month.year}</h4>
                            <div className="space-x-2"> {/* Container for month-specific actions */}
                                <button onClick={() => onEdit(null, month.month, month.year)} className="px-4 py-2 text-xs font-semibold bg-forest text-bone rounded-lg hover:bg-forest transition-colors">
                                    Adicionar Evento
                                </button>
                                <button 
                                    onClick={() => window.confirm(`Tem certeza que deseja excluir o mês de ${month.month} de ${month.year} e todos os seus eventos?`) && onDeleteMonth(month.month, month.year)} 
                                    className="px-4 py-2 text-xs font-semibold bg-red-600 text-bone rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Excluir Mês
                                </button>
                            </div>
                        </div>
                        {month.events.length > 0 ? (
                            <div className="space-y-2">
                                {month.events.map(event => (
                                    <div key={event.id} className="flex items-center p-2 border-b last:border-b-0">
                                        <span className="font-bold w-16 text-sm">{event.day}</span>
                                        <span className="flex-grow text-sm text-stone">{event.name}</span>
                                        <div className="space-x-2">
                                            <button onClick={() => onEdit(event, month.month, month.year)} className="text-xs font-semibold text-forest hover:underline">Editar</button>
                                            <button onClick={() => window.confirm(`Excluir "${event.name}"?`) && onDelete(event.id, month.month, month.year)} className="text-xs font-semibold text-red-600 hover:underline">Excluir</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full py-4">
                                <span className="text-xs text-stone italic">Nenhum evento.</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

interface CityEditorProps {
    citySection: CitySection;
    onEditLogo: (logo: Logo | null) => void;
    onDeleteLogo: (id: string) => void;
    onDeleteCity: () => void;
    onUpdateCityName: (newName: string) => void;
}

const CityEditor: React.FC<CityEditorProps> = ({ citySection, onEditLogo, onDeleteLogo, onDeleteCity, onUpdateCityName }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(citySection.city);

    const handleNameSave = () => {
        onUpdateCityName(editedName);
        setIsEditingName(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4 bg-sand p-2 rounded-t-lg border-b">
                 {isEditingName ? (
                    <div className="flex items-center flex-grow">
                        <input 
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="p-1 rounded bg-bone border border-stone text-lg font-bold text-ink"
                            autoFocus
                        />
                        <button onClick={handleNameSave} className="ml-2 text-xs font-semibold text-green-600 hover:underline">Salvar</button>
                        <button onClick={() => setIsEditingName(false)} className="ml-2 text-xs font-semibold text-stone hover:underline">Cancelar</button>
                    </div>
                ) : (
                    <h3 className="text-lg font-bold text-ink">{citySection.city}</h3>
                )}
                <div className="space-x-2">
                    <button onClick={() => setIsEditingName(true)} className="text-xs font-semibold text-forest hover:underline">Editar Nome</button>
                    <button onClick={() => window.confirm(`Tem certeza que deseja excluir a cidade "${citySection.city}" e todos os seus empreendimentos?`) && onDeleteCity()} className="text-xs font-semibold text-red-600 hover:underline">Excluir Cidade</button>
                </div>
            </div>
             <LogoEditor 
                title={`Empreendimentos - ${citySection.city}`}
                data={citySection.logos}
                onEdit={onEditLogo}
                onDelete={onDeleteLogo}
            />
        </div>
    );
};

interface CoverPhotoEditorProps {
    currentCoverPhotoUrl: string;
    onSave: (url: string) => void;
}

const CoverPhotoEditor: React.FC<CoverPhotoEditorProps> = ({ currentCoverPhotoUrl, onSave }) => {
    const [localCoverPhotoUrl, setLocalCoverPhotoUrl] = useState(currentCoverPhotoUrl);

    useEffect(() => {
        setLocalCoverPhotoUrl(currentCoverPhotoUrl);
    }, [currentCoverPhotoUrl]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await blobToBase64(file);
                setLocalCoverPhotoUrl(base64);
            } catch (error) {
                console.error("Error converting file to base64:", error);
                alert("Falha ao carregar a imagem.");
            }
        }
    };

    const handleSaveLocal = () => {
        onSave(localCoverPhotoUrl);
        alert("Foto de capa atualizada localmente. Clique em 'Salvar Alterações' para persistir.");
    };

    const handleRemovePhoto = () => {
        if (window.confirm('Tem certeza que deseja remover a foto de capa?')) {
            setLocalCoverPhotoUrl('');
            onSave(''); // Immediately update parent state for removal
            alert("Foto de capa removida. Clique em 'Salvar Alterações' para persistir.");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-ink">Gerenciar Materiais & Drive</h3>
            
            <div className="flex flex-col items-center p-4 bg-sand rounded-lg border border-sand">
                <label className="block text-sm font-bold text-stone mb-2">Pré-visualização</label>
                <div className="w-48 h-24 rounded-lg flex items-center justify-center bg-sand overflow-hidden mb-4 shadow-inner">
                    {localCoverPhotoUrl ? (
                        <img 
                            src={localCoverPhotoUrl} 
                            alt="Pré-visualização de Materiais & Drive" 
                            className="w-full h-full object-contain" 
                        />
                    ) : (
                        <span className="text-stone text-sm italic">Sem foto</span>
                    )}
                </div>
                
                <InputField 
                    label="URL da Imagem de Materiais & Drive" 
                    value={localCoverPhotoUrl} 
                    onChange={(e) => setLocalCoverPhotoUrl(e.target.value)} 
                    placeholder="https://..." 
                />
                <p className="text-xs text-stone my-2 block text-center">OU</p>
                
                <div className="w-full">
                    <label className="block text-sm font-bold text-stone mb-2" htmlFor="coverPhotoUpload">Carregar arquivo de imagem</label>
                    <input 
                        type="file" 
                        id="coverPhotoUpload"
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="text-sm w-full p-2 rounded-lg bg-bone/60 border border-stone/70 focus:outline-none focus:ring-2 focus:ring-stone/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sand file:text-forest hover:file:bg-emerald-100" 
                    />
                    <p className="text-xs text-stone mt-1">Imagens grandes serão convertidas para Base64.</p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 w-full border-t border-sand mt-6">
                    {localCoverPhotoUrl && (
                        <button onClick={handleRemovePhoto} className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Remover Foto</button>
                    )}
                    <button onClick={handleSaveLocal} className="px-5 py-2 rounded-lg text-sm font-semibold bg-forest text-bone hover:bg-ink transition-colors">Aplicar Foto</button>
                </div>
            </div>
        </div>
    );
};