const fs = require('fs');

// 1. App.tsx
let app = fs.readFileSync('App.tsx', 'utf8');

// Add globalSearch state
app = app.replace(
    /const \[isRefreshingJobs, setIsRefreshingJobs\] = useState\(false\);/,
    "const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);\n    const [globalSearch, setGlobalSearch] = useState('');"
);

// Add Search component after Header
app = app.replace(
    /<Header coverPhotoUrl=\{coverPhotoUrl\} \/>/,
    `<Header coverPhotoUrl={coverPhotoUrl} />
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
                    </div>`
);

// Pass globalSearch down
app = app.replace(
    /<JobSection jobs=\{parsedJobs\} onRefresh=\{handleRefreshJobs\} isRefreshing=\{isRefreshingJobs\} \/>/,
    '<JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} globalSearch={globalSearch} />'
);

app = app.replace(
    /data=\{incorporadorasData\}\n(\s*)onLogoClick=\{handleOpenModal\}\n(\s*)searchPlaceholder="Buscar por incorporadora ou construtora..."/,
    'data={incorporadorasData}\n$1onLogoClick={handleOpenModal}\n$2searchPlaceholder="Buscar por incorporadora ou construtora..."\n$2globalSearch={globalSearch}'
);

app = app.replace(
    /isCitySection=\{true\}\n(\s*)searchPlaceholder="Buscar por empreendimento ou cidade..."/,
    'isCitySection={true}\n$1searchPlaceholder="Buscar por empreendimento ou cidade..."\n$1globalSearch={globalSearch}'
);

app = app.replace(
    /<LaunchSection data=\{launchesData\} onProjectClick=\{handleOpenLaunchDetailModal\} \/>/,
    '<LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} globalSearch={globalSearch} />'
);

fs.writeFileSync('App.tsx', app);


// 2. JobSection.tsx
let jobSection = fs.readFileSync('components/JobSection.tsx', 'utf8');

jobSection = jobSection.replace(
    /isRefreshing\?: boolean;/,
    "isRefreshing?: boolean;\n    globalSearch?: string;"
);

jobSection = jobSection.replace(
    /export const JobSection: React\.FC<JobSectionProps> = \(\{ jobs, onRefresh, isRefreshing \}\) => \{/,
    "export const JobSection: React.FC<JobSectionProps> = ({ jobs, onRefresh, isRefreshing, globalSearch }) => {"
);

jobSection = jobSection.replace(
    /const filteredJobs = useMemo\(\(\) => \{\n\s*if \(!query\) return jobs;\n\s*return jobs\.filter\(job => job\.raw\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\)\);\n\s*\}, \[query, jobs\]\);/,
    `const filteredJobs = useMemo(() => {
        let result = jobs;
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            result = result.filter(job => job.raw.toLowerCase().includes(searchLower));
        }
        if (query) {
            const queryLower = query.toLowerCase();
            result = result.filter(job => job.raw.toLowerCase().includes(queryLower));
        }
        return result;
    }, [query, globalSearch, jobs]);`
);

// Reset pagination when globalSearch changes
jobSection = jobSection.replace(
    /useEffect\(\(\) => \{\n\s*setCurrentPage\(1\);\n\s*\}, \[query\]\);/,
    "useEffect(() => {\n        setCurrentPage(1);\n    }, [query, globalSearch]);"
);

fs.writeFileSync('components/JobSection.tsx', jobSection);


// 3. LogoSection.tsx
let logoSection = fs.readFileSync('components/LogoSection.tsx', 'utf8');

logoSection = logoSection.replace(
    /isCitySection\?: boolean;/,
    "isCitySection?: boolean;\n    globalSearch?: string;"
);

logoSection = logoSection.replace(
    /export const LogoSection: React\.FC<LogoSectionProps> = \(\{ title, data, onLogoClick, searchPlaceholder, isCitySection = false \}\) => \{/,
    "export const LogoSection: React.FC<LogoSectionProps> = ({ title, data, onLogoClick, searchPlaceholder, isCitySection = false, globalSearch }) => {"
);

logoSection = logoSection.replace(
    /const filteredData = useMemo\(\(\) => \{\n\s*let items = isCitySection \? data\.cities \|\| \[\] : data\.logos \|\| \[\];\n\s*if \(!query\) return items;\n\s*return items\.filter\(item => \{\n\s*const name = isCitySectionTypeGuard\(item\) \? item\.city : item\.name;\n\s*return name\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\);\n\s*\}\);\n\s*\}, \[data, query, isCitySection\]\);/,
    `const filteredData = useMemo(() => {
        let items = isCitySection ? data.cities || [] : data.logos || [];
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            items = items.filter(item => {
                const name = isCitySectionTypeGuard(item) ? item.city : item.name;
                return name.toLowerCase().includes(searchLower);
            });
        }
        if (query) {
            const queryLower = query.toLowerCase();
            items = items.filter(item => {
                const name = isCitySectionTypeGuard(item) ? item.city : item.name;
                return name.toLowerCase().includes(queryLower);
            });
        }
        return items;
    }, [data, query, globalSearch, isCitySection]);`
);

// Reset pagination when globalSearch changes
logoSection = logoSection.replace(
    /useEffect\(\(\) => \{\n\s*setCurrentPage\(1\);\n\s*\}, \[query\]\);/,
    "useEffect(() => {\n        setCurrentPage(1);\n    }, [query, globalSearch]);"
);

fs.writeFileSync('components/LogoSection.tsx', logoSection);


// 4. LaunchSection.tsx
let launchSection = fs.readFileSync('components/LaunchSection.tsx', 'utf8');

launchSection = launchSection.replace(
    /onProjectClick: \(project: LaunchProject\) => void;/,
    "onProjectClick: (project: LaunchProject) => void;\n    globalSearch?: string;"
);

launchSection = launchSection.replace(
    /export const LaunchSection = forwardRef<HTMLElement, LaunchSectionProps>\(\(\{ data, onProjectClick \}, ref\) => \{/,
    "export const LaunchSection = forwardRef<HTMLElement, LaunchSectionProps>(({ data, onProjectClick, globalSearch }, ref) => {"
);

launchSection = launchSection.replace(
    /const filteredProjects = useMemo\(\(\) => \{\n\s*if \(filterStatus === 'Todos'\) \{\n\s*return data;\n\s*\}\n\s*return data\.filter\(project => project\.status === filterStatus\);\n\s*\}, \[data, filterStatus\]\);/,
    `const filteredProjects = useMemo(() => {
        let result = data;
        if (filterStatus !== 'Todos') {
            result = result.filter(project => project.status === filterStatus);
        }
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            result = result.filter(project => 
                project.name.toLowerCase().includes(searchLower) ||
                project.builder.toLowerCase().includes(searchLower) ||
                project.location.toLowerCase().includes(searchLower) ||
                project.status.toLowerCase().includes(searchLower)
            );
        }
        return result;
    }, [data, filterStatus, globalSearch]);`
);

// Reset pagination when globalSearch changes
launchSection = launchSection.replace(
    /useEffect\(\(\) => \{\n\s*setCurrentPage\(1\);\n\s*\}, \[filterStatus\]\);/,
    "useEffect(() => {\n        setCurrentPage(1);\n    }, [filterStatus, globalSearch]);"
);

fs.writeFileSync('components/LaunchSection.tsx', launchSection);

console.log("Global Search Patched!");
