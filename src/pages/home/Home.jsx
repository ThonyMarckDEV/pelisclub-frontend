import React from "react";
import { Play, Info, Star } from "lucide-react";

// Placeholder — luego esto viene de tu endpoint /api/peliculas
const FEATURED = {
  titulo: "El último rollo",
  sinopsis:
    "Un proyeccionista descubre el último carrete de una sala de cine a punto de cerrar para siempre.",
  anio_estreno: 2025,
  duracion_minutos: 18,
  banner_url: null,
};

const PELICULAS = [
  { id: 1, titulo: "El último rollo", anio_estreno: 2025, portada_url: null },
  { id: 2, titulo: "Retrato en Talara", anio_estreno: 2024, portada_url: null },
  { id: 3, titulo: "Marea baja", anio_estreno: 2024, portada_url: null },
  { id: 4, titulo: "Sin señal", anio_estreno: 2023, portada_url: null },
  { id: 5, titulo: "La otra orilla", anio_estreno: 2023, portada_url: null },
  { id: 6, titulo: "Domingo", anio_estreno: 2022, portada_url: null },
];

const PosterPlaceholder = ({ titulo }) => (
  <div className="w-full h-full bg-gradient-to-b from-[#1A1719] to-black flex items-center justify-center">
    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center px-2">
      {titulo}
    </span>
  </div>
);

const MovieCard = ({ pelicula }) => (
  <button className="group relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-[#141215] text-left">
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
  return (
    <div className="bg-black min-h-screen">
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {FEATURED.banner_url ? (
            <img
              src={FEATURED.banner_url}
              alt={FEATURED.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8B04B] mb-3">
            Cortometraje destacado
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white max-w-xl leading-tight mb-4">
            {FEATURED.titulo}
          </h1>
          <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
            {FEATURED.sinopsis}
          </p>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-colors">
              <Play size={16} className="fill-black" />
              Reproducir
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-bold rounded-sm border border-white/20 hover:bg-white/20 transition-colors">
              <Info size={16} />
              Más información
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6 text-[11px] text-white/40 font-semibold">
            <span>{FEATURED.anio_estreno}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{FEATURED.duracion_minutos} min</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-[#E8B04B] text-[#E8B04B]" /> 4.8
            </span>
          </div>
        </div>
      </section>

      {/* CATALOGO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg uppercase tracking-wide">
            Catálogo
          </h2>
          <button className="text-[11px] font-bold uppercase tracking-widest text-[#E8B04B] hover:text-[#f0c06a] transition-colors">
            Ver todo
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {PELICULAS.map((p) => (
            <MovieCard key={p.id} pelicula={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;