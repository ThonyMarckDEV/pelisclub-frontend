import { useState, useCallback } from 'react';
import { indexPorPelicula, store, update, destroy, toggleActivo } from 'services/videoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const emptyForm = {
    servidor: '',
    tipo: 'reproduccion',
    url: '',
    calidad: '',
    orden: 0,
    es_principal: false,
    activo: true,
};

export const useGestion = () => {
    const [pelicula, setPelicula] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const cargarVideos = useCallback(async (peliculaId) => {
        setLoading(true);
        try {
            const response = await indexPorPelicula(peliculaId);
            setVideos(response.data || []);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los enlaces'));
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSelectPelicula = (p) => {
        setPelicula(p);
        setFormData(emptyForm);
        setEditingId(null);
        if (p) cargarVideos(p.id);
        else setVideos([]);
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEdit = (video) => {
        setEditingId(video.id);
        setFormData({
            servidor: video.servidor,
            tipo: video.tipo,
            url: video.url,
            calidad: video.calidad || '',
            orden: video.orden,
            es_principal: video.es_principal,
            activo: video.activo,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pelicula) return;
        setSaving(true);
        try {
            const payload = { ...formData, pelicula_id: pelicula.id };

            if (editingId) {
                await update(editingId, payload);
                setAlert({ type: 'success', message: 'Enlace actualizado correctamente.' });
            } else {
                await store(payload);
                setAlert({ type: 'success', message: 'Enlace agregado correctamente.' });
            }

            setFormData(emptyForm);
            setEditingId(null);
            await cargarVideos(pelicula.id);
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
            await cargarVideos(pelicula.id);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el enlace'));
        } finally {
            setIdToDelete(null);
        }
    };

    const handleToggleActivo = async (id) => {
        try {
            await toggleActivo(id);
            await cargarVideos(pelicula.id);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        }
    };

    return {
        pelicula, videos, loading, alert, setAlert,
        formData, editingId, saving,
        showConfirm, setShowConfirm, setIdToDelete,
        handleSelectPelicula, handleFormChange, handleEdit, handleCancelEdit,
        handleSubmit, handleAskDelete, handleConfirmDelete, handleToggleActivo,
    };
};