const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const oldStructure = `                </button>
                <Header coverPhotoUrl={coverPhotoUrl} />
                <SalesLinksSection />
                <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />
                
                <LogoSection 
                    title="Acesso Rápido - Incorporadoras e Construtoras"
                    data={incorporadorasData}
                    onLogoClick={handleOpenModal}
                    searchPlaceholder="Buscar por incorporadora ou construtora..."
                />
                <LogoSection 
                    title="Acesso Rápido - Cidades"
                    data={cidadesData}
                    onLogoClick={handleOpenModal}
                    isCitySection={true}
                    searchPlaceholder="Buscar por empreendimento ou cidade..."
                />
                <LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} />
                <PipelineCalendar data={pipelineData} />
                <CertidoesSection />`;

const newStructure = `                </button>
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
                    <SalesLinksSection />
                </div>
                <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />
                
                <div className="print:hidden">
                    <LogoSection 
                        title="Acesso Rápido - Incorporadoras e Construtoras"
                        data={incorporadorasData}
                        onLogoClick={handleOpenModal}
                        searchPlaceholder="Buscar por incorporadora ou construtora..."
                    />
                    <LogoSection 
                        title="Acesso Rápido - Cidades"
                        data={cidadesData}
                        onLogoClick={handleOpenModal}
                        isCitySection={true}
                        searchPlaceholder="Buscar por empreendimento ou cidade..."
                    />
                </div>
                <LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} />
                <div className="print:hidden">
                    <PipelineCalendar data={pipelineData} />
                    <CertidoesSection />
                </div>`;

content = content.replace(oldStructure, newStructure);
fs.writeFileSync('App.tsx', content);
console.log("Patched print layout");
