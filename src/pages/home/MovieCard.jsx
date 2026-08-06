import React from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import PosterPlaceholder from "./PosterPlaceholder";

const MovieCard = ({ pelicula, tipo = "pelicula" }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/${tipo}/${pelicula.slug}`)}
            className="group relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-[#141215] text-left"
        >
            {pelicula.portada_url ? (
                <img
                    src={pelicula.portada_url}
                    alt={pelicula.titulo}
                    loading="lazy"
                    decoding="async"
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
};

export default MovieCard;