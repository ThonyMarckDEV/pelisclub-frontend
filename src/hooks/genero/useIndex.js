import { useState, useCallback, useRef, useEffect } from 'react';
import { index, destroy } from 'services/generoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]               = useState(true);
    const [generos, setGeneros]               = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters]               = useState({ search: '' });
    const filtersRef                          = useRef(filters);
    const [alert, setAlert]                   = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete]   = useState(null);

    const fetchGeneros = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setGeneros(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages:  response.last_page,
                total:       response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los géneros'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchGeneros(1); }, [fetchGeneros]);

    const handleAskDelete = (id) => { setIdToDelete(id); setShowConfirm(true); };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Género eliminado correctamente.' });
            await fetchGeneros(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el género'));
        } finally {
            setLoading(false);
            setIdToDelete(null);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchGeneros(1); };
    const handleFilterClear  = () => {
        const reset = { search: '' };
        setFilters(reset); filtersRef.current = reset; fetchGeneros(1);
    };

    return {
        loading, generos, paginationInfo, filters, setFilters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete,
        fetchGeneros, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};