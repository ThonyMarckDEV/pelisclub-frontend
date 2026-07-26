import React, { useState, useEffect } from "react";
import { X, Star, Film, Tv } from "lucide-react";
import { showSerie, temporadaEpisodios, showEpisodio } from "services/publicoService";
import VideoOpcionesModal from "components/Shared/Modals/pelicula/VideoOpcionesModal";

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const SerieDetalleModal = ({ slug, onClose }) => {
    const [serie, setSerie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);

    const [temporadaActiva, setTemporadaActiva] = useState(null);
    const [episodios, setEpisodios] = useState([]);
    const [loadingEpisodios, setLoadingEpisodios] = useState(false);

    const [episodioSeleccionado, setEpisodioSeleccionado] = useState(null);
    const [cargandoVideos, setCargandoVideos] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await showSerie(slug);
                const data = response.data || null;
                setSerie(data);
                if (data?.temporadas?.length > 0) {
                    setTemporadaActiva(data.temporadas[0]);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) load();
    }, [slug]);

    useEffect(() => {
        const cargarEpisodios = async () => {
            if (!temporadaActiva) return;
            setLoadingEpisodios(true);
            try {
                const response = await temporadaEpisodios(temporadaActiva.id);
                setEpisodios(response.data || []);
            } catch (err) {
                setEpisodios([]);
            } finally {
                setLoadingEpisodios(false);
            }
        };
        cargarEpisodios();
    }, [temporadaActiva]);

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
        setTimeout(() => onClose(), 250);
    };

    const handleAbrirEpisodio = async (ep) => {
        setCargandoVideos(true);
        try {
            const response = await showEpisodio(ep.id);
            setEpisodioSeleccionado(response.data);
        } catch (err) {
            // silencioso
        } finally {
            setCargandoVideos(false);
        }
    };

    const embedUrl = getYoutubeEmbed(serie?.trailer_url);

    return (
        <>
            <style>{`
                .oculta-scrollbar::-webkit-scrollbar { display: none; }
                .oculta-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div
                className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-50 flex items-end md:items-stretch justify-center pointer-events-none">
                <div
                    className={`relative w-full bg-[#0D0C0E] rounded-t-lg md:rounded-none border border-white/10 border-b-0 md:border-0 shadow-2xl overflow-hidden pointer-events-auto flex flex-col
                        max-h-[85vh] md:max-h-none md:h-full
                        transition-transform duration-300 ease-out
                        ${visible ? "translate-y-0" : "translate-y-full md:translate-y-0"}
                        ${visible ? "md:opacity-100" : "md:opacity-0"}
                    `}
                >
                    <div className="relative shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-bold text-white truncate pr-8">{serie?.titulo || ""}</h3>
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
                    ) : error || !serie ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/30">
                            <Tv size={32} />
                            <p className="text-sm font-semibold">No se pudo cargar la información.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto md:overflow-hidden oculta-scrollbar md:flex md:min-h-0">

                            {/* COLUMNA IZQUIERDA — info de la serie */}
                            <div className="md:w-2/5 md:h-full md:overflow-y-auto oculta-scrollbar">
                                <div className="max-w-2xl md:max-w-none mx-auto">
                                    <div className="relative w-full aspect-video bg-black">
                                        {embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                title={serie.titulo}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : serie.banner_url ? (
                                            <img src={serie.banner_url} alt={serie.titulo} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black flex items-center justify-center">
                                                <Tv size={40} className="text-white/10" />
                                            </div>
                                        )}
                                        {!embedUrl && <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0E] via-black/20 to-transparent" />}
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-2xl font-black text-white mb-2 md:hidden">{serie.titulo}</h2>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-semibold mb-4">
                                            <span>{serie.anio_inicio}{serie.anio_fin ? ` — ${serie.anio_fin}` : ' — presente'}</span>
                                            <span className="px-1.5 py-0.5 border border-white/20 rounded-sm text-[10px]">{serie.clasificacion}</span>
                                            {serie.calificacion_promedio > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star size={12} className="fill-[#E8B04B] text-[#E8B04B]" /> {Number(serie.calificacion_promedio).toFixed(1)}
                                                </span>
                                            )}
                                        </div>

                                        {serie.generos?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {serie.generos.map((g) => (
                                                    <span key={g.slug} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full">
                                                        {g.nombre}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {serie.sinopsis && <p className="text-sm text-white/70 leading-relaxed mb-5">{serie.sinopsis}</p>}

                                        {serie.director && (
                                            <p className="text-xs text-white/40 mb-5">
                                                <span className="text-white/60 font-bold">Creador:</span> {serie.director}
                                            </p>
                                        )}

                                        {serie.actores?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2.5">Reparto</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {serie.actores.map((actor, idx) => (
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
                                                                {actor.personaje && <span className="text-[10px] text-white/40">{actor.personaje}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* COLUMNA DERECHA — temporadas y episodios */}
                            <div className="md:w-3/5 md:h-full md:overflow-y-auto oculta-scrollbar border-t md:border-t-0 md:border-l border-white/10">
                                <div className="p-6">
                                    {/* SELECTOR DE TEMPORADAS */}
                                    {serie.temporadas?.length > 0 ? (
                                        <>
                                            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                                                {serie.temporadas.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setTemporadaActiva(t)}
                                                        className={`shrink-0 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors border ${
                                                            temporadaActiva?.id === t.id
                                                                ? "bg-[#E8B04B] text-black border-[#E8B04B]"
                                                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                                        }`}
                                                    >
                                                        Temporada {t.numero}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* LISTA DE EPISODIOS */}
                                            {loadingEpisodios ? (
                                                <div className="space-y-2">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="h-16 bg-white/5 rounded-sm animate-pulse" />
                                                    ))}
                                                </div>
                                            ) : episodios.length > 0 ? (
                                                <div className="space-y-2">
                                                    {episodios.map((ep) => (
                                                        <button
                                                            key={ep.id}
                                                            onClick={() => handleAbrirEpisodio(ep)}
                                                            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E8B04B]/40 rounded-sm transition-colors text-left"
                                                        >
                                                            <div className="w-20 h-12 rounded-sm bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                                {ep.portada_url ? (
                                                                    <img src={ep.portada_url} alt={ep.titulo} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Film size={16} className="text-white/20" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-white truncate">
                                                                    {ep.numero}. {ep.titulo}
                                                                </p>
                                                                {ep.duracion_minutos && (
                                                                    <p className="text-[10px] text-white/40">{ep.duracion_minutos} min</p>
                                                                )}
                                                                {ep.sinopsis && (
                                                                    <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{ep.sinopsis}</p>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-white/30 text-center py-8">No hay episodios publicados en esta temporada todavía.</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-xs text-white/30 text-center py-8">No hay temporadas publicadas todavía.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {cargandoVideos && (
                <div className="fixed inset-0 z-[55] bg-black/70 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin" />
                </div>
            )}

            {episodioSeleccionado && (
                <VideoOpcionesModal
                    titulo={`${serie.titulo} — E${episodioSeleccionado.numero}: ${episodioSeleccionado.titulo}`}
                    videosReproduccion={episodioSeleccionado.videos_reproduccion}
                    videosDescarga={episodioSeleccionado.videos_descarga}
                    onClose={() => setEpisodioSeleccionado(null)}
                />
            )}
        </>
    );
};

export default SerieDetalleModal;