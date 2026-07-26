import { useState, useCallback } from 'react';
import { indexPorPelicula, store, update, destroy, toggleActivo } from 'services/videoService';
import { indexPorEpisodio } from 'services/videoService'; // agrega este helper abajo
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const emptyForm = {
    servidor: '', tipo: 'reproduccion', url: '', calidad: '', orden: 0, es_principal: false, activo: true,
};

export const useGestion = () => {
    const [tipoContenido, setTipoContenido] = useState('pelicula'); // 'pelicula' | 'episodio'
    const [pelicula, setPelicula] = useState(null);
    const [episodio, setEpisodio] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const contenidoActual = tipoContenido === 'pelicula' ? pelicula : episodio;

    const cargarVideos = useCallback(async () => {
        if (!contenidoActual) return;
        setLoading(true);
        try {
            const response = tipoContenido === 'pelicula'
                ? await indexPorPelicula(contenidoActual.id)
                : await indexPorEpisodio(contenidoActual.id);
            setVideos(response.data || []);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los enlaces'));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contenidoActual, tipoContenido]);

    const handleChangeTipoContenido = (tipo) => {
        setTipoContenido(tipo);
        setPelicula(null);
        setEpisodio(null);
        setVideos([]);
        setFormData(emptyForm);
        setEditingId(null);
    };

    const handleSelectPelicula = (p) => {
        setPelicula(p);
        setFormData(emptyForm);
        setEditingId(null);
        if (p) {
            indexPorPelicula(p.id).then(r => setVideos(r.data || [])).catch(() => setVideos([]));
        } else setVideos([]);
    };

    const handleSelectEpisodio = (ep) => {
        setEpisodio(ep);
        setFormData(emptyForm);
        setEditingId(null);
        if (ep) {
            indexPorEpisodio(ep.id).then(r => setVideos(r.data || [])).catch(() => setVideos([]));
        } else setVideos([]);
    };

    const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleEdit = (video) => {
        setEditingId(video.id);
        setFormData({
            servidor: video.servidor, tipo: video.tipo, url: video.url,
            calidad: video.calidad || '', orden: video.orden, es_principal: video.es_principal, activo: video.activo,
        });
    };

    const handleCancelEdit = () => { setEditingId(null); setFormData(emptyForm); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contenidoActual) return;
        setSaving(true);
        try {
            const payload = {
                ...formData,
                ...(tipoContenido === 'pelicula' ? { pelicula_id: contenidoActual.id } : { episodio_id: contenidoActual.id }),
            };

            if (editingId) {
                await update(editingId, payload);
                setAlert({ type: 'success', message: 'Enlace actualizado correctamente.' });
            } else {
                await store(payload);
                setAlert({ type: 'success', message: 'Enlace agregado correctamente.' });
            }

            setFormData(emptyForm);
            setEditingId(null);
            await cargarVideos();
        } catch (err) {
            setAlert(handleApiError(err, 'Error al guardar el enlace'));
        } finally {
            setSaving(false);
        }
    };

    const handleAskDelete = (id) => { setIdToDelete(id); setShowConfirm(true); };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Enlace eliminado correctamente.' });
            await cargarVideos();
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el enlace'));
        } finally {
            setIdToDelete(null);
        }
    };

    const handleToggleActivo = async (id) => {
        try {
            await toggleActivo(id);
            await cargarVideos();
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        }
    };

    return {
        tipoContenido, handleChangeTipoContenido,
        pelicula, episodio, contenidoActual,
        videos, loading, alert, setAlert,
        formData, editingId, saving,
        showConfirm, setShowConfirm, setIdToDelete,
        handleSelectPelicula, handleSelectEpisodio, handleFormChange, handleEdit, handleCancelEdit,
        handleSubmit, handleAskDelete, handleConfirmDelete, handleToggleActivo,
    };
};