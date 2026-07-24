import React, { useEffect, useState } from "react";
import { X, PlayCircle, Download, Server, Star } from "lucide-react";
import { linkVideo } from "services/publicoService";
import VideoPlayerModal from "./VideoPlayerModal";

const VideoOpcionesModal = ({ titulo, videosReproduccion = [], videosDescarga = [], onClose }) => {
    const [reproduciendo, setReproduciendo] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => {
            document.body.style.overflow = "";
            cancelAnimationFrame(raf);
        };
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 250);
    };

    return (
        <>
            <style>{`
                .oculta-scrollbar::-webkit-scrollbar { display: none; }
                .oculta-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* BACKDROP */}
            <div
                className={`fixed inset-0 z-[55] bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${
                    visible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* WRAPPER — móvil: pegado abajo. desktop: centrado en pantalla */}
            <div className="fixed inset-x-0 bottom-0 md:inset-0 z-[55] flex justify-center md:items-center pointer-events-none">
                <div
                    className={`relative w-full md:w-full md:max-w-md bg-[#0D0C0E] rounded-t-lg md:rounded-sm border border-white/10 md:border-white/10 border-b-0 md:border-b shadow-2xl overflow-hidden pointer-events-auto flex flex-col
                        max-h-[85vh] md:max-h-[80vh] md:my-8
                        transition-transform duration-300 ease-out
                        ${visible ? "translate-y-0 md:scale-100 opacity-100" : "translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"}
                    `}
                >
                    {/* HEADER — fijo arriba */}
                    <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8B04B] mb-0.5">
                                Opciones disponibles
                            </span>
                            <h3 className="text-base font-black text-white truncate">{titulo}</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="h-8 w-8 shrink-0 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* BODY — scroll interno, scrollbar oculto */}
                    <div className="flex-1 overflow-y-auto oculta-scrollbar">
                        <div className="p-6 space-y-6">
                            {/* VER */}
                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                                    <PlayCircle size={14} /> Ver
                                </h4>

                                {videosReproduccion.length > 0 ? (
                                    <div className="space-y-2">
                                        {videosReproduccion.map((v) => {
                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setReproduciendo({ token: v.token, servidor: v.servidor })}
                                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E8B04B]/40 rounded-sm transition-colors"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <Server size={15} className="text-white/40 shrink-0" />
                                                        <span className="text-sm font-bold text-white truncate">{v.servidor}</span>
                                                        {v.es_principal && (
                                                            <Star size={12} className="text-[#E8B04B] fill-[#E8B04B] shrink-0" />
                                                        )}
                                                    </div>
                                                    {v.calidad && (
                                                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-[#E8B04B]/10 text-[#E8B04B] rounded-sm">
                                                            {v.calidad}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-white/30 py-2">No hay servidores disponibles todavía.</p>
                                )}
                            </div>

                            {/* DESCARGAR */}
                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                                    <Download size={14} /> Descargar
                                </h4>

                                {videosDescarga.length > 0 ? (
                                    <div className="space-y-2">
                                        {videosDescarga.map((v) => {
                                            return (
                                                <a
                                                    key={v.id}
                                                    href={linkVideo(v.token)}
                                                    target="_blank"
                                                    rel="noopener noreferrer nofollow"
                                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E8B04B]/40 rounded-sm transition-colors"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <Server size={15} className="text-white/40 shrink-0" />
                                                        <span className="text-sm font-bold text-white truncate">{v.servidor}</span>
                                                    </div>
                                                    {v.calidad && (
                                                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-[#E8B04B]/10 text-[#E8B04B] rounded-sm">
                                                            {v.calidad}
                                                        </span>
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-white/30 py-2">No hay enlaces de descarga todavía.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {reproduciendo && (
                <VideoPlayerModal
                    token={reproduciendo.token}
                    servidor={reproduciendo.servidor}
                    titulo={titulo}
                    linkVideo={linkVideo}
                    onClose={() => setReproduciendo(null)}
                />
            )}
        </>
    );
};

export default VideoOpcionesModal;