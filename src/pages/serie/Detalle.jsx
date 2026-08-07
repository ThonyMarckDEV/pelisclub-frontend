import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Play, Film, Tv, Youtube, X } from "lucide-react";
import { showSerie, temporadaEpisodios, showEpisodio } from "services/publicoService";
import VideoOpcionesModal from "components/Shared/Modals/pelicula/VideoOpcionesModal";
import EstrellasCalificacion from "pages/calificacion/EstrellasCalificacion";
import BotonFavorito from "components/Shared/Botones/Favorito/BotonFavorito";

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
};

const SITE_URL = "https://pelisclub.online";

const SerieDetalle = () => {
    const { slug } = useParams();

    const [serie, setSerie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    const [temporadaActiva, setTemporadaActiva] = useState(null);
    const [episodios, setEpisodios] = useState([]);
    const [loadingEpisodios, setLoadingEpisodios] = useState(false);

    const [episodioSeleccionado, setEpisodioSeleccionado] = useState(null);
    const [cargandoVideos, setCargandoVideos] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(false);
            window.scrollTo(0, 0);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !serie) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 text-white/30">
                <Tv size={32} />
                <p className="text-sm font-semibold">No se pudo cargar la información.</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{serie.titulo} — Ver online | Pelis Club</title>
                <meta name="description" content={serie.sinopsis?.slice(0, 155) || `Mira ${serie.titulo} en Pelis Club.`} />
                <link rel="canonical" href={`${SITE_URL}/serie/${serie.slug}`} />
                <meta property="og:title" content={serie.titulo} />
                <meta property="og:description" content={serie.sinopsis} />
                <meta property="og:image" content={serie.portada_url} />
                <meta property="og:type" content="video.tv_show" />
                <meta property="og:url" content={`${SITE_URL}/serie/${serie.slug}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TVSeries",
                        name: serie.titulo,
                        description: serie.sinopsis,
                        image: serie.portada_url,
                        startDate: serie.anio_inicio ? String(serie.anio_inicio) : undefined,
                        genre: serie.generos?.map((g) => g.nombre),
                        ...(serie.calificacion_promedio > 0 && {
                            aggregateRating: {
                                "@type": "AggregateRating",
                                ratingValue: serie.calificacion_promedio,
                                bestRating: "5",
                            },
                        }),
                    })}
                </script>
            </Helmet>

            <div className="bg-black min-h-screen">
                {/* BACKDROP */}
                <div className="relative w-full h-[42vh] md:h-[56vh] overflow-hidden">
                    {serie.banner_url ? (
                        <img src={serie.banner_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 hidden md:block" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 md:-mt-40 relative z-10 pb-16">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                        {/* PÓSTER */}
                        <div className="shrink-0 w-32 sm:w-44 md:w-64 mx-auto md:mx-0">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl bg-[#141215]">
                                {serie.portada_url ? (
                                    <img src={serie.portada_url} alt={serie.titulo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Tv size={40} className="text-white/10" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COLUMNA DERECHA — todo el contenido fluye aquí adentro */}
                        <div className="flex-1 min-w-0 text-center md:text-left pt-2 md:pt-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                                {serie.titulo}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs text-white/60 font-semibold mb-4">
                                <span>{serie.anio_inicio}{serie.anio_fin ? ` — ${serie.anio_fin}` : ' — presente'}</span>
                                <span className="px-1.5 py-0.5 border border-white/20 rounded-sm text-[10px]">{serie.clasificacion}</span>
                            </div>

                            {serie.generos?.length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                                    {serie.generos.map((g) => (
                                        <span key={g.slug} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full">
                                            {g.nombre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 mb-5">
                                {embedUrl && (
                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-sm border border-white/15 transition-colors"
                                    >
                                        <Youtube size={18} />
                                        Ver tráiler
                                    </button>
                                )}

                                <BotonFavorito serieId={serie.id} />
                            </div>

                            <div className="mb-6">
                                <EstrellasCalificacion
                                    serieId={serie.id}
                                    promedio={serie.calificacion_promedio}
                                />
                            </div>

                            {serie.sinopsis && (
                                <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-2xl mx-auto md:mx-0">{serie.sinopsis}</p>
                            )}

                            {serie.director && (
                                <p className="text-xs text-white/40 mb-6">
                                    <span className="text-white/60 font-bold">Creador:</span> {serie.director}
                                </p>
                            )}

                            {serie.actores?.length > 0 && (
                                <div className="mb-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Reparto</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        {serie.actores.map((actor, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5">
                                                {actor.foto_url ? (
                                                    <img src={actor.foto_url} alt={actor.nombre} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-[#B8232B]/15 flex items-center justify-center text-xs font-black text-[#B8232B]">
                                                        {actor.nombre.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col leading-tight text-left">
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

                    {/* TEMPORADAS Y EPISODIOS — bloque aparte, ancho completo */}
                    <div className="border-t border-white/10 pt-8 mt-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
                            Toca un episodio para ver
                        </p>

                        {serie.temporadas?.length > 0 ? (
                            <>
                                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
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

                                {loadingEpisodios ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="h-24 bg-white/5 rounded-sm animate-pulse" />
                                        ))}
                                    </div>
                                ) : episodios.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {episodios.map((ep) => (
                                            <button
                                                key={ep.id}
                                                onClick={() => handleAbrirEpisodio(ep)}
                                                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E8B04B]/40 rounded-sm transition-colors text-left group"
                                            >
                                                <div className="relative w-20 h-14 rounded-sm bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {ep.portada_url ? (
                                                        <img src={ep.portada_url} alt={ep.titulo} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Film size={16} className="text-white/20" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Play size={16} className="text-white fill-white" />
                                                    </div>
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

            {/* LIGHTBOX DEL TRÁILER */}
            {showTrailer && embedUrl && (
                <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
                    <button
                        onClick={() => setShowTrailer(false)}
                        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            src={embedUrl}
                            title={`Tráiler de ${serie.titulo}`}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

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

export default SerieDetalle;