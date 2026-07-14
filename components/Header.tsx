import React from 'react';

interface HeaderProps {
    coverPhotoUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ coverPhotoUrl }) => {
    const isPlaceholder = coverPhotoUrl && coverPhotoUrl.includes('placehold.co');
    const hasImage = coverPhotoUrl && !isPlaceholder;
    
    return (
        <header className="relative mb-12 bg-[#0B1E16] rounded-[2.5rem] overflow-hidden border border-[#D4AF37]/20 min-h-[300px] md:min-h-[400px] flex items-center justify-center shadow-lg">
            
            {hasImage ? (
                <>
                    <img 
                        src={coverPhotoUrl} 
                        alt="Capa / Logo"
                        className="w-full h-full object-cover absolute inset-0 z-0"
                    />
                    {/* Add a subtle gradient at the bottom so the "Materiais & Drive" text is readable */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B1E16] to-transparent z-0"></div>
                </>
            ) : (
                <>
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#112a1f] via-[#0B1E16] to-[#050f0b]"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                </>
            )}
            
            <div className="relative z-10 px-4 py-12 text-center w-full flex flex-col items-center justify-center h-full mt-auto pt-24">
                
                {!hasImage && (
                    <>
                        {/* Custom SVG Tree with Roots Fallback */}
                        <div className="w-32 h-32 md:w-40 md:h-40 mb-8 relative">
                            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-2xl rounded-full"></div>
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' }}>
                                <g fill="url(#goldGradient)">
                                    <circle cx="50" cy="25" r="15" />
                                    <circle cx="35" cy="35" r="12" />
                                    <circle cx="65" cy="35" r="12" />
                                    <circle cx="28" cy="48" r="9" />
                                    <circle cx="72" cy="48" r="9" />
                                    <circle cx="42" cy="48" r="10" />
                                    <circle cx="58" cy="48" r="10" />
                                    <circle cx="50" cy="55" r="8" />
                                    <circle cx="38" cy="58" r="6" />
                                    <circle cx="62" cy="58" r="6" />
                                </g>
                                <path d="M50 65 L 50 35 M 50 48 L 35 38 M 50 48 L 65 38 M 42 42 L 32 45 M 58 42 L 68 45 M 50 55 L 42 55 M 50 55 L 58 55" stroke="#0B1E16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M50 65 L 50 35 M 50 48 L 35 38 M 50 48 L 65 38 M 42 42 L 32 45 M 58 42 L 68 45 M 50 55 L 42 55 M 50 55 L 58 55" stroke="url(#goldGradient)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M48 58 L 48 68 L 52 68 L 52 58 Z" fill="url(#goldGradient)"/>
                                <line x1="20" y1="68" x2="80" y2="68" stroke="url(#goldGradient)" strokeWidth="1"/>
                                <path d="M50 68 C 48 76, 38 82, 28 85 M 50 68 C 52 76, 62 82, 72 85 M 50 68 C 46 80, 42 85, 36 92 M 50 68 C 54 80, 58 85, 64 92 M 50 68 L 50 90 M 44 76 C 42 80, 36 84, 32 88 M 56 76 C 58 80, 64 84, 68 88" stroke="url(#goldGradient)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#F3E5AB" />
                                        <stop offset="30%" stopColor="#D4AF37" />
                                        <stop offset="70%" stopColor="#AA7C11" />
                                        <stop offset="100%" stopColor="#8A630B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] uppercase leading-none mb-3 font-medium" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                            ARBOR
                        </h1>
                        <h2 className="text-sm md:text-base lg:text-lg font-serif tracking-[0.5em] text-[#D4AF37] uppercase opacity-90 drop-shadow-md ml-2 mb-6">
                            IMÓVEIS
                        </h2>
                    </>
                )}

                {/* Always show Materiais & Drive */}
                <div className={hasImage ? "absolute bottom-8 w-full" : "mt-auto"}>
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-serif tracking-[0.1em] text-bone uppercase opacity-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-light">
                        Materiais & <span className="text-[#D4AF37] font-medium">Drive</span>
                    </h3>
                </div>

            </div>
        </header>
    );
};
