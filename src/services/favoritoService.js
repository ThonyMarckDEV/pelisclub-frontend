import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/favorito`;

export const toggle = async ({ peliculaId, serieId }) => {
    const response = await fetchWithAuth(`${BASE_URL}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pelicula_id: peliculaId, serie_id: serieId }),
    });
    return handleResponse(response);
};

export const contador = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/contador`, { method: 'GET' });
    return handleResponse(response);
};

export const mia = async ({ peliculaId, serieId }) => {
    const params = new URLSearchParams();
    if (peliculaId) params.set('pelicula_id', peliculaId);
    if (serieId) params.set('serie_id', serieId);
    const response = await fetchWithAuth(`${BASE_URL}/mia?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const ids = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/ids`, { method: 'GET' });
    return handleResponse(response);
};

export const mios = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/mios`, { method: 'GET' });
    return handleResponse(response);
};