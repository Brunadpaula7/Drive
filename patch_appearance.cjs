const fs = require('fs');
let code = fs.readFileSync('components/SettingsModal.tsx', 'utf8');
const search = `                        {activeTab === 'coverPhoto' && ( 
                            <CoverPhotoEditor
                                currentCoverPhotoUrl={localCoverPhotoUrl}
                                onSave={(url) => setLocalCoverPhotoUrl(url)} 
                            />
                        )}`;
const replace = `                        {activeTab === 'coverPhoto' && ( 
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
                                            className={\`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 \${isHighContrast ? 'bg-forest' : 'bg-stone/30'}\`}
                                        >
                                            <div className={\`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 \${isHighContrast ? 'translate-x-6' : ''}\`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}`;
if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('components/SettingsModal.tsx', code);
    console.log("Patched Appearance");
} else {
    console.log("Not found");
}
