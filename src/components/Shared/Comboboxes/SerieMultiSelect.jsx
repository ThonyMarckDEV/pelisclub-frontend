import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/serieService';
import { MagnifyingGlassIcon, XMarkIcon, TvIcon } from '@heroicons/react/24/outline';

const SerieSearchSelect = ({ selected, onSelect, disabled }) => {
    const [inputValue, setInputValue] = useState(selected?.titulo || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => { setInputValue(selected?.titulo || ''); }, [selected]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSeries = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await combobox(searchTerm);
            setSuggestions(response.data || []);
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
        debounceRef.current = setTimeout(() => fetchSeries(texto), 400);
    };

    const handleSelect = (serie) => {
        onSelect(serie);
        setInputValue(serie.titulo);
        setShowSuggestions(false);
    };

    const handleClear = () => {
        if (disabled) return;
        setInputValue('');
        onSelect(null);
        fetchSeries('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={() => !disabled && fetchSeries(inputValue)}
                    disabled={disabled}
                    placeholder="Buscar serie por título..."
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#E8B04B] transition-colors disabled:opacity-40"
                    autoComplete="off"
                />
                <TvIcon className="w-4 h-4 absolute left-3 text-white/30" />
                <div className="absolute right-3">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-[#E8B04B] rounded-full animate-spin"></div>
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-white/30 hover:text-red-400">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-white/30" />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-[#111013] border border-white/10 rounded-sm mt-1 max-h-64 overflow-y-auto shadow-2xl">
                        {suggestions.length > 0 ? suggestions.map((serie) => (
                            <li
                                key={serie.id}
                                onClick={() => handleSelect(serie)}
                                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                            >
                                <div className="w-8 h-11 rounded-sm bg-black border border-white/10 overflow-hidden shrink-0">
                                    {serie.portada_url ? (
                                        <img src={serie.portada_url} alt={serie.titulo} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <TvIcon className="w-3.5 h-3.5 text-white/20" />
                                        </div>
                                    )}
                                </div>
                                <span className="font-bold text-white/90">{serie.titulo}</span>
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-white/30 text-xs text-center">No se encontraron series.</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SerieSearchSelect;