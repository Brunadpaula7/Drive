const fs = require('fs');
let content = fs.readFileSync('components/Header.tsx', 'utf8');

const regex = /<Building2 className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-forest" strokeWidth=\{2\.5\} style=\{\{.*?\}\} \/>/s;

const newIcon = `
                            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                                {/* Dropshadow */}
                                <Building2 className="absolute inset-0 text-black/40" style={{ transform: 'translate(12px, 12px)', filter: 'blur(12px)' }} strokeWidth={2.5} />
                                {/* 3D Extrusion Layers */}
                                {[
                                    { color: '#767469', offset: 8 },
                                    { color: '#767469', offset: 7 },
                                    { color: '#D4D2C6', offset: 6 },
                                    { color: '#D4D2C6', offset: 5 },
                                    { color: '#D4D2C6', offset: 4 },
                                    { color: '#ECEBE3', offset: 3 },
                                    { color: '#ECEBE3', offset: 2 },
                                    { color: '#ECEBE3', offset: 1 },
                                ].map((layer, i) => (
                                    <Building2 
                                        key={i} 
                                        className="absolute inset-0" 
                                        style={{ 
                                            color: layer.color, 
                                            transform: \`translate(\${layer.offset}px, \${layer.offset}px)\` 
                                        }} 
                                        strokeWidth={2.5} 
                                    />
                                ))}
                                {/* Main Icon */}
                                <Building2 className="absolute inset-0 text-forest" strokeWidth={2.5} />
                            </div>
`;

content = content.replace(regex, newIcon.trim());

fs.writeFileSync('components/Header.tsx', content);
console.log("Patched 3D Icon using layers");
