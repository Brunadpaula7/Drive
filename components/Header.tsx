import React from 'react';
import { Building2 } from 'lucide-react';

interface HeaderProps {
    coverPhotoUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ coverPhotoUrl }) => {
    const isPlaceholder = coverPhotoUrl && coverPhotoUrl.includes('placehold.co');
    
    return (
        <header className="relative mb-12 bg-bone rounded-3xl overflow-hidden border border-sand min-h-[250px] md:min-h-[320px] flex items-center justify-center shadow-sm">
            {coverPhotoUrl && !isPlaceholder ? (
                <img 
                    src={coverPhotoUrl} 
                    alt="Capa"
                    className="w-full h-full object-cover absolute inset-0 z-0"
                />
            ) : (
                <>

                    
                    {/* Abstract Shapes */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-sand/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-stone/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-bone/40 z-0 backdrop-blur-[1px]"></div>
                    
                    {/* 3D Text Title */}
                    <div className="relative z-10 px-4 md:px-8 py-12 text-center w-full flex flex-col items-center justify-center scale-100 md:scale-110 lg:scale-125 transform-gpu mt-4">
                        <h1 
                            className="text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tighter uppercase text-forest leading-none flex items-center justify-center gap-4"
                            style={{
                                textShadow: `
                                    1px 1px 0px #ECEBE3,
                                    2px 2px 0px #ECEBE3,
                                    3px 3px 0px #ECEBE3,
                                    4px 4px 0px #D4D2C6,
                                    5px 5px 0px #D4D2C6,
                                    6px 6px 0px #D4D2C6,
                                    7px 7px 0px #767469,
                                    8px 8px 0px #767469,
                                    12px 12px 25px rgba(20, 26, 23, 0.4)
                                `
                            }}
                        >
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
                                            transform: `translate(${layer.offset}px, ${layer.offset}px)` 
                                        }} 
                                        strokeWidth={2.5} 
                                    />
                                ))}
                                {/* Main Icon */}
                                <Building2 className="absolute inset-0 text-forest" strokeWidth={2.5} />
                            </div>
                            Materiais
                        </h1>
                        <h2 
                            className="text-5xl md:text-6xl lg:text-7xl font-black font-serif italic tracking-tight text-forest -mt-2 md:-mt-4"
                            style={{
                                textShadow: `
                                    1px 1px 0px #ECEBE3,
                                    2px 2px 0px #ECEBE3,
                                    3px 3px 0px #D4D2C6,
                                    4px 4px 15px rgba(0,0,0,0.2)
                                `
                            }}
                        >
                            & Unidades
                        </h2>
                    </div>
                </>
            )}
        </header>
    );
};