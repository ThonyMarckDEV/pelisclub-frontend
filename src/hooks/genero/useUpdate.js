import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/generoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setSaving] = useState(true);
    const [saving,  setLoading] = useState(false);
    const [alert,   setAlert]  = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
    });

    useEffect(() => {
        const loadGenero = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre:      data.nombre      || '',
                    descripcion: data.descripcion || '',
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la información del género.'));
            } finally {
                setSaving(false);
            }
        };
        if (id) loadGenero();
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
            setAlert({ type: 'success', message: 'Género actualizado correctamente.' });
            setTimeout(() => navigate('/genero/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el género'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};