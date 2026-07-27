import React, { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "context/AuthContext";
import { useCalificacion } from "hooks/calificacion/useCalificacion";
import LoginModal from "components/Shared/Modals/Auth/LoginModal";
import { toast } from "react-toastify";

const EstrellasCalificacion = ({ peliculaId, serieId, promedio, totalTexto }) => {
    const { isAuthenticated } = useAuth();
    const { miPuntuacion, enviando, calificar } = useCalificacion({
        peliculaId, serieId, promedioInicial: promedio, isAuthenticated,
    });
    const [hover, setHover] = useState(0);
    const [showLogin, setShowLogin] = useState(false);

    const handleClick = async (valor) => {
        if (!isAuthenticated) {
            setShowLogin(true);
            return;
        }
        const ok = await calificar(valor);
        if (ok) {
            toast.success("¡Gracias por tu calificación!");
        } else {
            toast.error("No se pudo guardar tu calificación.");
        }
    };

    const valorMostrado = hover || miPuntuacion || 0;

    return (
        <div className="flex flex-wrap items-center gap-4">
            {/* Promedio general, siempre visible */}
            {promedio > 0 && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-white/80">
                    <Star size={18} className="fill-[#E8B04B] text-[#E8B04B]" />
                    {Number(promedio).toFixed(1)}
                </span>
            )}

            {/* Estrellas interactivas para calificar */}
            <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={enviando}
                        onMouseEnter={() => setHover(n)}
                        onClick={() => handleClick(n)}
                        className="disabled:opacity-50 transition-transform hover:scale-110"
                        title={isAuthenticated ? `Calificar con ${n} estrella${n > 1 ? "s" : ""}` : "Inicia sesión para calificar"}
                    >
                        <Star
                            size={26}
                            className={valorMostrado >= n ? "fill-[#E8B04B] text-[#E8B04B]" : "text-white/20"}
                        />
                    </button>
                ))}
            </div>

            {miPuntuacion && (
                <span className="text-xs text-white/50">Tu voto: {miPuntuacion}/5</span>
            )}

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>
    );
};

export default EstrellasCalificacion;