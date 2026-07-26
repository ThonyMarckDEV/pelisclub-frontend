import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Play, Star, Film, Tv, X } from "lucide-react";
import { peliculas as fetchPeliculas, destacada as fetchDestacada, series as fetchSeries } from "services/publicoService";
import PeliculaDetalleModal from "components/Shared/Modals/pelicula/PeliculaDetalleModal";
import SerieDetalleModal from "components/Shared/Modals/serie/SerieDetalleModal";
import MovieCard from "./MovieCard";
import Footer from "./Footer";
import CatalogoSearch from "./CatalogoSearch";
import InstallAppButton from "components/Shared/InstallAppButton";

const TIPOS = [
  { value: "", label: "Todo" },
  { value: "pelicula", label: "Películas" },
  { value: "serie", label: "Series" },
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const generoSlug = searchParams.get("genero") || "";
  const filtroTipo = searchParams.get("filtro") || "";
  const searchTerm = searchParams.get("search") || "";
  const peliculaSlug = searchParams.get("pelicula") || "";
  const serieSlugParam = searchParams.get("serie") || "";
  const tipoContenido = searchParams.get("tipo") || ""; // '', 'pelicula', 'serie'

  const [featured, setFeatured] = useState(null);
  const [catalogo, setCatalogo] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [slugAbierto, setSlugAbierto] = useState(null);

  const [seriesCatalogo, setSeriesCatalogo] = useState([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [serieSlugAbierto, setSerieSlugAbierto] = useState(null);

  const mostrarPeliculas = tipoContenido === "" || tipoContenido === "pelicula";
  const mostrarSeries = tipoContenido === "" || tipoContenido === "serie";

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
    if (!mostrarPeliculas) {
      setCatalogo([]);
      setLoadingCatalogo(false);
      return;
    }
    setLoadingCatalogo(true);
    try {
      const response = await fetchPeliculas(1, { genero: generoSlug, filtro: filtroTipo, search: searchTerm });
      setCatalogo(response.data || []);
    } catch (error) {
      setCatalogo([]);
    } finally {
      setLoadingCatalogo(false);
    }
  }, [generoSlug, filtroTipo, searchTerm, mostrarPeliculas]);

  useEffect(() => {
    loadCatalogo();
  }, [loadCatalogo]);

  const loadSeries = useCallback(async () => {
    if (!mostrarSeries) {
      setSeriesCatalogo([]);
      setLoadingSeries(false);
      return;
    }
    setLoadingSeries(true);
    try {
      const response = await fetchSeries(1, { genero: generoSlug, search: searchTerm });
      setSeriesCatalogo(response.data || []);
    } catch (error) {
      setSeriesCatalogo([]);
    } finally {
      setLoadingSeries(false);
    }
  }, [generoSlug, searchTerm, mostrarSeries]);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  useEffect(() => {
    if (peliculaSlug) {
      setSlugAbierto(peliculaSlug);
    }
  }, [peliculaSlug]);

  useEffect(() => {
    if (serieSlugParam) {
      setSerieSlugAbierto(serieSlugParam);
    }
  }, [serieSlugParam]);

  // Actualiza ?search= en la URL sin tocar los demás filtros
  const buscarPorNombre = useCallback((texto) => {
    const params = new URLSearchParams(searchParams);

    if (texto) {
      params.set("search", texto);
      params.delete("genero");
      params.delete("filtro");
    } else {
      params.delete("search");
    }

    navigate(`/?${params.toString()}`, { replace: true });
  }, [searchParams, navigate]);

  // Cambia el tipo de contenido a filtrar (Todo/Películas/Series), preservando búsqueda y género
  const cambiarTipo = useCallback((tipo) => {
    const params = new URLSearchParams(searchParams);

    if (tipo) {
      params.set("tipo", tipo);
    } else {
      params.delete("tipo");
    }

    navigate(`/?${params.toString()}`, { replace: true });
  }, [searchParams, navigate]);

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
    if (peliculaSlug) {
      navigate("/", { replace: true });
    }
  };

  const cerrarModalSerie = () => {
    setSerieSlugAbierto(null);
    if (serieSlugParam) {
      navigate("/", { replace: true });
    }
  };

  const tituloCatalogo = filtroActivo ? filtroActivo.valor : "Catálogo";

  return (
    <div className="bg-black min-h-screen flex flex-col">
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
                <button
                  onClick={() => setSlugAbierto(featured.slug)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-colors"
                >
                  <Play size={16} className="fill-black" />
                  Reproducir
                </button>
                <InstallAppButton />
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

      {/* BARRA DE FILTROS Y BUSCADOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 w-full">

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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* SWITCH TODO / PELICULAS / SERIES */}
          <div className="flex items-center gap-2 bg-white/5 rounded-sm p-1 w-fit">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => cambiarTipo(t.value)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm transition-colors ${
                  tipoContenido === t.value
                    ? "bg-[#E8B04B] text-black"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <CatalogoSearch valorInicial={searchTerm} onBuscar={buscarPorNombre} />
        </div>
      </section>

      {/* CATALOGO PELICULAS */}
      {mostrarPeliculas && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <h2 className="text-white font-black text-lg uppercase tracking-wide capitalize mb-5 flex items-center gap-2">
            <Film size={18} className="text-[#E8B04B]" />
            {tipoContenido === "pelicula" ? tituloCatalogo : "Películas"}
          </h2>

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
      )}

      {/* CATALOGO SERIES */}
      {mostrarSeries && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 flex-1 w-full">
          <h2 className="text-white font-black text-lg uppercase tracking-wide mb-5 flex items-center gap-2">
            <Tv size={18} className="text-[#E8B04B]" />
            {tipoContenido === "serie" ? tituloCatalogo : "Series"}
          </h2>

          {loadingSeries ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-sm bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : seriesCatalogo.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {seriesCatalogo.map((s) => (
                <MovieCard
                  key={s.id}
                  pelicula={{ ...s, anio_estreno: s.anio_inicio }}
                  onOpen={setSerieSlugAbierto}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-2">
              <Tv size={32} />
              <p className="text-sm font-semibold">No hay series en esta categoría todavía.</p>
            </div>
          )}
        </section>
      )}

      <Footer />

      {slugAbierto && (
        <PeliculaDetalleModal slug={slugAbierto} onClose={cerrarModal} />
      )}

      {serieSlugAbierto && (
        <SerieDetalleModal slug={serieSlugAbierto} onClose={cerrarModalSerie} />
      )}
    </div>
  );
};

export default Home;