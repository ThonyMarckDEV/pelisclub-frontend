import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/actorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setSaving] = useState(true);
    const [saving,  setLoading] = useState(false);
    const [alert,   setAlert]  = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        biografia: '',
        fecha_nacimiento: '',
        nacionalidad: '',
        foto_url: '',
    });

    useEffect(() => {
        const loadActor = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre:            data.nombre            || '',
                    biografia:         data.biografia         || '',
                    fecha_nacimiento:  data.fecha_nacimiento   || '',
                    nacionalidad:      data.nacionalidad       || '',
                    foto_url:          data.foto_url           || '',
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la información del actor.'));
            } finally {
                setSaving(false);
            }
        };
        if (id) loadActor();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Actor actualizado correctamente.' });
            setTimeout(() => navigate('/actor/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el actor'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};