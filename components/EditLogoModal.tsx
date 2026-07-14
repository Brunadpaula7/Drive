

import React, { useState, useEffect } from 'react';
import type { Logo } from '../types';
import { Modal } from './Modal';

interface EditLogoModalProps {
    isOpen: boolean;
    onClose: () => void;
    logo: Logo | null;
    onSave: (logo: Logo) => void;
}

// Exported InputField component
export const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-bold text-stone mb-2">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 rounded-lg bg-sand border border-stone/70 focus:outline-none focus:ring-2 focus:ring-stone/50 transition-all"
        />
    </div>
);

export const EditLogoModal: React.FC<EditLogoModalProps> = ({ isOpen, onClose, logo, onSave }) => {
    const [name, setName] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [link, setLink] = useState('');
    const [modalId, setModalId] = useState('');

    useEffect(() => {
        if (logo) {
            setName(logo.name);
            setImgSrc(logo.imgSrc);
            setLink(logo.href || '');
            setModalId(logo.modalId || '');
        } else {
            // Reset for new logo
            setName('');
            setImgSrc('');
            setLink('');
            setModalId('');
        }
    }, [logo, isOpen]);

    const handleSave = () => {
        const id = logo ? logo.id : crypto.randomUUID();
        onSave({ id, name, imgSrc, href: link || undefined, modalId: modalId || undefined });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={logo ? 'Editar Logo' : 'Adicionar Novo Logo'}
        >
            <div className="space-y-6">
                <InputField label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Opus" />
                
                <div>
                    <label className="block text-sm font-bold text-stone mb-2">Imagem</label>
                    <div className="flex items-center space-x-4">
                        {imgSrc && <img src={imgSrc} alt="Preview" className="w-16 h-16 rounded-full object-cover bg-sand" />}
                        <div className="flex-grow">
                             <InputField label="URL da Imagem" value={imgSrc} onChange={(e) => setImgSrc(e.target.value)} placeholder="https://..." />
                             <span className="text-xs text-stone my-2 block text-center">OU</span>
                             <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm w-full" />
                        </div>
                    </div>
                </div>

                <InputField label="Link de Destino (URL)" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
                <InputField label="ID do Modal (Opcional)" value={modalId} onChange={(e) => setModalId(e.target.value)} placeholder="Ex: opus-modal" />
                
                <div className="flex justify-end space-x-4 pt-4">
                     <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold bg-bone border border-stone text-stone hover:bg-bone transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-bone hover:bg-emerald-800 transition-colors">Salvar</button>
                </div>
            </div>
        </Modal>
    );
};