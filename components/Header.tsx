import React from 'react';

interface HeaderProps {
    coverPhotoUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ coverPhotoUrl }) => {
    const hasPhoto = !!coverPhotoUrl;

    const shadow3DStyle = {
        textShadow: `
            1px 1px 0px #8b8a7c,
            2px 2px 0px #717062,
            3px 3px 0px #57564b,
            4px 4px 6px rgba(0,0,0,0.7),
            5px 5px 12px rgba(0,0,0,0.9)
        `
    };

    const goldShadow3DStyle = {
        textShadow: `
            1px 1px 0px #a38421,
            2px 2px 0px #866c17,
            3px 3px 0px #695410,
            4px 4px 6px rgba(0,0,0,0.7),
            5px 5px 12px rgba(0,0,0,0.9)
        `
    };

    return (
        <header className={`relative mb-8 bg-[#0a1a12] rounded-[2rem] overflow-hidden border border-[#D4AF37]/20 flex items-center justify-center shadow-lg transition-all duration-300 ${
            hasPhoto ? 'min-h-[220px] md:min-h-[300px]' : 'min-h-[100px] md:min-h-[130px]'
        }`}>
            
            {hasPhoto ? (
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
            
            <div className={`relative z-10 px-4 text-center w-full flex items-center justify-center select-none ${
                hasPhoto ? 'pt-16 pb-8' : 'py-6 md:py-8'
            }`}>
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-[0.15em] uppercase font-bold flex flex-wrap items-center justify-center gap-3">
                    <span style={shadow3DStyle} className="text-[#ECEBE3]">
                        Materiais
                    </span>
                    <span style={shadow3DStyle} className="text-[#ECEBE3]">
                        &
                    </span>
                    <span style={goldShadow3DStyle} className="text-[#D4AF37]">
                        Drive
                    </span>
                </h3>
            </div>
        </header>
    );
};
