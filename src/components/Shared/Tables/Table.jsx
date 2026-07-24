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
        const baseClass = "block w-full px-3 py-2 bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm text-sm focus:outline-none focus:border-[#E8B04B] disabled:opacity-40 transition-colors";

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
                        className={`${baseClass} cursor-pointer h-[38px]`}
                    >
                        {config.options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#111013] text-white">
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
                            <MagnifyingGlassIcon className="h-4 w-4 text-white/30" />
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
                <div className="bg-[#0D0C0E] p-4 rounded-sm border border-white/10">
                    <div className="grid grid-cols-12 gap-4 items-end">
                        {filterConfig.map((config, index) => (
                            <div key={index} className={config.colSpan || "col-span-12 md:col-span-3"}>
                                {config.label && config.type !== 'custom' && (
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
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
                                className="flex-1 px-4 py-2 bg-[#E8B04B] text-black rounded-sm hover:bg-[#f0c06a] transition-colors text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2 h-[38px] uppercase tracking-wide"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4" />
                                Buscar
                            </button>

                            <button
                                type="button"
                                onClick={onFilterClear}
                                disabled={loading}
                                className="px-3 py-2 text-white/40 hover:text-red-400 hover:bg-red-900/10 rounded-sm border border-white/10 bg-white/5 transition-all h-[38px]"
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
                <table className="min-w-full w-full block md:table rounded-sm overflow-hidden">

                    <thead className="hidden md:table-header-group bg-[#0D0C0E] border-b border-white/10">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-3.5 text-left text-[11px] font-bold text-[#E8B04B] uppercase tracking-widest">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="block md:table-row-group md:divide-y md:divide-white/5 bg-transparent">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    className="block md:table-row mb-4 md:mb-0 border border-white/10 md:border-none rounded-sm md:rounded-none bg-[#0D0C0E] md:bg-transparent md:hover:bg-white/[0.03] transition-colors"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={`${rowIndex}-${colIndex}`}
                                            className="block md:table-cell px-4 py-3 md:px-6 md:py-4 text-sm text-white/80 border-b border-white/5 last:border-b-0 md:border-b-0 flex justify-between md:block items-center"
                                        >
                                            <span className="font-bold text-white/30 text-[10px] uppercase md:hidden mr-2">
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
                            <tr className="block md:table-row bg-[#0D0C0E] rounded-sm border border-white/10 md:border-none p-4 md:p-0">
                                <td colSpan={columns.length} className="block md:table-cell px-6 py-12 text-center text-white/30">
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

            {/* --- FOOTER: TOTAL REGISTROS Y PAGINACIÓN --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0D0C0E] border border-white/10 text-xs font-medium text-white/40 w-full md:w-auto justify-center md:justify-start">
                    <div className="w-2 h-2 rounded-full bg-[#E8B04B] shadow-[0_0_8px_rgba(232,176,75,0.6)]"></div>
                    <p>Total de registros: <span className="font-black text-white">{pagination?.total || data.length || 0}</span></p>
                </div>

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