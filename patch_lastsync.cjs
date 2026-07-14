const fs = require('fs');
let code = fs.readFileSync('components/JobSection.tsx', 'utf8');

// 1. Add state and effect
const stateToAdd = `
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

    useEffect(() => {
        const checkSyncTime = () => {
            const syncTime = localStorage.getItem('lastSyncTime');
            if (syncTime) {
                const date = new Date(parseInt(syncTime, 10));
                setLastSyncTime(date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
            }
        };
        checkSyncTime();
        const interval = setInterval(checkSyncTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);
`;
code = code.replace("const [selectedJob, setSelectedJob] = useState<Job | null>(null);", "const [selectedJob, setSelectedJob] = useState<Job | null>(null);" + stateToAdd);

// 2. Add visual indicator
const headerRegex = /<h3 className="text-2xl font-bold text-zinc-800 flex items-center">[\s\S]*?<span className="ml-2 text-zinc-600 hidden sm:inline">Vinícius Kasbaum<\/span>[\s\S]*?<\/h3>/;

const newHeader = `
                <h3 className="text-2xl font-bold text-zinc-800 flex items-center">
                    Revendas
                    <span className="ml-2 text-zinc-400 font-light hidden sm:inline">|</span> 
                    <span className="ml-2 text-zinc-600 hidden sm:inline">Vinícius Kasbaum</span>
                    {lastSyncTime && (
                        <span className="ml-4 text-xs font-medium text-zinc-500 bg-zinc-100/50 px-2.5 py-1 rounded-md border border-zinc-200/50 backdrop-blur-sm flex items-center gap-1.5" title="Última sincronização dos dados">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {lastSyncTime}
                        </span>
                    )}
                </h3>
`.trim();

code = code.replace(headerRegex, newHeader);

fs.writeFileSync('components/JobSection.tsx', code);
console.log('JobSection.tsx patched for lastSyncTime');
