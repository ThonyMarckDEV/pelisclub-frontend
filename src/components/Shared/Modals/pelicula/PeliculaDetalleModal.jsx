import React, { useState, useEffect } from "react";
import { X, Play, Clock, Film } from "lucide-react";
import { showPelicula } from "services/publicoService";
import VideoOpcionesModal from "components/Shared/Modals/pelicula/VideoOpcionesModal";
import ComentariosSection from "./ComentariosSection";
import EstrellasCalificacion from "pages/calificacion/EstrellasCalificacion";

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const PeliculaDetalleModal = ({ slug, onClose }) => {
    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showOpciones, setShowOpciones] = useState(false);
    const [visible, setVisible] = useState(false);

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
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => {
            document.body.style.overflow = "";
            cancelAnimationFrame(raf);
        };
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 250);
    };

    const embedUrl = getYoutubeEmbed(pelicula?.trailer_url);

    const tieneOpciones =
        (pelicula?.videos_reproduccion?.length || 0) > 0 ||
        (pelicula?.videos_descarga?.length || 0) > 0;

    return (
        <>
            <style>{`
                .oculta-scrollbar::-webkit-scrollbar { display: none; }
                .oculta-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* BACKDROP */}
            <div
                className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${
                    visible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* WRAPPER — móvil: pegado abajo. desktop: pantalla completa, borde a borde */}
            <div className="fixed inset-0 z-50 flex items-end md:items-stretch justify-center pointer-events-none">
                <div
                    className={`relative w-full md:w-full bg-[#0D0C0E] rounded-t-lg md:rounded-none border border-white/10 border-b-0 md:border-0 shadow-2xl overflow-hidden pointer-events-auto flex flex-col
                        max-h-[85vh] md:max-h-none md:h-full
                        transition-transform duration-300 ease-out
                        ${visible ? "translate-y-0" : "translate-y-full md:translate-y-0"}
                        ${visible ? "md:opacity-100" : "md:opacity-0"}
                    `}
                >
                    {/* HEADER — fijo arriba, siempre visible */}
                    <div className="relative shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-bold text-white truncate pr-8">
                            {pelicula?.titulo || ""}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 z-20 h-9 w-9 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin" />
                        </div>
                    ) : error || !pelicula ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/30">
                            <Film size={32} />
                            <p className="text-sm font-semibold">No se pudo cargar la información.</p>
                        </div>
                    ) : (
                        <>
                            {/* BODY — móvil: una columna, scroll único. desktop: dos columnas, cada una con su scroll */}
                            <div className="flex-1 overflow-y-auto md:overflow-hidden oculta-scrollbar md:flex md:min-h-0">

                                {/* COLUMNA IZQUIERDA — info de la película */}
                                <div className="md:w-3/5 md:h-full md:overflow-y-auto oculta-scrollbar">
                                    <div className="max-w-2xl md:max-w-none mx-auto">
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
                                            <h2 className="text-2xl font-black text-white mb-2 md:hidden">{pelicula.titulo}</h2>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-semibold mb-4">
                                                {pelicula.anio_estreno && <span>{pelicula.anio_estreno}</span>}
                                                {pelicula.duracion_minutos && (
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {pelicula.duracion_minutos} min</span>
                                                )}
                                                <span className="px-1.5 py-0.5 border border-white/20 rounded-sm text-[10px]">{pelicula.clasificacion}</span>
                                            </div>

                                            {/* CALIFICACIÓN — promedio + estrellas interactivas */}
                                            <div className="mb-4">
                                                <EstrellasCalificacion
                                                    peliculaId={pelicula.id}
                                                    promedio={pelicula.calificacion_promedio}
                                                />
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

                                        {/* Móvil: comentarios debajo, dentro del mismo scroll. pb-4 para separación mínima del footer fijo */}
                                        <div className="md:hidden px-6 pb-4">
                                            <ComentariosSection peliculaId={pelicula.id} />
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA — solo desktop, comentarios con su propio scroll */}
                                <div className="hidden md:block md:w-2/5 md:h-full md:overflow-y-auto oculta-scrollbar border-l border-white/10">
                                    <div className="p-6">
                                        <ComentariosSection peliculaId={pelicula.id} />
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER — fijo abajo, solo el ancho de la columna izquierda en desktop */}
                            <div className="shrink-0 p-4 border-t border-white/10 bg-[#0D0C0E] md:flex">
                                <div className="max-w-2xl md:max-w-none mx-auto md:w-3/5">
                                    {tieneOpciones ? (
                                        <button
                                            onClick={() => setShowOpciones(true)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#E8B04B] text-black text-sm font-bold rounded-sm hover:bg-[#f0c06a] transition-colors"
                                        >
                                            <Play size={16} className="fill-black" />
                                            Reproducir
                                        </button>
                                    ) : (
                                        <div className="w-full text-center py-3 bg-white/5 border border-white/10 text-white/30 text-xs font-semibold rounded-sm">
                                            Video no disponible todavía
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showOpciones && pelicula && (
                <VideoOpcionesModal
                    titulo={pelicula.titulo}
                    videosReproduccion={pelicula.videos_reproduccion}
                    videosDescarga={pelicula.videos_descarga}
                    onClose={() => setShowOpciones(false)}
                />
            )}
        </>
    );
};

export default PeliculaDetalleModal;