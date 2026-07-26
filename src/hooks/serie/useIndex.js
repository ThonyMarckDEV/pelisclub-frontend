import { useState, useCallback, useRef, useEffect } from 'react';
import { index, destroy, cambiarEstado } from 'services/serieService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const fetchSeries = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setSeries(response.data || []);
            setPaginationInfo({ currentPage: response.current_page, totalPages: response.last_page, total: response.total });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las series'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSeries(1); }, [fetchSeries]);

    const handleAskDelete = (id) => { setIdToDelete(id); setShowConfirm(true); };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Serie eliminada correctamente.' });
            await fetchSeries(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar la serie'));
        } finally {
            setLoading(false);
            setIdToDelete(null);
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            await cambiarEstado(id, nuevoEstado);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            await fetchSeries(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchSeries(1); };
    const handleFilterClear = () => {
        const reset = { search: '', estado: '' };
        setFilters(reset); filtersRef.current = reset; fetchSeries(1);
    };

    return {
        loading, series, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete,
        fetchSeries, handleAskDelete, handleConfirmDelete, handleCambiarEstado,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};