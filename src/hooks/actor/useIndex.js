import { useState, useCallback, useRef, useEffect } from 'react';
import { index, destroy } from 'services/actorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]               = useState(true);
    const [actores, setActores]               = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters]               = useState({ search: '' });
    const filtersRef                          = useRef(filters);
    const [alert, setAlert]                   = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete]   = useState(null);

    const fetchActores = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setActores(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages:  response.last_page,
                total:       response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los actores'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchActores(1); }, [fetchActores]);

    const handleAskDelete = (id) => { setIdToDelete(id); setShowConfirm(true); };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Actor eliminado correctamente.' });
            await fetchActores(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el actor'));
        } finally {
            setLoading(false);
            setIdToDelete(null);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchActores(1); };
    const handleFilterClear  = () => {
        const reset = { search: '' };
        setFilters(reset); filtersRef.current = reset; fetchActores(1);
    };

    return {
        loading, actores, paginationInfo, filters, setFilters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete,
        fetchActores, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};