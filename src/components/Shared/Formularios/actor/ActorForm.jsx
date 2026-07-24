import React from 'react';
import { UserIcon, PhotoIcon, GlobeAltIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const ActorForm = ({ data, handleChange }) => {
    return (
        <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 border-b border-white/10 pb-3 uppercase tracking-wide">
                <UserIcon className="w-5 h-5 text-[#E8B04B]" /> Información del Actor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Nombre completo <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                        placeholder="Ej: Juan Pérez"
                        maxLength={100}
                        required
                    />
                </div>

                <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Nacionalidad
                    </label>
                    <div className="relative">
                        <GlobeAltIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                        <input
                            type="text"
                            value={data.nacionalidad || ''}
                            onChange={(e) => handleChange('nacionalidad', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                            placeholder="Peruana"
                            maxLength={60}
                        />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Fecha de nacimiento
                    </label>
                    <div className="relative">
                        <CalendarDaysIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                        <input
                            type="date"
                            value={data.fecha_nacimiento || ''}
                            onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors [color-scheme:dark]"
                        />
                    </div>
                </div>

                <div className="md:col-span-8">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        URL de foto
                    </label>
                    <div className="relative">
                        <PhotoIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                        <input
                            type="url"
                            value={data.foto_url || ''}
                            onChange={(e) => handleChange('foto_url', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                            placeholder="https://..."
                            maxLength={500}
                        />
                    </div>
                </div>

                <div className="md:col-span-12">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        Biografía
                    </label>
                    <textarea
                        value={data.biografia || ''}
                        onChange={(e) => handleChange('biografia', e.target.value)}
                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors resize-none"
                        placeholder="Reseña breve del actor (opcional)"
                        rows={4}
                        maxLength={2000}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActorForm;