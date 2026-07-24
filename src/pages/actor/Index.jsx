import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/actor/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

import {
    UsersIcon, PencilSquareIcon, TrashIcon, FilmIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, actores, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete,
        fetchActores, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar (Nombre/Nacionalidad)', placeholder: 'Ej: Juan Pérez, Peruana...', colSpan: 'col-span-12' },
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Actor',
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.foto_url ? (
                        <img src={row.foto_url} alt={row.nombre} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    ) : (
                        <div className="p-2 rounded-full bg-[#B8232B]/15 border border-[#B8232B]/20 h-10 w-10 flex items-center justify-center">
                            <span className="text-[#B8232B] font-black text-sm uppercase">{row.nombre?.charAt(0)}</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{row.nombre}</span>
                        <span className="text-xs text-white/40">{row.slug}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Nacionalidad',
            render: (row) => (
                <span className="flex items-center gap-1.5 text-sm text-white/70">
                    <GlobeAltIcon className="w-4 h-4 text-white/30" /> {row.nacionalidad || 'No especificada'}
                </span>
            )
        },
        {
            header: 'Películas',
            render: (row) => (
                <span className="flex items-center gap-1 text-sm font-bold text-white">
                    <FilmIcon className="w-4 h-4 text-white/30" /> {row.peliculas_count}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link to={`/actor/editar/${row.id}`}
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
                title="Gestión de Actores"
                icon={UsersIcon}
                buttonText="+ Nuevo Actor"
                buttonLink="/actor/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={actores} loading={loading}
                filterConfig={filterConfig} filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchActores }}
            />

            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de eliminar este actor? Esta acción no se puede deshacer."
                    confirmText="Sí, eliminar" cancelText="Cancelar"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => { setShowConfirm(false); setIdToDelete(null); }}
                />
            )}
        </div>
    );
};

export default Index;