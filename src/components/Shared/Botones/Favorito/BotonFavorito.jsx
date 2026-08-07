import React, { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";
import { useFavoritos } from "context/FavoritosContext";
import LoginModal from "components/Shared/Modals/Auth/LoginModal";

const BotonFavorito = ({ peliculaId, serieId, variant = "button" }) => {
    const { isAuthenticated } = useAuth();
    const { esFavorito, toggleFavorito } = useFavoritos();
    const [showLogin, setShowLogin] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const id = peliculaId || serieId;
    const tipo = serieId ? "serie" : "pelicula";
    const activo = esFavorito(id, tipo);

    const handleClick = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            setShowLogin(true);
            return;
        }
        setEnviando(true);
        try {
            const nuevoEstado = await toggleFavorito({ peliculaId, serieId });
            toast.success(nuevoEstado ? "Agregado a favoritos" : "Eliminado de favoritos");
        } catch (err) {
            toast.error("No se pudo actualizar favoritos.");
        } finally {
            setEnviando(false);
        }
    };

    if (variant === "icon") {
        // Para overlay sobre MovieCard: solo el corazón, sin fondo de botón
        return (
            <>
                <button
                    onClick={handleClick}
                    disabled={enviando}
                    className="absolute top-2 right-2 z-10 h-8 w-8 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded-full transition-colors disabled:opacity-50"
                    title={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    <Heart
                        size={16}
                        className={activo ? "text-[#E8B04B] fill-[#E8B04B]" : "text-white/70"}
                    />
                </button>
                {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
            </>
        );
    }

    return (
        <>
            <button
                onClick={handleClick}
                disabled={enviando}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-sm border transition-colors disabled:opacity-50 ${
                    activo
                        ? "bg-[#E8B04B]/10 border-[#E8B04B]/40 text-[#E8B04B]"
                        : "bg-white/10 border-white/15 text-white hover:bg-white/20"
                }`}
            >
                <Heart size={18} className={activo ? "fill-[#E8B04B]" : ""} />
                {activo ? "En favoritos" : "Agregar a favoritos"}
            </button>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </>
    );
};

export default BotonFavorito;