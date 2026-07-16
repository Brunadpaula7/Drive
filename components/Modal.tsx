import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm"
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 15 }}
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                        className="relative flex flex-col bg-bone rounded-2xl sm:rounded-3xl shadow-2xl border border-sand p-5 sm:p-8 w-full max-w-6xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 flex justify-between items-center mb-6 border-b border-sand/50 pb-4">
                            <h3 className="text-2xl font-bold text-ink mr-4">{title}</h3>
                            <button 
                                onClick={onClose}
                                className="text-sand hover:text-ink transition-colors text-3xl font-bold leading-none focus:outline-none flex-shrink-0 cursor-pointer"
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
