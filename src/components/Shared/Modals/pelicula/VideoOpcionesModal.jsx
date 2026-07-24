import React, { useEffect, useState } from "react";
import { X, PlayCircle, Download, Server, Star } from "lucide-react";
import { linkVideo } from "services/publicoService";
import VideoPlayerModal from "./VideoPlayerModal";

const VideoOpcionesModal = ({ titulo, videosReproduccion = [], videosDescarga = [], onClose }) => {
    const [reproduciendo, setReproduciendo] = useState(null); // { token, servidor }

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <>
            <div className="fixed inset-0 z-[55] bg-black/85 backdrop-blur-sm" onClick={onClose} />

            <div className="fixed inset-0 z-[55] overflow-y-auto flex items-start md:items-center justify-center p-0 md:p-4 pointer-events-none">
                <div className="relative w-full md:max-w-md bg-[#0D0C0E] md:rounded-sm border border-white/10 shadow-2xl overflow-hidden my-0 md:my-8 pointer-events-auto">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8B04B] mb-0.5">
                                Opciones disponibles
                            </span>
                            <h3 className="text-base font-black text-white truncate">{titulo}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 shrink-0 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* VER — abre el reproductor embebido */}
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

                        {/* DESCARGAR — link directo, tiene sentido en pestaña nueva */}
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