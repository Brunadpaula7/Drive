const fs = require('fs');
let content = fs.readFileSync('components/JobSection.tsx', 'utf8');

const modalSearch = `<Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob.property.split(' | ')[0] || 'Detalhes do Imóvel'}>`;
const modalReplace = `<Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob.title || selectedJob.property.split(' | ')[0] || 'Detalhes do Imóvel'}>`;
content = content.replace(modalSearch, modalReplace);

const gridSearch = `                            <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-sand/80">
                                {selectedJob.area && (
                                    <>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Área</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.area} m²</p>
                                    </>
                                )}
                                {selectedJob.suites && (
                                    <>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Suítes</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.suites}</p>
                                    </>
                                )}
                                {selectedJob.bathrooms && (
                                    <>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Banheiros</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.bathrooms}</p>
                                    </>
                                )}
                                {selectedJob.parking && (
                                    <>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Vagas</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.parking}</p>
                                    </>
                                )}
                            </div>
                            {selectedJob.price && (
                                <div className="pt-3 mt-3 border-t border-sand/80">
                                    <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Valor</p>
                                    <p className="text-xl font-bold text-ink">{selectedJob.price}</p>
                                </div>
                            )}`;

const gridReplace = `                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 mt-3 border-t border-sand/80">
                                {selectedJob.area && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Área Útil</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.area} m²</p>
                                    </div>
                                )}
                                {selectedJob.areaTotal && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Área Total</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.areaTotal} m²</p>
                                    </div>
                                )}
                                {selectedJob.quartos && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Quartos</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.quartos}</p>
                                    </div>
                                )}
                                {selectedJob.suites && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Suítes</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.suites}</p>
                                    </div>
                                )}
                                {selectedJob.salas && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Salas</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.salas}</p>
                                    </div>
                                )}
                                {selectedJob.bathrooms && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Banheiros</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.bathrooms}</p>
                                    </div>
                                )}
                                {selectedJob.parking && (
                                    <div>
                                        <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Vagas</p>
                                        <p className="text-base font-semibold text-ink">{selectedJob.parking}</p>
                                    </div>
                                )}
                            </div>
                            
                            {(selectedJob.price || selectedJob.condominio || selectedJob.iptu) && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 mt-3 border-t border-sand/80">
                                    {selectedJob.price && (
                                        <div className="col-span-1">
                                            <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Valor de Venda</p>
                                            <p className="text-xl font-bold text-ink">{selectedJob.price}</p>
                                        </div>
                                    )}
                                    {selectedJob.condominio && (
                                        <div className="col-span-1">
                                            <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Condomínio</p>
                                            <p className="text-base font-semibold text-ink">R$ {Number(selectedJob.condominio).toLocaleString('pt-BR')}</p>
                                        </div>
                                    )}
                                    {selectedJob.iptu && (
                                        <div className="col-span-1">
                                            <p className="text-[11px] font-bold text-stone uppercase tracking-wider">IPTU {selectedJob.iptuTipo ? '(' + selectedJob.iptuTipo + ')' : ''}</p>
                                            <p className="text-base font-semibold text-ink">R$ {Number(selectedJob.iptu).toLocaleString('pt-BR')}</p>
                                        </div>
                                    )}
                                </div>
                            )}`;

content = content.replace(gridSearch, gridReplace);

fs.writeFileSync('components/JobSection.tsx', content);
console.log("JobSection patched");
