import React, { useState, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        let timeoutId: number;
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else if (isMounted && !isOpen) {
            timeoutId = window.setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = 'unset';
        }

        return () => {
            clearTimeout(timeoutId);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-in-out ${isOpen ? 'bg-ink/30 backdrop-blur-sm opacity-100' : 'bg-ink/0 backdrop-blur-none opacity-0'} print:absolute print:inset-0 print:block print:bg-transparent print:backdrop-blur-none print:items-start print:p-0`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`relative flex flex-col bg-bone rounded-2xl sm:rounded-3xl shadow-2xl border border-sand p-5 sm:p-8 w-full max-w-6xl max-h-[100%] sm:max-h-[90vh] transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'} print:max-h-none print:w-full print:p-0 print:shadow-none print:border-none print:bg-white`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 flex justify-between items-center mb-6 border-b border-sand/50 pb-4">
                    <h3 className="text-2xl font-bold text-ink mr-4">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-sand hover:text-ink transition-colors text-3xl font-bold leading-none focus:outline-none flex-shrink-0 print:hidden"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div className="overflow-y-auto pr-2 custom-scrollbar print:overflow-visible print:h-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};