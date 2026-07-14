const fs = require('fs');
let code = fs.readFileSync('components/PipelineCalendar.tsx', 'utf8');

const search = `                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedData.map((item) => {
                            const hasEvents = item.events.length > 0;
                            return (
                                <div 
                                    key={\`\${item.month}-\${item.year}\`}
                                    className={\`
                                        flex flex-col p-4 rounded-xl border  transition-all duration-300
                                        \${hasEvents 
                                            ? 'bg-bone border-sand shadow-sm' 
                                            : 'bg-bone border-sand opacity-70'}
                                    \`}
                                >
                                    <div className="flex justify-between items-end border-b border-stone/20 pb-2 mb-3">
                                        <span className="text-xs font-bold text-stone tracking-widest uppercase">{item.month}</span>
                                        <span className="text-[10px] font-semibold text-sand">{item.year}</span>
                                    </div>

                                    <div className="flex-grow">
                                        {hasEvents ? (
                                            <ul className="space-y-2">
                                                {item.events.map((event) => (
                                                    <li key={event.id} className="flex items-start">
                                                        <span className="text-sm font-bold text-ink mr-2 whitespace-nowrap">{event.day}</span>
                                                        <span className="text-xs text-stone font-medium leading-tight">{event.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="flex items-center justify-center h-full py-4">
                                                <span className="text-[10px] text-sand italic">Sem eventos</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {totalPages > 1 && (`;

const replace = `                <>
                    <div className="space-y-12">
                        {paginatedData.map((item) => {
                            const hasEvents = item.events.length > 0;
                            return (
                                <div key={\`\${item.month}-\${item.year}\`}>
                                    <div className="flex justify-between items-end border-b border-stone/20 pb-2 mb-6 px-2">
                                        <span className="text-sm font-bold text-stone tracking-widest uppercase">{item.month}</span>
                                        <span className="text-xs font-semibold text-sand">{item.year}</span>
                                    </div>

                                    <div className="flex-grow">
                                        {hasEvents ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {item.events.map((event) => (
                                                    <div key={event.id} className="flex flex-col p-4 rounded-xl bg-bone border border-sand shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-stone transition-all duration-300">
                                                        <span className="text-xs font-bold text-forest mb-2 uppercase tracking-wide">{event.day}</span>
                                                        <span className="text-sm text-ink font-medium leading-snug">{event.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full py-8 bg-bone/50 border border-sand rounded-xl">
                                                <span className="text-sm text-sand italic">Sem eventos</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {totalPages > 1 && (`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('components/PipelineCalendar.tsx', code);
    console.log("Patched PipelineCalendar");
} else {
    console.log("Not found PipelineCalendar");
}
