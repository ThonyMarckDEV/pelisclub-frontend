import React, { useState, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { mios } from "services/favoritoService";
import MovieCard from "pages/home/MovieCard";
import CatalogoSearch from "pages/home/CatalogoSearch";

const Favoritos = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const response = await mios();
                setItems(response.data || []);
            } catch (err) {
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const itemsFiltrados = useMemo(() => {
        if (!busqueda.trim()) return items;
        const term = busqueda.trim().toLowerCase();
        return items.filter((item) => item.titulo?.toLowerCase().includes(term));
    }, [items, busqueda]);

    return (
        <div className="bg-black min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-white font-black text-xl uppercase tracking-wide flex items-center gap-2">
                        <Heart size={20} className="text-[#E8B04B] fill-[#E8B04B]" />
                        Mis Favoritos
                    </h1>

                    {items.length > 0 && (
                        <CatalogoSearch valorInicial={busqueda} onBuscar={setBusqueda} />
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] rounded-sm bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-white/30 gap-2">
                        <Heart size={40} />
                        <p className="text-sm font-semibold">Todavía no tienes favoritos guardados.</p>
                    </div>
                ) : itemsFiltrados.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {itemsFiltrados.map((item) => (
                            <MovieCard key={`${item.tipo}-${item.id}`} pelicula={item} tipo={item.tipo} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-white/30 gap-2">
                        <Heart size={40} />
                        <p className="text-sm font-semibold">No se encontraron favoritos con "{busqueda}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favoritos;