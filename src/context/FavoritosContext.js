import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as favoritoService from 'services/favoritoService';
import { useAuth } from 'context/AuthContext';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [contador, setContador] = useState(0);
    const [peliculaIds, setPeliculaIds] = useState(new Set());
    const [serieIds, setSerieIds] = useState(new Set());

    const cargarTodo = useCallback(async () => {
        if (!isAuthenticated) {
            setContador(0);
            setPeliculaIds(new Set());
            setSerieIds(new Set());
            return;
        }
        try {
            const [resContador, resIds] = await Promise.all([
                favoritoService.contador(),
                favoritoService.ids(),
            ]);
            setContador(resContador.data?.total || 0);
            setPeliculaIds(new Set(resIds.data?.peliculas || []));
            setSerieIds(new Set(resIds.data?.series || []));
        } catch (err) {
            // silencioso
        }
    }, [isAuthenticated]);

    useEffect(() => {
        cargarTodo();
    }, [cargarTodo]);

    const esFavorito = useCallback((id, tipo) => {
        return tipo === 'serie' ? serieIds.has(id) : peliculaIds.has(id);
    }, [peliculaIds, serieIds]);

    const toggleFavorito = useCallback(async ({ peliculaId, serieId }) => {
        const response = await favoritoService.toggle({ peliculaId, serieId });
        const nuevoEstado = response.data?.favorito;

        // Actualiza el set local sin tener que recargar todo desde el backend
        if (peliculaId) {
            setPeliculaIds((prev) => {
                const next = new Set(prev);
                nuevoEstado ? next.add(peliculaId) : next.delete(peliculaId);
                return next;
            });
        } else if (serieId) {
            setSerieIds((prev) => {
                const next = new Set(prev);
                nuevoEstado ? next.add(serieId) : next.delete(serieId);
                return next;
            });
        }

        setContador((prev) => Math.max(0, prev + (nuevoEstado ? 1 : -1)));

        return nuevoEstado;
    }, []);

    return (
        <FavoritosContext.Provider value={{ contador, esFavorito, toggleFavorito, recargar: cargarTodo }}>
            {children}
        </FavoritosContext.Provider>
    );
};

export const useFavoritos = () => useContext(FavoritosContext);