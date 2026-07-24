import React, { useState, useEffect } from "react";
import { X, Star, Clock, Film, Lock } from "lucide-react";
import { showPelicula } from "services/publicoService";

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const PeliculaDetalleModal = ({ slug, onClose }) => {
    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await showPelicula(slug);
                setPelicula(response.data || null);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) load();
    }, [slug]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const embedUrl = getYoutubeEmbed(pelicula?.trailer_url);

    return (
        <>
            {/* BACKDROP - fixed y separado del scroll, cubre pantalla completa siempre */}
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm" onClick={onClose} />

            {/* CONTENEDOR SCROLLEABLE - solo mueve la card, no el fondo */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-start md:items-center justify-center p-0 md:p-4 pointer-events-none">
                <div className="relative w-full md:max-w-2xl bg-[#0D0C0E] md:rounded-sm border border-white/10 shadow-2xl overflow-hidden my-0 md:my-8 pointer-events-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {loading ? (
                        <div className="h-96 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin" />
                        </div>
                    ) : error || !pelicula ? (
                        <div className="h-72 flex flex-col items-center justify-center gap-3 text-white/30">
                            <Film size={32} />
                            <p className="text-sm font-semibold">No se pudo cargar la información.</p>
                        </div>
                    ) : (
                        <>
                            {/* TRAILER / BANNER */}
                            <div className="relative w-full aspect-video bg-black">
                                {embedUrl ? (
                                    <iframe
                                        src={embedUrl}
                                        title={pelicula.titulo}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : pelicula.banner_url ? (
                                    <img src={pelicula.banner_url} alt={pelicula.titulo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black flex items-center justify-center">
                                        <Film size={40} className="text-white/10" />
                                    </div>
                                )}
                                {!embedUrl && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0E] via-black/20 to-transparent" />
                                )}
                            </div>

                            {/* INFO */}
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h2 className="text-2xl font-black text-white">{pelicula.titulo}</h2>
                                    <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-white/5 border border-white/10 text-white/40 rounded-sm">
                                        <Lock size={11} />
                                        Próximamente
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-semibold mb-4">
                                    {pelicula.anio_estreno && <span>{pelicula.anio_estreno}</span>}
                                    {pelicula.duracion_minutos && (
                                        <span className="flex items-center gap-1"><Clock size={12} /> {pelicula.duracion_minutos} min</span>
                                    )}
                                    <span className="px-1.5 py-0.5 border border-white/20 rounded-sm text-[10px]">{pelicula.clasificacion}</span>
                                    {pelicula.calificacion_promedio > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Star size={12} className="fill-[#E8B04B] text-[#E8B04B]" /> {Number(pelicula.calificacion_promedio).toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {pelicula.generos?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {pelicula.generos.map((g) => (
                                            <span key={g.slug} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full">
                                                {g.nombre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {pelicula.sinopsis && (
                                    <p className="text-sm text-white/70 leading-relaxed mb-5">{pelicula.sinopsis}</p>
                                )}

                                {pelicula.director && (
                                    <p className="text-xs text-white/40 mb-5">
                                        <span className="text-white/60 font-bold">Director:</span> {pelicula.director}
                                    </p>
                                )}

                                {pelicula.actores?.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2.5">Reparto</p>
                                        <div className="flex flex-wrap gap-3">
                                            {pelicula.actores.map((actor, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    {actor.foto_url ? (
                                                        <img src={actor.foto_url} alt={actor.nombre} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-[#B8232B]/15 flex items-center justify-center text-[10px] font-black text-[#B8232B]">
                                                            {actor.nombre.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-xs font-bold text-white">{actor.nombre}</span>
                                                        {actor.personaje && (
                                                            <span className="text-[10px] text-white/40">{actor.personaje}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PeliculaDetalleModal;