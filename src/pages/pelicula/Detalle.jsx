import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Play, Clock, Film, Youtube, X } from "lucide-react";
import { showPelicula } from "services/publicoService";
import VideoOpcionesModal from "components/Shared/Modals/pelicula/VideoOpcionesModal";
import ComentariosSection from "components/Shared/Modals/pelicula/ComentariosSection";
import EstrellasCalificacion from "pages/calificacion/EstrellasCalificacion";

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
};

const SITE_URL = "https://pelisclub.online";

const PeliculaDetalle = () => {
    const { slug } = useParams();

    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showOpciones, setShowOpciones] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(false);
            window.scrollTo(0, 0);
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

    const embedUrl = getYoutubeEmbed(pelicula?.trailer_url);

    const tieneOpciones =
        (pelicula?.videos_reproduccion?.length || 0) > 0 ||
        (pelicula?.videos_descarga?.length || 0) > 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !pelicula) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 text-white/30">
                <Film size={32} />
                <p className="text-sm font-semibold">No se pudo cargar la información.</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{pelicula.titulo} — Ver online | Pelis Club</title>
                <meta name="description" content={pelicula.sinopsis?.slice(0, 155) || `Mira ${pelicula.titulo} en Pelis Club.`} />
                <link rel="canonical" href={`${SITE_URL}/pelicula/${pelicula.slug}`} />
                <meta property="og:title" content={pelicula.titulo} />
                <meta property="og:description" content={pelicula.sinopsis} />
                <meta property="og:image" content={pelicula.portada_url} />
                <meta property="og:type" content="video.movie" />
                <meta property="og:url" content={`${SITE_URL}/pelicula/${pelicula.slug}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Movie",
                        name: pelicula.titulo,
                        description: pelicula.sinopsis,
                        image: pelicula.portada_url,
                        datePublished: pelicula.anio_estreno ? String(pelicula.anio_estreno) : undefined,
                        genre: pelicula.generos?.map((g) => g.nombre),
                        director: pelicula.director ? { "@type": "Person", name: pelicula.director } : undefined,
                        ...(pelicula.calificacion_promedio > 0 && {
                            aggregateRating: {
                                "@type": "AggregateRating",
                                ratingValue: pelicula.calificacion_promedio,
                                bestRating: "5",
                            },
                        }),
                    })}
                </script>
            </Helmet>

            <div className="bg-black min-h-screen">
                {/* BACKDROP */}
                <div className="relative w-full h-[42vh] md:h-[56vh] overflow-hidden">
                    {pelicula.banner_url ? (
                        <img src={pelicula.banner_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 hidden md:block" />
                </div>

                {/* CONTENIDO — se monta sobre el backdrop, tira hacia arriba */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 md:-mt-40 relative z-10 pb-16">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                        {/* PÓSTER */}
                        <div className="shrink-0 w-32 sm:w-44 md:w-64 mx-auto md:mx-0">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl bg-[#141215]">
                                {pelicula.portada_url ? (
                                    <img src={pelicula.portada_url} alt={pelicula.titulo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Film size={40} className="text-white/10" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COLUMNA DERECHA — todo el contenido fluye aquí adentro, sin bloque separado abajo */}
                        <div className="flex-1 min-w-0 text-center md:text-left pt-2 md:pt-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                                {pelicula.titulo}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs text-white/60 font-semibold mb-4">
                                {pelicula.anio_estreno && <span>{pelicula.anio_estreno}</span>}
                                {pelicula.duracion_minutos && (
                                    <span className="flex items-center gap-1"><Clock size={12} /> {pelicula.duracion_minutos} min</span>
                                )}
                                <span className="px-1.5 py-0.5 border border-white/20 rounded-sm text-[10px]">{pelicula.clasificacion}</span>
                            </div>

                            {pelicula.generos?.length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                                    {pelicula.generos.map((g) => (
                                        <span key={g.slug} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full">
                                            {g.nombre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 mb-5">
                                {tieneOpciones ? (
                                    <button
                                        onClick={() => setShowOpciones(true)}
                                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E8B04B] text-black text-sm font-black uppercase tracking-wide rounded-sm hover:bg-[#f0c06a] transition-colors shadow-lg shadow-[#E8B04B]/20"
                                    >
                                        <Play size={18} className="fill-black" />
                                        Ver ahora
                                    </button>
                                ) : (
                                    <div className="px-8 py-3.5 bg-white/5 border border-white/10 text-white/30 text-xs font-semibold rounded-sm text-center">
                                        Video no disponible todavía
                                    </div>
                                )}

                                {embedUrl && (
                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-sm border border-white/15 transition-colors"
                                    >
                                        <Youtube size={18} />
                                        Ver tráiler
                                    </button>
                                )}
                            </div>

                            <div className="mb-6">
                                <EstrellasCalificacion
                                    peliculaId={pelicula.id}
                                    promedio={pelicula.calificacion_promedio}
                                />
                            </div>

                            {pelicula.sinopsis && (
                                <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-2xl mx-auto md:mx-0">{pelicula.sinopsis}</p>
                            )}

                            {pelicula.director && (
                                <p className="text-xs text-white/40 mb-6">
                                    <span className="text-white/60 font-bold">Director:</span> {pelicula.director}
                                </p>
                            )}

                            {pelicula.actores?.length > 0 && (
                                <div className="mb-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Reparto</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        {pelicula.actores.map((actor, idx) => (
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
                    </div>

                    {/* COMENTARIOS — bloque aparte, alineado bajo el texto en desktop */}
                    <div className="border-t border-white/10 pt-8 mt-10 max-w-3xl mx-auto md:mx-0 md:ml-[19rem]">
                        <ComentariosSection peliculaId={pelicula.id} />
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
                            title={`Tráiler de ${pelicula.titulo}`}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {showOpciones && (
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

export default PeliculaDetalle;