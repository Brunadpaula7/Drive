const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const oldStructure = `                <Header coverPhotoUrl={coverPhotoUrl} />
                
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
                
                
                <CertidoesSection />
                <SalesLinksSection />
                <LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} />
                <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />
                <PipelineCalendar data={pipelineData} />
            </div>`;

const newStructure = `                <Header coverPhotoUrl={coverPhotoUrl} />
                
                <SalesLinksSection />
                
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
                <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />
                <PipelineCalendar data={pipelineData} />
                <CertidoesSection />
            </div>`;

content = content.replace(oldStructure, newStructure);
fs.writeFileSync('App.tsx', content);
console.log("Patched order");
