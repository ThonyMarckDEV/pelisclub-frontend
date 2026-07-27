import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/calificacion`;

export const mia = async ({ peliculaId, serieId }) => {
    const params = new URLSearchParams();
    if (peliculaId) params.set('pelicula_id', peliculaId);
    if (serieId) params.set('serie_id', serieId);

    const response = await fetchWithAuth(`${BASE_URL}/mia?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const store = async ({ peliculaId, serieId, puntuacion }) => {
    const response = await fetchWithAuth(`${BASE_URL}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pelicula_id: peliculaId, serie_id: serieId, puntuacion }),
    });
    return handleResponse(response);
};

export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};