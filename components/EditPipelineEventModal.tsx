
import React, { useState, useEffect } from 'react';
import type { PipelineEvent } from '../types';
import { Modal } from './Modal';

interface EditPipelineEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: PipelineEvent | null;
    onSave: (event: PipelineEvent) => void;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, value, onChange, placeholder }) => (
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

export const EditPipelineEventModal: React.FC<EditPipelineEventModalProps> = ({ isOpen, onClose, event, onSave }) => {
    const [day, setDay] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (event) {
            setDay(event.day);
            setName(event.name);
        } else {
            // Reset for new event
            setDay('');
            setName('');
        }
    }, [event, isOpen]);

    const handleSave = () => {
        if (!name.trim() || !day.trim()) {
            alert('Por favor, preencha o dia e o nome do evento.');
            return;
        }
        const id = event ? event.id : crypto.randomUUID();
        onSave({ id, day, name });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event ? 'Editar Evento do Pipeline' : 'Adicionar Novo Evento'}
        >
            <div className="space-y-6">
                <InputField label="Dia" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Ex: 06 ou 18+" />
                <InputField label="Nome do Evento" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Rodada Altana" />
                
                <div className="flex justify-end space-x-4 pt-4">
                     <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold bg-bone border border-stone text-stone hover:bg-bone transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-bone hover:bg-emerald-800 transition-colors">Salvar</button>
                </div>
            </div>
        </Modal>
    );
};
