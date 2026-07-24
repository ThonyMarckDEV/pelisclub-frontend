import React, { useMemo } from 'react';
import { useIndex } from 'hooks/rol/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { ShieldCheckIcon, AdjustmentsHorizontalIcon, CheckBadgeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, roles, paginationInfo, alert, setAlert, fetchRoles,
        isEditing, editLoading, selectedRole, allPermisos,
        checkedPermisos, togglePermission, handleManage, handleSave, handleCancel, isSaving,
        moduleFilter, setModuleFilter
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Rol',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black uppercase text-white">{row.nombre}</span>
                    <span className="text-[10px] text-white/40">{row.descripcion || 'Sin descripción'}</span>
                </div>
            )
        },
        {
            header: 'Permisos Habilitados',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-[#E8B04B]" />
                    <span className="font-bold text-sm bg-[#E8B04B]/10 text-[#E8B04B] px-2 py-0.5 rounded-sm border border-[#E8B04B]/20">
                        {row.permisos_count} permisos
                    </span>
                </div>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <button
                    onClick={() => handleManage(row.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8B04B] text-black hover:bg-[#f0c06a] rounded-sm text-xs font-bold transition-all"
                >
                    <AdjustmentsHorizontalIcon className="w-4 h-4"/>
                    Gestionar
                </button>
            )
        }
    ], [handleManage]);

    const groupedPermisos = useMemo(() => {
        return allPermisos.reduce((acc, perm) => {
            const [modulo] = perm.nombre.split('.');
            if (!acc[modulo]) acc[modulo] = [];
            acc[modulo].push(perm);
            return acc;
        }, {});
    }, [allPermisos]);

    const filteredGroupedPermisos = useMemo(() => {
        if (!moduleFilter) return groupedPermisos;

        const lowerFilter = moduleFilter.toLowerCase();
        const filtered = {};

        Object.entries(groupedPermisos).forEach(([modulo, permisos]) => {
            if (modulo.toLowerCase().includes(lowerFilter)) {
                filtered[modulo] = permisos;
            }
        });

        return filtered;
    }, [groupedPermisos, moduleFilter]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Roles y Permisos" icon={ShieldCheckIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {!isEditing ? (
                <div className="bg-[#0D0C0E] p-4 rounded-sm border border-white/10 mt-6 animate-fade-in">
                    <Table
                        columns={columns}
                        data={roles}
                        loading={loading}
                        pagination={{...paginationInfo, onPageChange: fetchRoles}}
                    />
                </div>
            ) : (
                <div className="bg-[#0D0C0E] rounded-sm border border-white/10 mt-6 flex flex-col overflow-hidden animate-fade-in">

                    {/* Header de Edición */}
                    <div className="bg-black/40 p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="p-2 bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                title="Volver a la lista"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-lg font-black uppercase text-white">
                                    Permisos: {selectedRole?.nombre}
                                </h2>
                                <p className="text-sm text-white/40">
                                    Marca o desmarca las casillas para asignar o revocar accesos.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar módulo..."
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm focus:outline-none focus:border-[#E8B04B] transition-colors w-full md:w-64"
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <span className="text-xs font-bold bg-[#E8B04B]/10 text-[#E8B04B] px-3 py-2 rounded-sm border border-[#E8B04B]/20 whitespace-nowrap">
                                {checkedPermisos.length} activos
                            </span>
                        </div>
                    </div>

                    {/* Contenido (Grid de Permisos) */}
                    <div className="p-6 bg-black min-h-[400px]">
                        {editLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-white/40">
                                <div className="w-8 h-8 border-4 border-white/10 border-t-[#E8B04B] rounded-full animate-spin mb-4"></div>
                                <p className="font-bold text-sm">Cargando configuración...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.keys(filteredGroupedPermisos).length > 0 ? (
                                    Object.entries(filteredGroupedPermisos).map(([modulo, permisos]) => (
                                        <div key={modulo} className="bg-[#0D0C0E] rounded-sm border border-white/10 overflow-hidden h-fit">
                                            <div className="bg-[#B8232B] text-white px-4 py-2 flex items-center justify-between">
                                                <span className="font-black uppercase text-xs tracking-wider">{modulo}</span>
                                                <CheckBadgeIcon className="w-4 h-4 opacity-60" />
                                            </div>
                                            <div className="p-3 space-y-1">
                                                {permisos.map(perm => (
                                                    <label key={perm.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-sm cursor-pointer transition-colors border border-transparent hover:border-white/10">
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedPermisos.includes(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className="mt-0.5 w-4 h-4 accent-[#E8B04B] rounded-sm border-white/20 cursor-pointer"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-white/80">{perm.nombre}</span>
                                                            <span className="text-[10px] text-white/40 leading-tight">{perm.descripcion}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-white/30">
                                        <p className="font-bold">No se encontraron módulos para "{moduleFilter}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer de Acciones */}
                    <div className="p-4 bg-[#0D0C0E] border-t border-white/10 flex justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-2.5 text-sm font-bold text-white/60 bg-white/5 hover:bg-white/10 rounded-sm transition-colors border border-white/10"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || editLoading}
                            className="px-6 py-2.5 text-sm font-bold text-black bg-[#E8B04B] hover:bg-[#f0c06a] rounded-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                            {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;