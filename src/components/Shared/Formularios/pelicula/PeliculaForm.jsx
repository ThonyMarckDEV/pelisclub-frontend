import React from 'react';
import { FilmIcon, PhotoIcon, LinkIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import GeneroMultiSelect from 'components/Shared/Comboboxes/GeneroMultiSelect';
import ActorMultiSelect from 'components/Shared/Comboboxes/ActorMultiSelect';

const CLASIFICACIONES = ['TP', 'PG', 'PG-13', 'R', 'NC-17'];
const ESTADOS = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'procesando', label: 'Procesando' },
    { value: 'publicado', label: 'Publicado' },
];

const PeliculaForm = ({ data, handleChange }) => {
    return (
        <div className="space-y-6">

            {/* DATOS PRINCIPALES */}
            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 border-b border-white/10 pb-3 uppercase tracking-wide">
                    <FilmIcon className="w-5 h-5 text-[#E8B04B]" /> Información de la Película
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-8">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Título <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.titulo || ''}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                            placeholder="Ej: El último rollo"
                            maxLength={150}
                            required
                        />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Director
                        </label>
                        <input
                            type="text"
                            value={data.director || ''}
                            onChange={(e) => handleChange('director', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                            placeholder="Nombre del director"
                            maxLength={100}
                        />
                    </div>

                    <div className="md:col-span-12">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Sinopsis
                        </label>
                        <textarea
                            value={data.sinopsis || ''}
                            onChange={(e) => handleChange('sinopsis', e.target.value)}
                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors resize-none"
                            placeholder="Resumen de la historia (opcional)"
                            rows={4}
                            maxLength={2000}
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Año de estreno
                        </label>
                        <div className="relative">
                            <CalendarDaysIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="number"
                                value={data.anio_estreno || ''}
                                onChange={(e) => handleChange('anio_estreno', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="2026"
                                min={1900}
                                max={2100}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Duración (min)
                        </label>
                        <div className="relative">
                            <ClockIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="number"
                                value={data.duracion_minutos || ''}
                                onChange={(e) => handleChange('duracion_minutos', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="18"
                                min={1}
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
                            {CLASIFICACIONES.map(c => (
                                <option key={c} value={c} className="bg-[#111013]">{c}</option>
                            ))}
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
                            {ESTADOS.map(e => (
                                <option key={e.value} value={e.value} className="bg-[#111013]">{e.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-12 flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="destacada"
                            checked={data.destacada || false}
                            onChange={(e) => handleChange('destacada', e.target.checked)}
                            className="w-4 h-4 accent-[#E8B04B] cursor-pointer"
                        />
                        <label htmlFor="destacada" className="text-sm text-white/70 font-medium cursor-pointer select-none">
                            Marcar como destacada (aparece en el hero de Home)
                        </label>
                    </div>
                </div>
            </div>

            {/* MULTIMEDIA */}
            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 border-b border-white/10 pb-3 uppercase tracking-wide">
                    <PhotoIcon className="w-5 h-5 text-[#E8B04B]" /> Multimedia
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-6">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            URL de portada (poster vertical)
                        </label>
                        <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="url"
                                value={data.portada_url || ''}
                                onChange={(e) => handleChange('portada_url', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="md:col-span-6">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            URL de banner (hero horizontal)
                        </label>
                        <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="url"
                                value={data.banner_url || ''}
                                onChange={(e) => handleChange('banner_url', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="md:col-span-12">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            URL de trailer
                        </label>
                        <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                            <input
                                type="url"
                                value={data.trailer_url || ''}
                                onChange={(e) => handleChange('trailer_url', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-white/30 mt-3">
                    El video principal (MinIO) se sube desde la pestaña de gestión de video una vez creada la película.
                </p>
            </div>

            {/* GÉNEROS */}
            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide">Géneros</h3>
                <GeneroMultiSelect
                    selected={data.generos || []}
                    onChange={(generos) => handleChange('generos', generos)}
                />
            </div>

            {/* ACTORES */}
            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide">Reparto</h3>
                <ActorMultiSelect
                    selected={data.actores || []}
                    onChange={(actores) => handleChange('actores', actores)}
                />
            </div>
        </div>
    );
};

export default PeliculaForm;