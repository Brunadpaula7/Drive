const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

// Replace JtJobListItem
const newJtJobListItem = `const JtJobListItem: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => {
    let formattedJt = job.jt.replace(/^JT\\s*/i, '');
    if (formattedJt.toUpperCase().startsWith('GT')) {
        formattedJt = 'GY' + formattedJt.substring(2);
    }
    if (formattedJt.startsWith('GY') && !formattedJt.includes(' ')) {
        formattedJt = \`GY \${formattedJt.substring(2)}\`;
    }
    const isSpecialJob = job.jt.startsWith('GY') || job.jt.startsWith('GT');
    
    const coverPhoto = Array.isArray(job.photos) && job.photos.length > 0 ? job.photos[0] : null;
    
    // Parse price safely
    let displayPrice = '';
    if (job.price) {
        displayPrice = String(job.price);
    }

    return (
        <div 
            className={\`
                group relative flex flex-col h-[320px] w-full rounded-2xl border transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white
                \${isSpecialJob ? 'border-sand hover:border-stone hover:shadow-xl' : 'border-sand hover:border-stone hover:shadow-xl'}
                hover:-translate-y-1
            \`}
            title={job.raw}
            onClick={onClick}
        >
            <div className="w-full h-[180px] bg-bone relative flex-shrink-0 overflow-hidden">
                {coverPhoto ? (
                    <img src={coverPhoto} alt={job.property} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone/40 bg-sand/20">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-ink/90 backdrop-blur-sm text-bone text-xs font-bold px-3 py-1.5 rounded-lg shadow-md tracking-wider">
                    {formattedJt}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-ink leading-tight line-clamp-2 mb-1 group-hover:text-forest transition-colors">
                    {job.property || 'Propriedade não listada'}
                </h3>
                {job.locationDetails && (
                    <p className="text-xs text-stone line-clamp-1 mb-3">{job.locationDetails}</p>
                )}
                
                <div className="mt-auto flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                        {job.quartos && (
                            <span className="text-[10px] font-semibold bg-sand/30 px-2 py-1 rounded text-stone">
                                {job.quartos} {String(job.quartos) === '1' ? 'quarto' : 'quartos'}
                            </span>
                        )}
                        {job.area && (
                            <span className="text-[10px] font-semibold bg-sand/30 px-2 py-1 rounded text-stone">
                                {job.area} m²
                            </span>
                        )}
                    </div>
                    {displayPrice && (
                        <p className="text-sm font-bold text-ink">{displayPrice}</p>
                    )}
                </div>
            </div>
        </div>
    );
};`;

const oldJtJobListItemRegex = /const JtJobListItem[\s\S]*?<\/div>\s*\);\s*};\s*const JOBS_PER_PAGE = 15;/;
content = content.replace(oldJtJobListItemRegex, newJtJobListItem + "\n\nconst JOBS_PER_PAGE = 15;");

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Patched JtJobListItem");
