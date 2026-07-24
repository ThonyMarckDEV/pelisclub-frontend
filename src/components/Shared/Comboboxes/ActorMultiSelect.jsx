import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/actorService';
import { MagnifyingGlassIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

const ActorMultiSelect = ({ selected, onChange, disabled }) => {
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

    const fetchActores = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await combobox(searchTerm);
            const disponibles = (response.data || []).filter(
                a => !selected.some(s => s.id === a.id)
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
        debounceRef.current = setTimeout(() => fetchActores(texto), 400);
    };

    const handleSelect = (actor) => {
        onChange([...selected, { id: actor.id, nombre: actor.nombre, foto_url: actor.foto_url, personaje: '', orden: selected.length }]);
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleRemove = (id) => {
        onChange(selected.filter(a => a.id !== id));
    };

    const handlePersonajeChange = (id, personaje) => {
        onChange(selected.map(a => a.id === id ? { ...a, personaje } : a));
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={() => !disabled && fetchActores(inputValue)}
                    disabled={disabled}
                    placeholder="Buscar actor por nombre..."
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-sm pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#E8B04B] transition-colors disabled:opacity-40"
                    autoComplete="off"
                />
                <UserIcon className="w-4 h-4 absolute left-3 text-white/30" />
                <div className="absolute right-3">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-[#E8B04B] rounded-full animate-spin"></div>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-white/30" />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-[#111013] border border-white/10 rounded-sm mt-1 max-h-56 overflow-y-auto shadow-2xl">
                        {suggestions.length > 0 ? suggestions.map((actor) => (
                            <li
                                key={actor.id}
                                onClick={() => handleSelect(actor)}
                                className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                            >
                                {actor.foto_url ? (
                                    <img src={actor.foto_url} alt={actor.nombre} className="w-7 h-7 rounded-full object-cover border border-white/10" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-[#B8232B]/15 flex items-center justify-center text-[10px] font-black text-[#B8232B]">
                                        {actor.nombre.charAt(0)}
                                    </div>
                                )}
                                <span className="text-white/80">{actor.nombre}</span>
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-white/30 text-xs text-center">
                                No hay actores disponibles
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* SELECCIONADOS CON CAMPO "PERSONAJE" */}
            {selected.length > 0 && (
                <div className="space-y-2 mt-3">
                    {selected.map((actor) => (
                        <div key={actor.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-sm p-2.5">
                            {actor.foto_url ? (
                                <img src={actor.foto_url} alt={actor.nombre} className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-[#B8232B]/15 flex items-center justify-center text-xs font-black text-[#B8232B] shrink-0">
                                    {actor.nombre.charAt(0)}
                                </div>
                            )}
                            <span className="text-sm font-bold text-white shrink-0 w-32 truncate">{actor.nombre}</span>
                            <input
                                type="text"
                                value={actor.personaje || ''}
                                onChange={(e) => handlePersonajeChange(actor.id, e.target.value)}
                                placeholder="Personaje que interpreta (opcional)"
                                disabled={disabled}
                                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-[#E8B04B] transition-colors"
                            />
                            {!disabled && (
                                <button type="button" onClick={() => handleRemove(actor.id)} className="text-white/30 hover:text-red-400 p-1 shrink-0">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActorMultiSelect;