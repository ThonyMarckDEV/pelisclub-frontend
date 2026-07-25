import { useState, useEffect, useCallback } from 'react';
import { indexPorPelicula, store, destroy } from 'services/comentarioService';

export const useComentarios = (peliculaId) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cargandoMas, setCargandoMas] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [texto, setTexto] = useState('');
    const [error, setError] = useState(null);

    const [pagina, setPagina] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState(1);
    const [total, setTotal] = useState(0);

    const cargar = useCallback(async () => {
        if (!peliculaId) return;
        setLoading(true);
        try {
            const response = await indexPorPelicula(peliculaId, 1);
            // Ojo: la paginación viene al mismo nivel que "data", no anidada dentro de él
            setComentarios(response.data || []);
            setPagina(response.current_page || 1);
            setUltimaPagina(response.last_page || 1);
            setTotal(response.total || 0);
        } catch (err) {
            setComentarios([]);
        } finally {
            setLoading(false);
        }
    }, [peliculaId]);

    useEffect(() => { cargar(); }, [cargar]);

    const hayMas = pagina < ultimaPagina;

    const cargarMas = async () => {
        if (!hayMas || cargandoMas) return;
        setCargandoMas(true);
        try {
            const siguiente = pagina + 1;
            const response = await indexPorPelicula(peliculaId, siguiente);
            setComentarios((prev) => [...prev, ...(response.data || [])]);
            setPagina(response.current_page || siguiente);
            setUltimaPagina(response.last_page || ultimaPagina);
        } catch (err) {
            // silencioso, el usuario puede reintentar con el botón
        } finally {
            setCargandoMas(false);
        }
    };

    const publicar = async () => {
        if (!texto.trim()) return;
        setEnviando(true);
        setError(null);
        try {
            const response = await store(peliculaId, texto.trim());
            setComentarios((prev) => [response.data, ...prev]);
            setTotal((prev) => prev + 1);
            setTexto('');
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo publicar el comentario.');
        } finally {
            setEnviando(false);
        }
    };

    const eliminar = async (id) => {
        try {
            await destroy(id);
            setComentarios((prev) => prev.filter((c) => c.id !== id));
            setTotal((prev) => Math.max(0, prev - 1));
        } catch (err) {
            // silencioso, o podrías mostrar un toast
        }
    };

    return {
        comentarios, loading, enviando, texto, setTexto, publicar, eliminar, error,
        total, hayMas, cargandoMas, cargarMas,
    };
};