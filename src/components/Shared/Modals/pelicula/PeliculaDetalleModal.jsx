import React, { useState, useEffect } from "react";
import { X, Play, Star, Clock, Film } from "lucide-react";
import { showPelicula } from "services/publicoService";
import VideoOpcionesModal from "components/Shared/Modals/pelicula/VideoOpcionesModal";

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
    const [visible, setVisible] = useState(false); // controla la animación de entrada/salida

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
        // dispara la animación de entrada en el siguiente frame
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => {
            document.body.style.overflow = "";
            cancelAnimationFrame(raf);
        };
    }, []);

    // cierra con animación de salida antes de desmontar
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
            {/* BACKDROP */}
            <div
                className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${
                    visible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* PANEL: posicionado directo con fixed, sin wrapper flex (evita el bug de items-end + overflow-y-auto) */}
            <div
                className={`fixed z-50 pointer-events-auto
                    inset-x-0 bottom-0 w-full
                    max-md:landscape:inset-0 max-md:landscape:m-auto max-md:landscape:w-[95vw] max-md:landscape:h-[95vh]
                    bg-[#0D0C0E]
                    rounded-t-lg max-md:landscape:rounded-sm
                    border border-white/10 shadow-2xl
                    overflow-y-auto
                    h-screen max-md:landscape:h-[95vh]
                    transition-transform duration-300 ease-out
                    ${visible ? "translate-y-0" : "translate-y-full"}
                `}
            >
                    <button
                        onClick={handleClose}
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
                            <div className="relative w-full max-w-4xl mx-auto aspect-video max-md:landscape:aspect-[21/9] max-md:landscape:max-h-[38vh] bg-black">
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
                            <div className="p-6 max-w-4xl mx-auto">
                                <h2 className="text-2xl font-black text-white mb-2">{pelicula.titulo}</h2>

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
                                    <div className="mb-5">
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
                        </>
                    )}
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