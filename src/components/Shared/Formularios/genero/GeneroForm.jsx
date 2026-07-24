import React from 'react';
import { TagIcon } from '@heroicons/react/24/outline';

const GeneroForm = ({ data, handleChange }) => {
    return (
        <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 border-b border-white/10 pb-3 uppercase tracking-wide">
                <TagIcon className="w-5 h-5 text-[#E8B04B]" /> Información del Género
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Nombre <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                        placeholder="Ej: Drama, Comedia, Terror..."
                        maxLength={60}
                        required
                    />
                </div>

                <div className="md:col-span-7">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Descripción
                    </label>
                    <input
                        type="text"
                        value={data.descripcion || ''}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                        placeholder="Descripción breve del género (opcional)"
                        maxLength={255}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneroForm;