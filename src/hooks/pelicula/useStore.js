import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/peliculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const initialState = {
    titulo: '', sinopsis: '', director: '', anio_estreno: '', duracion_minutos: '',
    clasificacion: 'TP', portada_url: '', banner_url: '', trailer_url: '',
    estado: 'borrador', destacada: false,
    generos: [], actores: [],
};

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);
    const [formData, setFormData] = useState(initialState);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

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
            await store(payload);
            setAlert({ type: 'success', message: 'Película registrada exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/pelicula/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar la película'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};