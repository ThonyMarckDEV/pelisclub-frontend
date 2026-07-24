import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/generoService';
import { MagnifyingGlassIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';

const GeneroMultiSelect = ({ selected, onChange, disabled }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchGeneros = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await combobox(searchTerm);
            const disponibles = (response.data || []).filter(
                g => !selected.some(s => s.id === g.id)
            );
            setSuggestions(disponibles);
            setShowSuggestions(true);
        } catch (error) {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchGeneros(texto), 400);
    };

    const handleSelect = (genero) => {
        onChange([...selected, { id: genero.id, nombre: genero.nombre }]);
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleRemove = (id) => {
        onChange(selected.filter(g => g.id !== id));
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={() => !disabled && fetchGeneros(inputValue)}
                    disabled={disabled}
                    placeholder="Buscar género (ej. Drama, Terror...)"
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#E8B04B] transition-colors disabled:opacity-40"
                    autoComplete="off"
                />
                <TagIcon className="w-4 h-4 absolute left-3 text-white/30" />
                <div className="absolute right-3">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-[#E8B04B] rounded-full animate-spin"></div>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-white/30" />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-[#111013] border border-white/10 rounded-sm mt-1 max-h-56 overflow-y-auto shadow-2xl">
                        {suggestions.length > 0 ? suggestions.map((genero) => (
                            <li
                                key={genero.id}
                                onClick={() => handleSelect(genero)}
                                className="px-4 py-2.5 cursor-pointer text-sm text-white/80 hover:bg-white/5 hover:text-[#E8B04B] border-b border-white/5 last:border-0 transition-colors"
                            >
                                {genero.nombre}
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-white/30 text-xs text-center">
                                No hay géneros disponibles
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* CHIPS SELECCIONADOS */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selected.map((genero) => (
                        <span
                            key={genero.id}
                            className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-[#E8B04B]/10 text-[#E8B04B] border border-[#E8B04B]/20 rounded-full text-xs font-bold"
                        >
                            {genero.nombre}
                            {!disabled && (
                                <button type="button" onClick={() => handleRemove(genero.id)} className="hover:bg-[#E8B04B]/20 rounded-full p-0.5 transition-colors">
                                    <XMarkIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GeneroMultiSelect;