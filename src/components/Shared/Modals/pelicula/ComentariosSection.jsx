import React, { useState } from "react";
import { MessageCircle, Send, Trash2, User, ChevronDown } from "lucide-react";
import { useAuth } from "context/AuthContext";
import { useComentarios } from "hooks/comentario/useComentarios";
import LoginModal from "components/Shared/Modals/Auth/LoginModal";

const tiempoRelativo = (fechaIso) => {
    const diffMs = Date.now() - new Date(fechaIso).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "justo ahora";
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `hace ${diffHrs} h`;
    const diffDias = Math.floor(diffHrs / 24);
    if (diffDias < 30) return `hace ${diffDias} d`;
    return new Date(fechaIso).toLocaleDateString();
};

const ComentariosSection = ({ peliculaId }) => {
    const { isAuthenticated, user } = useAuth();
    const {
        comentarios, loading, enviando, texto, setTexto, publicar, eliminar, error,
        total, hayMas, cargandoMas, cargarMas,
    } = useComentarios(peliculaId);
    const [showLogin, setShowLogin] = useState(false);

    const handleFocusInput = () => {
        if (!isAuthenticated) {
            setShowLogin(true);
        }
    };

    const handlePublicar = () => {
        if (!isAuthenticated) {
            setShowLogin(true);
            return;
        }
        publicar();
    };

    return (
        <div className="mt-6 pt-6 border-t border-white/10">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
                <MessageCircle size={14} /> Comentarios {total > 0 && `(${total})`}
            </p>

            {/* CAJA PARA COMENTAR */}
            <div className="flex items-start gap-3 mb-6">
                {isAuthenticated && user?.foto ? (
                    <img src={user.foto} alt={user.nombre} className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <User size={14} className="text-white/30" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onFocus={handleFocusInput}
                        readOnly={!isAuthenticated}
                        placeholder={isAuthenticated ? "Escribe un comentario..." : "Inicia sesión para comentar"}
                        rows={2}
                        maxLength={1000}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-sm p-3 text-sm resize-none focus:outline-none focus:border-[#E8B04B] transition-colors cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-2">
                        {error && <span className="text-[11px] text-red-400">{error}</span>}
                        <button
                            onClick={handlePublicar}
                            disabled={enviando || (isAuthenticated && !texto.trim())}
                            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-[#E8B04B] text-black text-xs font-bold rounded-sm hover:bg-[#f0c06a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send size={12} />
                            {enviando ? "Publicando..." : "Publicar"}
                        </button>
                    </div>
                </div>
            </div>

            {/* LISTA DE COMENTARIOS */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-white/5 rounded" />
                                <div className="h-3 w-full bg-white/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comentarios.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {comentarios.map((c) => (
                            <div key={c.id} className="flex items-start gap-3">
                                {c.usuario.foto ? (
                                    <img src={c.usuario.foto} alt={c.usuario.nombre} className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#B8232B]/15 flex items-center justify-center text-[10px] font-black text-[#B8232B] shrink-0">
                                        {c.usuario.nombre.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white">{c.usuario.nombre}</span>
                                        <span className="text-[10px] text-white/30">{tiempoRelativo(c.created_at)}</span>
                                        {(isAuthenticated && user?.id === c.usuario.id) && (
                                            <button
                                                onClick={() => eliminar(c.id)}
                                                className="ml-auto text-white/20 hover:text-red-400 transition-colors"
                                                title="Eliminar comentario"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-white/70 leading-relaxed mt-1">{c.comentario}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hayMas && (
                        <button
                            onClick={cargarMas}
                            disabled={cargandoMas}
                            className="w-full flex items-center justify-center gap-1.5 mt-5 py-2.5 text-xs font-bold text-white/50 hover:text-[#E8B04B] hover:bg-white/5 rounded-sm transition-colors disabled:opacity-40"
                        >
                            {cargandoMas ? (
                                "Cargando..."
                            ) : (
                                <>
                                    <ChevronDown size={13} />
                                    Cargar más comentarios
                                </>
                            )}
                        </button>
                    )}
                </>
            ) : (
                <p className="text-xs text-white/30 text-center py-4">Sé el primero en comentar.</p>
            )}

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>
    );
};

export default ComentariosSection;