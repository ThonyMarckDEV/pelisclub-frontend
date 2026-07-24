import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/genero/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

import {
    TagIcon, PencilSquareIcon, TrashIcon, FilmIcon, CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, generos, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete,
        fetchGeneros, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar (Nombre/Descripción)', placeholder: 'Ej: Drama, Terror...', colSpan: 'col-span-12' },
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Género',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-sm bg-[#B8232B]/15 border border-[#B8232B]/20">
                        <TagIcon className="w-5 h-5 text-[#B8232B]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{row.nombre}</span>
                        <span className="text-xs text-slate-500">{row.slug}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Descripción',
            render: (row) => (
                <span className="text-sm text-slate-600">{row.descripcion || 'Sin descripción'}</span>
            )
        },
        {
            header: 'Películas',
            render: (row) => (
                <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                    <FilmIcon className="w-4 h-4 text-slate-400" /> {row.peliculas_count}
                </span>
            )
        },
        {
            header: 'Registro',
            render: (row) => (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4"/> {row.created_at?.split(' ')[0]}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link to={`/genero/editar/${row.id}`}
                        className="p-2 text-white/50 hover:text-[#E8B04B] hover:bg-white/5 rounded-sm transition-all">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleAskDelete(row.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-900/10 rounded-sm transition-all">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Gestión de Géneros"
                icon={TagIcon}
                buttonText="+ Nuevo Género"
                buttonLink="/genero/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={generos} loading={loading}
                filterConfig={filterConfig} filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchGeneros }}
            />

            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de eliminar este género? Esta acción no se puede deshacer."
                    confirmText="Sí, eliminar" cancelText="Cancelar"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => { setShowConfirm(false); setIdToDelete(null); }}
                />
            )}
        </div>
    );
};

export default Index;