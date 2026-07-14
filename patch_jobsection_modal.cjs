const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

// Safeguard split and photo iteration
content = content.replace(
    /\{selectedJob\.photos && selectedJob\.photos\.length > 0 && \(/g,
    "{Array.isArray(selectedJob.photos) && selectedJob.photos.length > 0 && ("
);

// Add features rendering if available
if (!content.includes('selectedJob.features &&')) {
    const featureRender = `
                        {Array.isArray(selectedJob.features) && selectedJob.features.length > 0 && (
                            <div className="pt-4 border-t border-sand/80">
                                <p className="text-[11px] font-bold text-stone uppercase tracking-wider mb-3">Características</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.features.map((feature, idx) => (
                                        <span key={idx} className="bg-sand/30 text-ink px-3 py-1 rounded-full text-xs font-medium border border-sand">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {selectedJob.description && (`;
    content = content.replace(/\{selectedJob\.description && \(/g, featureRender);
}

// Add Operacao / Tipo
if (!content.includes('selectedJob.operacao &&')) {
    const operacaoRender = `
                                {selectedJob.operacao && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Operação</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.operacao}</p>
                                    </div>
                                )}
                                {selectedJob.tipo && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Tipo</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.tipo}</p>
                                    </div>
                                )}
                                {selectedJob.area && (`;
    content = content.replace(/\{selectedJob\.area && \(/g, operacaoRender);
}

fs.writeFileSync('components/JobSection.tsx', content);
console.log("Updated JobSection.tsx");
