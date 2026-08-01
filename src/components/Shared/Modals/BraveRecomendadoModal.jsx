import React, { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "ocultar_recomendacion_brave";

export const debeMostrarBraveModal = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) !== "1";
    } catch (err) {
        return true;
    }
};

const BraveRecomendadoModal = ({ onClose }) => {
    const [noVolverMostrar, setNoVolverMostrar] = useState(false);

    const handleClose = () => {
        try {
            if (noVolverMostrar) {
                localStorage.setItem(STORAGE_KEY, "1");
            }
        } catch (err) {
            // silencioso
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/85 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-sm bg-[#0D0C0E] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={16} />
                </button>

                <div className="p-6 pt-8 flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-[#E8B04B]/10 flex items-center justify-center mb-4">
                        <ShieldCheck size={26} className="text-[#E8B04B]" />
                    </div>

                    <h3 className="text-white font-black text-lg mb-2">
                        Usa Brave para una mejor experiencia
                    </h3>

                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                        Te recomendamos usar el navegador <span className="text-white font-bold">Brave</span> para
                        bloquear los anuncios y pop-ups que pueden aparecer al reproducir las películas y series.
                    </p>
                    <a
                    
                        href="https://brave.com/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-6 py-3 mb-4 bg-[#E8B04B] text-black text-sm font-black uppercase tracking-wide rounded-sm hover:bg-[#f0c06a] transition-colors"
                    >
                        Descargar Brave
                    </a>

                    <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={noVolverMostrar}
                            onChange={(e) => setNoVolverMostrar(e.target.checked)}
                            className="h-4 w-4 rounded-sm accent-[#E8B04B] cursor-pointer"
                        />
                        No volver a mostrar
                    </label>
                </div>
            </div>
        </div>
    );
};

export default BraveRecomendadoModal;