import { useState, useCallback } from 'react';
import { indexPorSerie, store as storeTemporada, update as updateTemporada, destroy as destroyTemporada } from 'services/temporadaService';
import { indexPorTemporada, store as storeEpisodio, update as updateEpisodio, destroy as destroyEpisodio } from 'services/episodioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const emptyTemporada = { numero: '', titulo: '', sinopsis: '', portada_url: '', anio_estreno: '' };
const emptyEpisodio = { numero: '', titulo: '', sinopsis: '', duracion_minutos: '', portada_url: '', estado: 'borrador' };

export const useGestion = () => {
    const [serie, setSerie] = useState(null);
    const [temporadas, setTemporadas] = useState([]);
    const [temporadaSeleccionada, setTemporadaSeleccionada] = useState(null);
    const [episodios, setEpisodios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formTemporada, setFormTemporada] = useState(emptyTemporada);
    const [editingTemporadaId, setEditingTemporadaId] = useState(null);

    const [formEpisodio, setFormEpisodio] = useState(emptyEpisodio);
    const [editingEpisodioId, setEditingEpisodioId] = useState(null);
    const [saving, setSaving] = useState(false);

    const cargarTemporadas = useCallback(async (serieId) => {
        setLoading(true);
        try {
            const response = await indexPorSerie(serieId);
            setTemporadas(response.data || []);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar temporadas'));
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarEpisodios = useCallback(async (temporadaId) => {
        setLoading(true);
        try {
            const response = await indexPorTemporada(temporadaId);
            setEpisodios(response.data || []);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar episodios'));
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSelectSerie = (s) => {
        setSerie(s);
        setTemporadaSeleccionada(null);
        setEpisodios([]);
        setFormTemporada(emptyTemporada);
        setEditingTemporadaId(null);
        if (s) cargarTemporadas(s.id);
        else setTemporadas([]);
    };

    const handleSelectTemporada = (t) => {
        setTemporadaSeleccionada(t);
        setFormEpisodio(emptyEpisodio);
        setEditingEpisodioId(null);
        if (t) cargarEpisodios(t.id);
        else setEpisodios([]);
    };

    // --- TEMPORADAS ---
    const handleFormTemporadaChange = (field, value) => setFormTemporada(prev => ({ ...prev, [field]: value }));

    const handleEditTemporada = (t) => {
        setEditingTemporadaId(t.id);
        setFormTemporada({ numero: t.numero, titulo: t.titulo || '', sinopsis: t.sinopsis || '', portada_url: t.portada_url || '', anio_estreno: t.anio_estreno || '' });
    };

    const handleCancelEditTemporada = () => { setEditingTemporadaId(null); setFormTemporada(emptyTemporada); };

    const handleSubmitTemporada = async (e) => {
        e.preventDefault();
        if (!serie) return;
        setSaving(true);
        try {
            const payload = { ...formTemporada, serie_id: serie.id };
            if (editingTemporadaId) {
                await updateTemporada(editingTemporadaId, payload);
                setAlert({ type: 'success', message: 'Temporada actualizada correctamente.' });
            } else {
                await storeTemporada(payload);
                setAlert({ type: 'success', message: 'Temporada agregada correctamente.' });
            }
            setFormTemporada(emptyTemporada);
            setEditingTemporadaId(null);
            await cargarTemporadas(serie.id);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al guardar la temporada'));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTemporada = async (id) => {
        try {
            await destroyTemporada(id);
            setAlert({ type: 'success', message: 'Temporada eliminada correctamente.' });
            if (temporadaSeleccionada?.id === id) handleSelectTemporada(null);
            await cargarTemporadas(serie.id);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar la temporada'));
        }
    };

    // --- EPISODIOS ---
    const handleFormEpisodioChange = (field, value) => setFormEpisodio(prev => ({ ...prev, [field]: value }));

    const handleEditEpisodio = (ep) => {
        setEditingEpisodioId(ep.id);
        setFormEpisodio({
            numero: ep.numero, titulo: ep.titulo, sinopsis: ep.sinopsis || '',
            duracion_minutos: ep.duracion_minutos || '', portada_url: ep.portada_url || '', estado: ep.estado,
        });
    };

    const handleCancelEditEpisodio = () => { setEditingEpisodioId(null); setFormEpisodio(emptyEpisodio); };

    const handleSubmitEpisodio = async (e) => {
        e.preventDefault();
        if (!temporadaSeleccionada) return;
        setSaving(true);
        try {
            const payload = { ...formEpisodio, temporada_id: temporadaSeleccionada.id };
            if (editingEpisodioId) {
                await updateEpisodio(editingEpisodioId, payload);
                setAlert({ type: 'success', message: 'Episodio actualizado correctamente.' });
            } else {
                await storeEpisodio(payload);
                setAlert({ type: 'success', message: 'Episodio agregado correctamente.' });
            }
            setFormEpisodio(emptyEpisodio);
            setEditingEpisodioId(null);
            await cargarEpisodios(temporadaSeleccionada.id);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al guardar el episodio'));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEpisodio = async (id) => {
        try {
            await destroyEpisodio(id);
            setAlert({ type: 'success', message: 'Episodio eliminado correctamente.' });
            await cargarEpisodios(temporadaSeleccionada.id);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el episodio'));
        }
    };

    return {
        serie, temporadas, temporadaSeleccionada, episodios, loading, alert, setAlert,
        formTemporada, editingTemporadaId, formEpisodio, editingEpisodioId, saving,
        handleSelectSerie, handleSelectTemporada,
        handleFormTemporadaChange, handleEditTemporada, handleCancelEditTemporada, handleSubmitTemporada, handleDeleteTemporada,
        handleFormEpisodioChange, handleEditEpisodio, handleCancelEditEpisodio, handleSubmitEpisodio, handleDeleteEpisodio,
    };
};