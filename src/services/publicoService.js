import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/publico`;

export const peliculas = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page:   page,
        search: filters.search || '',
        genero: filters.genero || '',
        filtro: filters.filtro || '',
    });
    const response = await fetch(`${BASE_URL}/peliculas?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

export const destacada = async () => {
    const response = await fetch(`${BASE_URL}/peliculas/destacada`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

export const generos = async () => {
    const response = await fetch(`${BASE_URL}/generos`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

export const showPelicula = async (slug) => {
    const response = await fetch(`${BASE_URL}/peliculas/${slug}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};

export const linkVideo = (token) => `${BASE_URL}/ir/${token}`;