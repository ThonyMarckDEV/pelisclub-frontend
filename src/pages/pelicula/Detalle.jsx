import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Play, Clock, Film } from "lucide-react";
import { showPelicula } from "services/publicoService";
import VideoOpcionesModal from "components/Shared/Modals/pelicula/VideoOpcionesModal";
import ComentariosSection from "components/Shared/Modals/pelicula/ComentariosSection";
import EstrellasCalificacion from "pages/calificacion/EstrellasCalificacion";

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const SITE_URL = "https://pelisclub.online";

const PeliculaDetalle = () => {
    const { slug } = useParams();

    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showOpciones, setShowOpciones] = useState(false);

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

    return (
        <>
            {pelicula && (
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
            )}

            <div className="min-h-screen bg-black">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin" />
                    </div>
                ) : error || !pelicula ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-white/30 py-24">
                        <Film size={32} />
                        <p className="text-sm font-semibold">No se pudo cargar la información.</p>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
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
                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white/70 text-[10px] font-bold uppercase tracking-widest rounded-sm pointer-events-none">
                                {embedUrl ? "Tráiler" : "Vista previa"}
                            </span>
                        </div>

                        {/* INFO */}
                        <div className="p-6">
                            <h1 className="text-2xl font-black text-white mb-2">{pelicula.titulo}</h1>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-semibold mb-4">
                                {pelicula.anio_estreno && <span>{pelicula.anio_estreno}</span>}
                                {pelicula.duracion_minutos && (
                                    <span className="flex items-center gap-1"><Clock size={12} /> {pelicula.duracion_minutos} min</span>
                                )}
                                <span className="px-1.5 py-0.5 border border-white/20 rounded-sm text-[10px]">{pelicula.clasificacion}</span>
                            </div>

                            {tieneOpciones ? (
                                <button
                                    onClick={() => setShowOpciones(true)}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 mb-5 bg-[#E8B04B] text-black text-sm font-black uppercase tracking-wide rounded-sm hover:bg-[#f0c06a] transition-colors shadow-lg shadow-[#E8B04B]/10"
                                >
                                    <Play size={18} className="fill-black" />
                                    Ver ahora
                                </button>
                            ) : (
                                <div className="w-full text-center px-8 py-3.5 mb-5 bg-white/5 border border-white/10 text-white/30 text-xs font-semibold rounded-sm">
                                    Video no disponible todavía
                                </div>
                            )}

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
                                <div className="mb-2">
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

                        <div className="px-6 pb-10">
                            <ComentariosSection peliculaId={pelicula.id} />
                        </div>
                    </div>
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

export default PeliculaDetalle;