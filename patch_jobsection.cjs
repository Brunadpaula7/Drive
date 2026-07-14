const fs = require('fs');
let code = fs.readFileSync('components/JobSection.tsx', 'utf8');

// Step 1: Update JtJobListItem props
code = code.replace("const JtJobListItem: React.FC<{ job: Job }> = ({ job }) => {", "const JtJobListItem: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => {");

// Step 2: Add onClick to the JtJobListItem div
code = code.replace('aria-label={`Job ${job.job}, ${formattedJt}, ${job.property}`}', 'aria-label={`Job ${job.job}, ${formattedJt}, ${job.property}`}\n            onClick={onClick}');

// Step 3: Import Modal
code = code.replace("import type { Job } from '../types';", "import type { Job } from '../types';\nimport { Modal } from './Modal';");

// Step 4: Add state for selected job in JobSection
code = code.replace("const [isOpen, setIsOpen] = useState(true);", "const [isOpen, setIsOpen] = useState(true);\n    const [selectedJob, setSelectedJob] = useState<Job | null>(null);");

// Step 5: Update paginatedJobs mapping to pass onClick
code = code.replace("{paginatedJobs.map(job => <JtJobListItem key={job.id} job={job} />)}", "{paginatedJobs.map(job => <JtJobListItem key={job.id} job={job} onClick={() => setSelectedJob(job)} />)}");

// Step 6: Add modal rendering at the end of JobSection
const modalCode = `
            {selectedJob && (
                <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob.property.split(' | ')[0] || 'Detalhes do Imóvel'}>
                    <div className="space-y-4">
                        <div className="p-4 bg-zinc-100/70 rounded-xl space-y-3">
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Código</p>
                            <p className="text-base font-semibold text-zinc-800">{selectedJob.jt}</p>
                            
                            {selectedJob.locationDetails && (
                                <>
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Localização</p>
                                    <p className="text-base font-semibold text-zinc-800">{selectedJob.locationDetails}</p>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-zinc-200/80">
                                {selectedJob.area && (
                                    <>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Área</p>
                                        <p className="text-base font-semibold text-zinc-800">{selectedJob.area} m²</p>
                                    </>
                                )}
                                {selectedJob.suites && (
                                    <>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Suítes</p>
                                        <p className="text-base font-semibold text-zinc-800">{selectedJob.suites}</p>
                                    </>
                                )}
                                {selectedJob.bathrooms && (
                                    <>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Banheiros</p>
                                        <p className="text-base font-semibold text-zinc-800">{selectedJob.bathrooms}</p>
                                    </>
                                )}
                                {selectedJob.parking && (
                                    <>
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Vagas</p>
                                        <p className="text-base font-semibold text-zinc-800">{selectedJob.parking}</p>
                                    </>
                                )}
                            </div>

                            {selectedJob.price && (
                                <div className="pt-3 mt-3 border-t border-zinc-200/80">
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Valor</p>
                                    <p className="text-xl font-bold text-zinc-900">{selectedJob.price}</p>
                                </div>
                            )}
                        </div>

                        {selectedJob.description && (
                            <div>
                                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                            </div>
                        )}

                        {selectedJob.photos && selectedJob.photos.length > 0 && (
                            <div className="pt-4 border-t border-zinc-200/80">
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Fotos ({selectedJob.photos.length})</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                                    {selectedJob.photos.map((photo, idx) => (
                                        <img key={idx} src={photo} alt={\`Foto \${idx+1}\`} className="w-full h-24 object-cover rounded-lg border border-zinc-200" loading="lazy" />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {selectedJob.url && (
                             <div className="pt-4">
                                <a href={\`https://\${selectedJob.url}\`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-zinc-900 hover:bg-zinc-800 text-white p-3 rounded-xl text-lg font-medium shadow-lg transition-all border border-zinc-800">
                                    Ver no Site
                                </a>
                             </div>
                        )}
                    </div>
                </Modal>
            )}
`;
code = code.replace("        </section>", modalCode + "\n        </section>");

fs.writeFileSync('components/JobSection.tsx', code);
console.log('JobSection.tsx patched');
