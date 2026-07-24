import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Play, Info, Star, Film, X } from "lucide-react";
import { peliculas as fetchPeliculas, destacada as fetchDestacada } from "services/publicoService";
import PeliculaDetalleModal from "components/Shared/Modals/pelicula/PeliculaDetalleModal";

const PosterPlaceholder = ({ titulo }) => (
  <div className="w-full h-full bg-gradient-to-b from-[#1A1719] to-black flex items-center justify-center">
    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center px-2">
      {titulo}
    </span>
  </div>
);

const MovieCard = ({ pelicula, onOpen }) => (
  <button
    onClick={() => onOpen(pelicula.slug)}
    className="group relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-[#141215] text-left"
  >
    {pelicula.portada_url ? (
      <img
        src={pelicula.portada_url}
        alt={pelicula.titulo}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      <PosterPlaceholder titulo={pelicula.titulo} />
    )}

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
      <div className="h-9 w-9 rounded-full bg-[#E8B04B] flex items-center justify-center mb-2">
        <Play size={14} className="text-black fill-black ml-0.5" />
      </div>
      <p className="text-white text-xs font-bold truncate">{pelicula.titulo}</p>
      <p className="text-white/50 text-[10px]">{pelicula.anio_estreno}</p>
    </div>
  </button>
);

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const generoSlug = searchParams.get("genero") || "";
  const filtroTipo = searchParams.get("filtro") || "";
  const searchTerm = searchParams.get("search") || "";
  const peliculaSlug = searchParams.get("pelicula") || "";

  const [featured, setFeatured] = useState(null);
  const [catalogo, setCatalogo] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [slugAbierto, setSlugAbierto] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingFeatured(true);
      try {
        const response = await fetchDestacada();
        setFeatured(response.data || null);
      } catch (error) {
        setFeatured(null);
      } finally {
        setLoadingFeatured(false);
      }
    };
    loadFeatured();
  }, []);

  const loadCatalogo = useCallback(async () => {
    setLoadingCatalogo(true);
    try {
      const response = await fetchPeliculas(1, { genero: generoSlug, filtro: filtroTipo, search: searchTerm });
      setCatalogo(response.data || []);
    } catch (error) {
      setCatalogo([]);
    } finally {
      setLoadingCatalogo(false);
    }
  }, [generoSlug, filtroTipo, searchTerm]);

  useEffect(() => {
    loadCatalogo();
  }, [loadCatalogo]);

  // Si llega ?pelicula=slug en la URL (ej. desde una sugerencia del buscador), abre el modal directo
  useEffect(() => {
    if (peliculaSlug) {
      setSlugAbierto(peliculaSlug);
    }
  }, [peliculaSlug]);

  const filtroActivo = generoSlug
    ? { tipo: "Género", valor: generoSlug.replace(/-/g, " ") }
    : filtroTipo
    ? { tipo: "Filtro", valor: filtroTipo.replace(/-/g, " ") }
    : searchTerm
    ? { tipo: "Búsqueda", valor: searchTerm }
    : null;

  const limpiarFiltro = () => navigate("/");

  const cerrarModal = () => {
    setSlugAbierto(null);
    // Si el modal se abrió por query param (?pelicula=), lo limpiamos de la URL al cerrar
    if (peliculaSlug) {
      navigate("/", { replace: true });
    }
  };

  const tituloCatalogo = filtroActivo ? filtroActivo.valor : "Catálogo";

  return (
    <div className="bg-black min-h-screen">
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {featured?.banner_url ? (
            <img
              src={featured.banner_url}
              alt={featured.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-16">
          {loadingFeatured ? (
            <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
          ) : featured ? (
            <>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8B04B] mb-3">
                Película destacada
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white max-w-xl leading-tight mb-4">
                {featured.titulo}
              </h1>
              <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
                {featured.sinopsis}
              </p>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-colors">
                  <Play size={16} className="fill-black" />
                  Reproducir
                </button>
                <button
                  onClick={() => setSlugAbierto(featured.slug)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-bold rounded-sm border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <Info size={16} />
                  Más información
                </button>
              </div>

              <div className="flex items-center gap-4 mt-6 text-[11px] text-white/40 font-semibold">
                <span>{featured.anio_estreno}</span>
                {featured.duracion_minutos && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{featured.duracion_minutos} min</span>
                  </>
                )}
                {featured.calificacion_promedio > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span className="flex items-center gap-1">
                      <Star size={12} className="fill-[#E8B04B] text-[#E8B04B]" />{" "}
                      {Number(featured.calificacion_promedio).toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-2 text-white/30">
              <Film size={40} />
              <p className="text-sm font-semibold">Todavía no hay películas publicadas.</p>
            </div>
          )}
        </div>
      </section>

      {/* CATALOGO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* FILTRO ACTIVO */}
        {filtroActivo && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              {filtroActivo.tipo}:
            </span>
            <span className="flex items-center gap-2 pl-3 pr-1.5 py-1 bg-[#E8B04B]/10 border border-[#E8B04B]/25 text-[#E8B04B] text-xs font-bold uppercase tracking-wide rounded-full capitalize">
              {filtroActivo.valor}
              <button
                onClick={limpiarFiltro}
                className="h-5 w-5 flex items-center justify-center hover:bg-[#E8B04B]/20 rounded-full transition-colors"
                aria-label="Quitar filtro"
              >
                <X size={12} />
              </button>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg uppercase tracking-wide capitalize">
            {tituloCatalogo}
          </h2>
        </div>

        {loadingCatalogo ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-sm bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : catalogo.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {catalogo.map((p) => (
              <MovieCard key={p.id} pelicula={p} onOpen={setSlugAbierto} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-2">
            <Film size={32} />
            <p className="text-sm font-semibold">No hay películas en esta categoría todavía.</p>
          </div>
        )}
      </section>

      {slugAbierto && (
        <PeliculaDetalleModal slug={slugAbierto} onClose={cerrarModal} />
      )}
    </div>
  );
};

export default Home;