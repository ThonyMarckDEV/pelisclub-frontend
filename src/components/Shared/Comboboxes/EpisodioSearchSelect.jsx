import React, { useState, useEffect } from 'react';
import SerieSearchSelect from './SerieMultiSelect';
import { indexPorSerie } from 'services/temporadaService';
import { indexPorTemporada } from 'services/episodioService';
import { FilmIcon } from '@heroicons/react/24/outline';

const EpisodioSearchSelect = ({ selected, onSelect }) => {
    const [serie, setSerie] = useState(null);
    const [temporadas, setTemporadas] = useState([]);
    const [temporadaId, setTemporadaId] = useState('');
    const [episodios, setEpisodios] = useState([]);

    useEffect(() => {
        if (serie) {
            indexPorSerie(serie.id).then(r => setTemporadas(r.data || []));
        } else {
            setTemporadas([]); setTemporadaId(''); setEpisodios([]);
        }
    }, [serie]);

    useEffect(() => {
        if (temporadaId) {
            indexPorTemporada(temporadaId).then(r => setEpisodios(r.data || []));
        } else {
            setEpisodios([]);
        }
    }, [temporadaId]);

    return (
        <div className="space-y-3">
            <SerieSearchSelect selected={serie} onSelect={setSerie} />

            {serie && (
                <select
                    value={temporadaId}
                    onChange={(e) => setTemporadaId(e.target.value)}
                    className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] cursor-pointer"
                >
                    <option value="" className="bg-[#111013]">Selecciona temporada...</option>
                    {temporadas.map(t => (
                        <option key={t.id} value={t.id} className="bg-[#111013]">Temporada {t.numero}</option>
                    ))}
                </select>
            )}

            {temporadaId && (
                <select
                    value={selected?.id || ''}
                    onChange={(e) => {
                        const ep = episodios.find(x => x.id === parseInt(e.target.value));
                        onSelect(ep || null);
                    }}
                    className="w-full p-2.5 text-sm bg-white/5 border border-white/15 text-white rounded-sm focus:outline-none focus:border-[#E8B04B] cursor-pointer"
                >
                    <option value="" className="bg-[#111013]">Selecciona episodio...</option>
                    {episodios.map(ep => (
                        <option key={ep.id} value={ep.id} className="bg-[#111013]">E{ep.numero}. {ep.titulo}</option>
                    ))}
                </select>
            )}

            {selected && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#E8B04B]/10 border border-[#E8B04B]/30 rounded-sm">
                    <FilmIcon className="w-4 h-4 text-[#E8B04B]" />
                    <span className="text-xs font-bold text-white">{selected.titulo}</span>
                </div>
            )}
        </div>
    );
};

export default EpisodioSearchSelect;