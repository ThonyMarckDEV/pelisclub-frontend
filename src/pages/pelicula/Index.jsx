import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/pelicula/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

import {
    FilmIcon, PencilSquareIcon, TrashIcon, StarIcon, EyeIcon, ClockIcon
} from '@heroicons/react/24/outline';

const ESTADO_OPTIONS = [
    { value: '', label: 'Todos' },
    { value: 'borrador', label: 'Borrador' },
    { value: 'procesando', label: 'Procesando' },
    { value: 'publicado', label: 'Publicado' },
];

const ESTADO_STYLES = {
    publicado:  'bg-[#1D9E75]/10 text-[#5DCAA5] border-[#1D9E75]/30',
    procesando: 'bg-[#E8B04B]/10 text-[#E8B04B] border-[#E8B04B]/30',
    borrador:   'bg-white/5 text-white/40 border-white/10',
};

const Index = () => {
    const {
        loading, peliculas, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete,
        fetchPeliculas, handleAskDelete, handleConfirmDelete, handleCambiarEstado,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar (Título/Director)', placeholder: 'Ej: El último rollo...', colSpan: 'col-span-12 md:col-span-7' },
        { name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-3', options: ESTADO_OPTIONS },
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Película',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-14 rounded-sm bg-black border border-white/10 overflow-hidden shrink-0">
                        {row.portada_url ? (
                            <img src={row.portada_url} alt={row.titulo} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FilmIcon className="w-4 h-4 text-white/20" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                            {row.titulo}
                            {row.destacada && <StarIcon className="w-3.5 h-3.5 text-[#E8B04B] fill-[#E8B04B]" />}
                        </span>
                        <span className="text-xs text-white/40">
                            {row.generos?.join(', ') || 'Sin géneros'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Detalles',
            render: (row) => (
                <div className="flex flex-col gap-1 text-xs text-white/60">
                    <span>{row.anio_estreno || 'S/A'} · {row.clasificacion}</span>
                    {row.duracion_minutos && (
                        <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {row.duracion_minutos} min</span>
                    )}
                </div>
            )
        },
        {
            header: 'Vistas',
            render: (row) => (
                <span className="flex items-center gap-1 text-sm font-bold text-white">
                    <EyeIcon className="w-4 h-4 text-white/30" /> {row.vistas}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <select
                    value={row.estado}
                    onChange={(e) => handleCambiarEstado(row.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-sm border cursor-pointer bg-transparent ${ESTADO_STYLES[row.estado]}`}
                >
                    <option value="borrador" className="bg-[#111013] text-white">Borrador</option>
                    <option value="procesando" className="bg-[#111013] text-white">Procesando</option>
                    <option value="publicado" className="bg-[#111013] text-white">Publicado</option>
                </select>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link to={`/pelicula/editar/${row.id}`}
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
    ], [handleAskDelete, handleCambiarEstado]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Gestión de Películas"
                icon={FilmIcon}
                buttonText="+ Nueva Película"
                buttonLink="/pelicula/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={peliculas} loading={loading}
                filterConfig={filterConfig} filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchPeliculas }}
            />

            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de eliminar esta película? Esta acción no se puede deshacer."
                    confirmText="Sí, eliminar" cancelText="Cancelar"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => { setShowConfirm(false); setIdToDelete(null); }}
                />
            )}
        </div>
    );
};

export default Index;