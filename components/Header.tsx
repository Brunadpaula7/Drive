import React from 'react';

interface HeaderProps {
    coverPhotoUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ coverPhotoUrl }) => {
    return (
        <header className="relative mb-12 bg-[#0a1a12] rounded-[2.5rem] overflow-hidden border border-[#D4AF37]/20 min-h-[300px] md:min-h-[400px] flex items-center justify-center shadow-lg">
            
            {coverPhotoUrl ? (
                <>
                    <img 
                        src={coverPhotoUrl} 
                        alt="Capa / Logo"
                        className="w-full h-full object-cover absolute inset-0 z-0"
                    />
                    {/* Add a subtle gradient at the bottom so the "Materiais & Drive" text is readable */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a1a12] to-transparent z-0"></div>
                </>
            ) : null}
            
            <div className="relative z-10 px-4 py-12 text-center w-full flex flex-col items-center justify-center h-full mt-auto pt-24">
                
                {/* Always show Materiais & Drive */}
                <div className="absolute bottom-8 w-full">
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-serif tracking-[0.1em] text-[#ECEBE3] uppercase opacity-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-light">
                        Materiais & <span className="text-[#D4AF37] font-medium">Drive</span>
                    </h3>
                </div>

            </div>
        </header>
    );
};
