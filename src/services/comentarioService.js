import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api`;

// Público, sin auth
export const indexPorPelicula = async (peliculaId, page = 1) => {
    const response = await fetch(`${BASE_URL}/publico/peliculas/${peliculaId}/comentarios?page=${page}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

// Requiere sesión
export const store = async (peliculaId, comentario) => {
    const response = await fetchWithAuth(`${BASE_URL}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pelicula_id: peliculaId, comentario }),
    });
    return handleResponse(response);
};

export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/comentarios/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};