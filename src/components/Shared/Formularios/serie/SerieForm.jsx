import React from 'react';
import { TvIcon, PhotoIcon, LinkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import GeneroMultiSelect from 'components/Shared/Comboboxes/GeneroMultiSelect';
import ActorMultiSelect from 'components/Shared/Comboboxes/ActorMultiSelect';

const CLASIFICACIONES = ['TP', 'PG', 'PG-13', 'R', 'NC-17'];
const ESTADOS = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'procesando', label: 'Procesando' },
    { value: 'publicado', label: 'Publicado' },
];

const SerieForm = ({ data, handleChange }) => {
    return (
        <div className="space-y-6">
            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 border-b border-white/10 pb-3 uppercase tracking-wide">
                    <TvIcon className="w-5 h-5 text-[#E8B04B]" /> Información de la Serie
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-8">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Título <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text" value={data.titulo || ''}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                            placeholder="Ej: Stranger Things" maxLength={150} required
                        />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Director</label>
                        <input
                            type="text" value={data.director || ''}
                            onChange={(e) => handleChange('director', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                            placeholder="Nombre del creador" maxLength={100}
                        />
                    </div>

                    <div className="md:col-span-12">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Sinopsis</label>
                        <textarea
                            value={data.sinopsis || ''}
                            onChange={(e) => handleChange('sinopsis', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors resize-none"
                            placeholder="Resumen de la historia (opcional)" rows={4} maxLength={2000}
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Año inicio</label>
                        <div className="relative">
                            <CalendarDaysIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="number" value={data.anio_inicio || ''}
                                onChange={(e) => handleChange('anio_inicio', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="2024" min={1900} max={2100}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Año fin</label>
                        <div className="relative">
                            <CalendarDaysIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="number" value={data.anio_fin || ''}
                                onChange={(e) => handleChange('anio_fin', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="En emisión si vacío" min={1900} max={2105}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Clasificación <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={data.clasificacion || 'TP'}
                            onChange={(e) => handleChange('clasificacion', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors cursor-pointer"
                        >
                            {CLASIFICACIONES.map(c => <option key={c} value={c} className="bg-[#111013]">{c}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Estado <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={data.estado || 'borrador'}
                            onChange={(e) => handleChange('estado', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors cursor-pointer"
                        >
                            {ESTADOS.map(e => <option key={e.value} value={e.value} className="bg-[#111013]">{e.label}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-12 flex items-center gap-2 pt-1">
                        <input
                            type="checkbox" id="destacada" checked={data.destacada || false}
                            onChange={(e) => handleChange('destacada', e.target.checked)}
                            className="w-4 h-4 accent-[#E8B04B] cursor-pointer"
                        />
                        <label htmlFor="destacada" className="text-sm text-white/70 font-medium cursor-pointer select-none">
                            Marcar como destacada (aparece en el hero de Home)
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 border-b border-white/10 pb-3 uppercase tracking-wide">
                    <PhotoIcon className="w-5 h-5 text-[#E8B04B]" /> Multimedia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-6">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">URL de portada</label>
                        <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input type="url" value={data.portada_url || ''} onChange={(e) => handleChange('portada_url', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors" placeholder="https://..." />
                        </div>
                    </div>
                    <div className="md:col-span-6">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">URL de banner</label>
                        <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input type="url" value={data.banner_url || ''} onChange={(e) => handleChange('banner_url', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors" placeholder="https://..." />
                        </div>
                    </div>
                    <div className="md:col-span-12">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">URL de trailer</label>
                        <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input type="url" value={data.trailer_url || ''} onChange={(e) => handleChange('trailer_url', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors" placeholder="https://..." />
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-white/30 mt-3">
                    Las temporadas y episodios se gestionan desde /temporada/gestionar una vez creada la serie.
                </p>
            </div>

            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide">Géneros</h3>
                <GeneroMultiSelect selected={data.generos || []} onChange={(g) => handleChange('generos', g)} />
            </div>

            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide">Reparto</h3>
                <ActorMultiSelect selected={data.actores || []} onChange={(a) => handleChange('actores', a)} />
            </div>
        </div>
    );
};

export default SerieForm;