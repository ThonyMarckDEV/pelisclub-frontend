import React from 'react';
import { useGestion } from 'hooks/video/useGestion';
import PeliculaSearchSelect from 'components/Shared/Comboboxes/PeliculaMultiSelect';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import {
    LinkIcon, PlayCircleIcon, ArrowDownTrayIcon, StarIcon,
    PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon, VideoCameraIcon
} from '@heroicons/react/24/outline';

const CALIDADES = ['SD', 'HD', 'FHD', '4K'];

const Gestion = () => {
    const {
        pelicula, videos, loading, alert, setAlert,
        formData, editingId, saving,
        showConfirm, setShowConfirm, setIdToDelete,
        handleSelectPelicula, handleFormChange, handleEdit, handleCancelEdit,
        handleSubmit, handleAskDelete, handleConfirmDelete, handleToggleActivo,
    } = useGestion();

    const reproduccion = videos.filter(v => v.tipo === 'reproduccion');
    const descarga = videos.filter(v => v.tipo === 'descarga');

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Enlaces de Video" icon={VideoCameraIcon} />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {/* SELECTOR DE PELICULA */}
            <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10 mb-6">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Selecciona la película
                </label>
                <PeliculaSearchSelect selected={pelicula} onSelect={handleSelectPelicula} />
            </div>

            {pelicula && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* FORM */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10 sticky top-6">
                            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 uppercase tracking-wide">
                                <LinkIcon className="w-5 h-5 text-[#E8B04B]" />
                                {editingId ? 'Editar enlace' : 'Agregar enlace'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                                        Servidor <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.servidor}
                                        onChange={(e) => handleFormChange('servidor', e.target.value)}
                                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                        placeholder="Ej: Doodstream, Streamtape..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                                            Tipo <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            value={formData.tipo}
                                            onChange={(e) => handleFormChange('tipo', e.target.value)}
                                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors cursor-pointer"
                                        >
                                            <option value="reproduccion" className="bg-[#111013]">Reproducción</option>
                                            <option value="descarga" className="bg-[#111013]">Descarga</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                                            Calidad
                                        </label>
                                        <select
                                            value={formData.calidad}
                                            onChange={(e) => handleFormChange('calidad', e.target.value)}
                                            className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors cursor-pointer"
                                        >
                                            <option value="" className="bg-[#111013]">Sin especificar</option>
                                            {CALIDADES.map(c => (
                                                <option key={c} value={c} className="bg-[#111013]">{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                                        URL <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => handleFormChange('url', e.target.value)}
                                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                                        Orden
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.orden}
                                        onChange={(e) => handleFormChange('orden', parseInt(e.target.value) || 0)}
                                        className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors"
                                        min={0}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="es_principal"
                                        checked={formData.es_principal}
                                        onChange={(e) => handleFormChange('es_principal', e.target.checked)}
                                        className="w-4 h-4 accent-[#E8B04B] cursor-pointer"
                                    />
                                    <label htmlFor="es_principal" className="text-xs text-white/70 font-medium cursor-pointer select-none">
                                        Marcar como enlace principal (solo aplica a reproducción)
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="activo"
                                        checked={formData.activo}
                                        onChange={(e) => handleFormChange('activo', e.target.checked)}
                                        className="w-4 h-4 accent-[#E8B04B] cursor-pointer"
                                    />
                                    <label htmlFor="activo" className="text-xs text-white/70 font-medium cursor-pointer select-none">
                                        Enlace activo (visible al público)
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-sm font-bold hover:bg-white/10 transition-colors uppercase text-xs tracking-wide border border-white/10"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-2.5 bg-[#E8B04B] text-black rounded-sm font-black uppercase hover:bg-[#f0c06a] transition-colors disabled:opacity-50 text-xs tracking-wide"
                                    >
                                        {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar enlace'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* LISTA DE ENLACES */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* REPRODUCCION */}
                        <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4 uppercase tracking-wide">
                                <PlayCircleIcon className="w-5 h-5 text-[#E8B04B]" /> Servidores de reproducción
                            </h3>

                            {loading ? (
                                <p className="text-xs text-white/30 text-center py-6">Cargando...</p>
                            ) : reproduccion.length > 0 ? (
                                <div className="space-y-2">
                                    {reproduccion.map((v) => (
                                        <VideoRow key={v.id} video={v} onEdit={handleEdit} onDelete={handleAskDelete} onToggle={handleToggleActivo} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-white/30 text-center py-6">Sin enlaces de reproducción todavía.</p>
                            )}
                        </div>

                        {/* DESCARGA */}
                        <div className="bg-[#0D0C0E] p-6 rounded-sm border border-white/10">
                            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4 uppercase tracking-wide">
                                <ArrowDownTrayIcon className="w-5 h-5 text-[#E8B04B]" /> Enlaces de descarga
                            </h3>

                            {loading ? (
                                <p className="text-xs text-white/30 text-center py-6">Cargando...</p>
                            ) : descarga.length > 0 ? (
                                <div className="space-y-2">
                                    {descarga.map((v) => (
                                        <VideoRow key={v.id} video={v} onEdit={handleEdit} onDelete={handleAskDelete} onToggle={handleToggleActivo} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-white/30 text-center py-6">Sin enlaces de descarga todavía.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de eliminar este enlace?"
                    confirmText="Sí, eliminar" cancelText="Cancelar"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => { setShowConfirm(false); setIdToDelete(null); }}
                />
            )}
        </div>
    );
};

const VideoRow = ({ video, onEdit, onDelete, onToggle }) => (
    <div className={`flex items-center gap-3 p-3 rounded-sm border ${video.activo ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-50'}`}>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white truncate">{video.servidor}</span>
                {video.es_principal && (
                    <StarIcon className="w-3.5 h-3.5 text-[#E8B04B] fill-[#E8B04B] shrink-0" />
                )}
                {video.calidad && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/10 text-white/60 rounded-sm shrink-0">
                        {video.calidad}
                    </span>
                )}
            </div>
            <p className="text-[11px] text-white/40 truncate">{video.url}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onToggle(video.id)} className="p-1.5 text-white/40 hover:text-[#E8B04B] hover:bg-white/5 rounded-sm transition-all" title={video.activo ? 'Desactivar' : 'Activar'}>
                {video.activo ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
            </button>
            <button onClick={() => onEdit(video)} className="p-1.5 text-white/40 hover:text-[#E8B04B] hover:bg-white/5 rounded-sm transition-all">
                <PencilSquareIcon className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(video.id)} className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-900/10 rounded-sm transition-all">
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default Gestion;