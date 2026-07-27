import { useState, useEffect, useCallback } from 'react';
import { mia, store } from 'services/calificacionService';

export const useCalificacion = ({ peliculaId, serieId, promedioInicial, isAuthenticated }) => {
    const [miPuntuacion, setMiPuntuacion] = useState(null);
    const [promedio, setPromedio] = useState(promedioInicial || 0);
    const [enviando, setEnviando] = useState(false);
    const [loading, setLoading] = useState(false);

    const cargarMiCalificacion = useCallback(async () => {
        if (!isAuthenticated || (!peliculaId && !serieId)) return;
        setLoading(true);
        try {
            const response = await mia({ peliculaId, serieId });
            setMiPuntuacion(response.data?.puntuacion || null);
        } catch (err) {
            setMiPuntuacion(null);
        } finally {
            setLoading(false);
        }
    }, [peliculaId, serieId, isAuthenticated]);

    useEffect(() => {
        cargarMiCalificacion();
    }, [cargarMiCalificacion]);

    const calificar = async (puntuacion) => {
        setEnviando(true);
        try {
            await store({ peliculaId, serieId, puntuacion });
            setMiPuntuacion(puntuacion);
            // El promedio real se recalcula en el backend; refrescamos con una estimación optimista
            // hasta que el usuario recargue o vuelva a abrir el modal.
            return true;
        } catch (err) {
            return false;
        } finally {
            setEnviando(false);
        }
    };

    return { miPuntuacion, promedio, setPromedio, enviando, loading, calificar };
};