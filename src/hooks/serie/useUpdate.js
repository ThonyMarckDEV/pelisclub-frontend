import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/serieService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setSaving] = useState(true);
    const [saving, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '', sinopsis: '', director: '', anio_inicio: '', anio_fin: '',
        clasificacion: 'TP', portada_url: '', banner_url: '', trailer_url: '',
        estado: 'borrador', destacada: false, generos: [], actores: [],
    });

    useEffect(() => {
        const loadSerie = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    titulo: data.titulo || '', sinopsis: data.sinopsis || '', director: data.director || '',
                    anio_inicio: data.anio_inicio || '', anio_fin: data.anio_fin || '',
                    clasificacion: data.clasificacion || 'TP', portada_url: data.portada_url || '',
                    banner_url: data.banner_url || '', trailer_url: data.trailer_url || '',
                    estado: data.estado || 'borrador', destacada: data.destacada || false,
                    generos: data.generos || [], actores: data.actores || [],
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la información de la serie.'));
            } finally {
                setSaving(false);
            }
        };
        if (id) loadSerie();
    }, [id]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            const payload = {
                ...formData,
                generos: formData.generos.map(g => g.id),
                actores: formData.actores.map(a => ({ id: a.id, personaje: a.personaje, orden: a.orden })),
            };
            await update(id, payload);
            setAlert({ type: 'success', message: 'Serie actualizada correctamente.' });
            setTimeout(() => navigate('/serie/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar la serie'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};