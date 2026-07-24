import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/generoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Género registrado exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/genero/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar el género'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};