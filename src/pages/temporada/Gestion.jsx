import React from 'react';
import { useGestion } from 'hooks/temporada/useGestion';
import SerieSearchSelect from 'components/Shared/Comboboxes/SerieMultiSelect';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import {
    RectangleStackIcon, PlayIcon, PencilSquareIcon, TrashIcon, TvIcon, FilmIcon
} from '@heroicons/react/24/outline';

const Gestion = () => {
    const {
        serie, temporadas, temporadaSeleccionada, episodios, loading, alert, setAlert,
        formTemporada, editingTemporadaId, formEpisodio, editingEpisodioId, saving,
        handleSelectSerie, handleSelectTemporada,
        handleFormTemporadaChange, handleEditTemporada, handleCancelEditTemporada, handleSubmitTemporada, handleDeleteTemporada,
        handleFormEpisodioChange, handleEditEpisodio, handleCancelEditEpisodio, handleSubmitEpisodio, handleDeleteEpisodio,
    } = useGestion();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Temporadas y Episodios" icon={RectangleStackIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10 mb-6">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Selecciona la serie</label>
                <SerieSearchSelect selected={serie} onSelect={handleSelectSerie} />
            </div>

            {serie && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLUMNA TEMPORADAS */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-[#0D0C0E] p-5 rounded-sm border border-white/10">
                            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4 uppercase tracking-wide">
                                <TvIcon className="w-5 h-5 text-[#E8B04B]" /> {editingTemporadaId ? 'Editar temporada' : 'Nueva temporada'}
                            </h3>
                            <form onSubmit={handleSubmitTemporada} className="space-y-3">
                                <input type="number" placeholder="Número" value={formTemporada.numero}
                                    onChange={(e) => handleFormTemporadaChange('numero', parseInt(e.target.value) || '')}
                                    className="w-full p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" required min={1} />
                                <input type="text" placeholder="Título (opcional)" value={formTemporada.titulo}
                                    onChange={(e) => handleFormTemporadaChange('titulo', e.target.value)}
                                    className="w-full p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" />
                                <input type="url" placeholder="URL portada" value={formTemporada.portada_url}
                                    onChange={(e) => handleFormTemporadaChange('portada_url', e.target.value)}
                                    className="w-full p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" />
                                <div className="flex gap-2">
                                    {editingTemporadaId && (
                                        <button type="button" onClick={handleCancelEditTemporada}
                                            className="flex-1 py-2 bg-white/5 text-white/60 rounded-sm text-xs font-bold uppercase border border-white/10">
                                            Cancelar
                                        </button>
                                    )}
                                    <button type="submit" disabled={saving}
                                        className="flex-1 py-2 bg-[#E8B04B] text-black rounded-sm text-xs font-black uppercase disabled:opacity-50">
                                        {saving ? 'Guardando...' : editingTemporadaId ? 'Guardar' : 'Agregar'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-[#0D0C0E] p-5 rounded-sm border border-white/10">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Temporadas</h4>
                            {loading && temporadas.length === 0 ? (
                                <p className="text-xs text-white/30 text-center py-4">Cargando...</p>
                            ) : temporadas.length > 0 ? (
                                <div className="space-y-1.5">
                                    {temporadas.map((t) => (
                                        <div key={t.id}
                                            onClick={() => handleSelectTemporada(t)}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-sm cursor-pointer border transition-colors ${
                                                temporadaSeleccionada?.id === t.id ? 'bg-[#E8B04B]/10 border-[#E8B04B]/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">Temporada {t.numero}</span>
                                                {t.titulo && <span className="text-[10px] text-white/40">{t.titulo}</span>}
                                                <span className="text-[10px] text-white/30">{t.episodios_count} episodios</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditTemporada(t); }} className="p-1.5 text-white/40 hover:text-[#E8B04B]">
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteTemporada(t.id); }} className="p-1.5 text-red-400/60 hover:text-red-400">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-white/30 text-center py-4">Sin temporadas todavía.</p>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA EPISODIOS */}
                    <div className="lg:col-span-2 space-y-4">
                        {temporadaSeleccionada ? (
                            <>
                                <div className="bg-[#0D0C0E] p-5 rounded-sm border border-white/10">
                                    <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4 uppercase tracking-wide">
                                        <PlayIcon className="w-5 h-5 text-[#E8B04B]" />
                                        {editingEpisodioId ? 'Editar episodio' : `Nuevo episodio — Temporada ${temporadaSeleccionada.numero}`}
                                    </h3>
                                    <form onSubmit={handleSubmitEpisodio} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <input type="number" placeholder="N°" value={formEpisodio.numero}
                                            onChange={(e) => handleFormEpisodioChange('numero', parseInt(e.target.value) || '')}
                                            className="md:col-span-1 p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" required min={1} />
                                        <input type="text" placeholder="Título del episodio" value={formEpisodio.titulo}
                                            onChange={(e) => handleFormEpisodioChange('titulo', e.target.value)}
                                            className="md:col-span-3 p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" required />
                                        <textarea placeholder="Sinopsis" value={formEpisodio.sinopsis}
                                            onChange={(e) => handleFormEpisodioChange('sinopsis', e.target.value)}
                                            className="md:col-span-4 p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] resize-none" rows={2} />
                                        <input type="number" placeholder="Duración (min)" value={formEpisodio.duracion_minutos}
                                            onChange={(e) => handleFormEpisodioChange('duracion_minutos', e.target.value)}
                                            className="md:col-span-1 p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" />
                                        <input type="url" placeholder="URL thumbnail" value={formEpisodio.portada_url}
                                            onChange={(e) => handleFormEpisodioChange('portada_url', e.target.value)}
                                            className="md:col-span-2 p-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B]" />
                                        <select value={formEpisodio.estado} onChange={(e) => handleFormEpisodioChange('estado', e.target.value)}
                                            className="md:col-span-1 p-2 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] cursor-pointer">
                                            <option value="borrador" className="bg-[#111013]">Borrador</option>
                                            <option value="publicado" className="bg-[#111013]">Publicado</option>
                                        </select>

                                        <div className="md:col-span-4 flex gap-2 pt-1">
                                            {editingEpisodioId && (
                                                <button type="button" onClick={handleCancelEditEpisodio}
                                                    className="flex-1 py-2 bg-white/5 text-white/60 rounded-sm text-xs font-bold uppercase border border-white/10">
                                                    Cancelar
                                                </button>
                                            )}
                                            <button type="submit" disabled={saving}
                                                className="flex-1 py-2 bg-[#E8B04B] text-black rounded-sm text-xs font-black uppercase disabled:opacity-50">
                                                {saving ? 'Guardando...' : editingEpisodioId ? 'Guardar cambios' : 'Agregar episodio'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-[#0D0C0E] p-5 rounded-sm border border-white/10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                                        Episodios de la Temporada {temporadaSeleccionada.numero}
                                    </h4>
                                    {episodios.length > 0 ? (
                                        <div className="space-y-2">
                                            {episodios.map((ep) => (
                                                <div key={ep.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-sm">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-12 h-8 rounded-sm bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {ep.portada_url ? <img src={ep.portada_url} alt={ep.titulo} className="w-full h-full object-cover" /> : <FilmIcon className="w-3.5 h-3.5 text-white/20" />}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-bold text-white truncate">E{ep.numero}. {ep.titulo}</span>
                                                            <span className={`text-[10px] font-bold uppercase w-fit px-1.5 rounded-sm ${ep.estado === 'publicado' ? 'text-[#5DCAA5]' : 'text-white/30'}`}>{ep.estado}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button onClick={() => handleEditEpisodio(ep)} className="p-1.5 text-white/40 hover:text-[#E8B04B]"><PencilSquareIcon className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteEpisodio(ep.id)} className="p-1.5 text-red-400/60 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-white/30 text-center py-4">Sin episodios todavía.</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-[#0D0C0E] p-10 rounded-sm border border-white/10 flex flex-col items-center justify-center text-white/30 gap-2">
                                <RectangleStackIcon className="w-8 h-8" />
                                <p className="text-sm font-semibold">Selecciona una temporada de la izquierda para gestionar sus episodios.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gestion;