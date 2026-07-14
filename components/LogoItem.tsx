import React from 'react';
import type { Logo } from '../types';

interface LogoItemProps {
    logo: Logo;
    onClick: (modalId: string) => void;
}

export const LogoItem: React.FC<LogoItemProps> = ({ logo, onClick }) => {
    const { name, imgSrc, href, modalId } = logo;

    const content = (
        <>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 relative z-10">
                <div className="absolute inset-0 bg-sand rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-125 blur-xl"></div>
                <img 
                    className="w-full h-full rounded-full object-cover shadow-sm ring-1 ring-sand/50 filter grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:ring-forest/30 group-hover:shadow-md bg-bone z-10 relative" 
                    src={imgSrc} 
                    alt={`Logo ${name}`}
                    loading="lazy"
                />
            </div>
            <span className="text-sm font-bold text-stone text-center leading-tight h-10 flex items-center justify-center group-hover:text-forest transition-colors duration-300 relative z-10">{name}</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-sand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </>
    );

    const containerClasses = "relative flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white border border-sand/60 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-forest/5 hover:-translate-y-2 hover:border-forest/20 cursor-pointer group h-full overflow-hidden";

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={containerClasses}>
                {content}
            </a>
        );
    }

    return (
        <div onClick={() => modalId && onClick(modalId)} className={containerClasses}>
            {content}
        </div>
    );
};