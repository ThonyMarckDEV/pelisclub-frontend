import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const CatalogoSearch = ({ valorInicial, onBuscar }) => {
  const [texto, setTexto] = useState(valorInicial || "");

  // Si el término cambia desde afuera (ej. se limpió el filtro), sincroniza el input
  useEffect(() => {
    setTexto(valorInicial || "");
  }, [valorInicial]);

  // Debounce: espera 400ms sin escribir antes de disparar la búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (texto !== valorInicial) {
        onBuscar(texto.trim());
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  return (
    <div className="relative w-full sm:w-72">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
      />
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Buscar películas o series..."
        className="w-full bg-[#141215] border border-white/10 rounded-sm pl-9 pr-8 py-2 text-white text-xs font-medium placeholder:text-white/30 focus:outline-none focus:border-[#E8B04B]/50 transition-colors"
      />
      {texto && (
        <button
          onClick={() => setTexto("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

export default CatalogoSearch;