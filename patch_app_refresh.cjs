const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// We need to add state for isRefreshing and handleRefreshXML
const hookState = `
    const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);

    const handleRefreshJobs = async () => {
        if (!jetimoveisUrl) {
            alert('Por favor, configure a URL do XML nas configurações primeiro.');
            handleOpenSettings();
            return;
        }
        setIsRefreshingJobs(true);
        try {
            const response = await fetch(\`https://api.allorigins.win/raw?url=\${encodeURIComponent(jetimoveisUrl)}\`);
            if (!response.ok) {
                throw new Error(\`Erro de rede: \${response.status} \${response.statusText}\`);
            }
            const data = await response.text();
            setRawJobData(data);
            saveData('rawJobData', data);
            
            // Also update last sync time
            localStorage.setItem('lastSyncTime', Date.now().toString());
            
            alert('Dados de revendas atualizados com sucesso!');
        } catch (error) {
            console.error("Falha ao buscar dados da URL:", error);
            alert(\`Não foi possível buscar os dados. Verifique a URL e a conexão com a internet.\\nErro: \${error instanceof Error ? error.message : String(error)}\`);
        } finally {
            setIsRefreshingJobs(false);
        }
    };
`;

content = content.replace(/const \[isSettingsModalOpen, setIsSettingsModalOpen\] = useState\(false\);/, 'const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);' + hookState);

content = content.replace(/<JobSection jobs=\{parsedJobs\} \/>/, '<JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />');

fs.writeFileSync('App.tsx', content);
console.log("Patched App.tsx");
