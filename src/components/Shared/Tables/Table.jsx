import React from 'react';
import Pagination from '../Pagination';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Table = ({ 
    columns, 
    data, 
    loading = false, 
    pagination = null, 
    filterConfig = [], 
    filters = {},       
    onFilterChange,    
    onFilterSubmit,    
    onFilterClear,     
    searchPlaceholder = "Buscar..."
}) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onFilterSubmit();
        }
    };

    const renderFilterInput = (config) => {
        const baseClass = "block w-full px-3 py-2 border border-slate-300 text-secondary rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-50 transition-all";

        if (config.type === 'custom' || config.render) {
            return config.render ? config.render() : null;
        }

        switch (config.type) {
            case 'select':
                return (
                    <select
                        name={config.name}
                        value={filters[config.name] || ''}
                        onChange={(e) => onFilterChange(config.name, e.target.value)}
                        disabled={loading}
                        className={`${baseClass} bg-white cursor-pointer h-[38px]`}
                    >
                        {config.options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="text-secondary">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        name={config.name}
                        value={filters[config.name] || ''}
                        onChange={(e) => onFilterChange(config.name, e.target.value)}
                        disabled={loading}
                        className={`${baseClass} h-[38px]`}
                    />
                );
            case 'text':
            default:
                return (
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            name={config.name}
                            placeholder={config.placeholder || searchPlaceholder}
                            className={`${baseClass} pl-10 h-[38px]`}
                            value={filters[config.name] || ''}
                            onChange={(e) => onFilterChange(config.name, e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            
            {/* --- SECCIÓN DE FILTROS --- */}
            {filterConfig.length > 0 && (
                <div className="bg-primary-light/50 p-4 rounded-xl border border-primary/30">
                    <div className="grid grid-cols-12 gap-4 items-end">
                        {filterConfig.map((config, index) => (
                            <div key={index} className={config.colSpan || "col-span-12 md:col-span-3"}>
                                {config.label && config.type !== 'custom' && (
                                    <label className="block text-xs font-bold text-secondary/70 uppercase tracking-wide mb-1">
                                        {config.label}
                                    </label>
                                )}
                                {renderFilterInput(config)}
                            </div>
                        ))}
                        <div className="col-span-12 md:col-span-2 flex gap-2">
                            <button
                                onClick={onFilterSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 h-[38px] uppercase tracking-wide"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4" />
                                Buscar
                            </button>

                            <button 
                                type="button"
                                onClick={onFilterClear}
                                disabled={loading}
                                className="px-3 py-2 text-secondary/60 hover:text-red-600 hover:bg-red-50 rounded-lg border border-primary/30 bg-white transition-all h-[38px]"
                                title="Limpiar filtros"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TABLA RESPONSIVA (CARDS EN MÓVIL) --- */}
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <table className="min-w-full md:divide-y md:divide-primary/20 w-full block md:table rounded-xl overflow-hidden">
                    
                    <thead className="hidden md:table-header-group bg-secondary">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-3.5 text-left text-xs font-bold text-primary uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="block md:table-row-group md:divide-y md:divide-primary/15 bg-transparent md:bg-white">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr 
                                    key={row.id || rowIndex} 
                                    className="block md:table-row mb-4 md:mb-0 border border-primary/20 md:border-none rounded-xl md:rounded-none shadow-sm md:shadow-none bg-white md:hover:bg-primary-light/40 transition-colors"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td 
                                            key={`${rowIndex}-${colIndex}`} 
                                            className="block md:table-cell px-4 py-3 md:px-6 md:py-4 text-sm text-secondary border-b border-primary/10 last:border-b-0 md:border-b-0 flex justify-between md:block items-center"
                                        >
                                            <span className="font-bold text-secondary/50 text-xs uppercase md:hidden mr-2">
                                                {col.header}
                                            </span>

                                            <span className="text-right md:text-left truncate max-w-[70%] md:max-w-none">
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr className="block md:table-row bg-white rounded-xl border border-primary/20 md:border-none p-4 md:p-0">
                                <td colSpan={columns.length} className="block md:table-cell px-6 py-12 text-center text-secondary/40">
                                    <div className="flex flex-col items-center gap-2">
                                        <MagnifyingGlassIcon className="w-8 h-8 opacity-30" />
                                        <span className="font-medium">No se encontraron registros</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- FOOTER: TOTAL REGISTROS Y PAGINACIÓN JUNTOS --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                
                {/* Total de registros a la izquierda (o arriba en móvil) */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-primary/30 shadow-sm text-xs font-medium text-secondary/60 w-full md:w-auto justify-center md:justify-start">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,199,0,0.6)]"></div>
                    <p>Total de registros: <span className="font-black text-secondary">{pagination?.total || data.length || 0}</span></p>
                </div>

                {/* Paginación a la derecha */}
                {pagination && (
                    <div className="w-full md:w-auto flex justify-center md:justify-end">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={pagination.onPageChange}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};

export default Table;