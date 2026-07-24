import React, { useEffect, useState, useRef } from "react";
import { X, Play, ShieldAlert, Maximize, Minimize, Lightbulb, LightbulbOff, Clapperboard, MonitorPlay } from "lucide-react";
import CinemaScene3D from "./CinemaScene3D";

const VideoPlayerModal = ({ token, servidor, titulo, linkVideo, onClose }) => {
    const [confirmado, setConfirmado] = useState(false);
    const [lucesApagadas, setLucesApagadas] = useState(false);
    const [modoCine, setModoCine] = useState(true);
    const [esFullscreen, setEsFullscreen] = useState(false);
    const [mostrarControles, setMostrarControles] = useState(true);

    const containerRef = useRef(null);
    const hideControlsTimer = useRef(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => setEsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            try {
                await containerRef.current?.requestFullscreen();
                if (window.screen.orientation && window.screen.orientation.lock) {
                    window.screen.orientation.lock("landscape").catch(() => {});
                }
            } catch (err) {}
        } else {
            if (window.screen.orientation && window.screen.orientation.unlock) {
                try { window.screen.orientation.unlock(); } catch (err) {}
            }
            document.exitFullscreen();
        }
    };

    const handleActivity = () => {
        setMostrarControles(true);
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        if (lucesApagadas) {
            hideControlsTimer.current = setTimeout(() => setMostrarControles(false), 2500);
        }
    };

    useEffect(() => () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current); }, []);

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] transition-colors duration-700 ${lucesApagadas ? "bg-black" : "bg-black/95"}`}
            />

            <div
                className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                onMouseMove={handleActivity}
                onTouchStart={handleActivity}
            >
                {/* w-full h-full desde el primer render: abre a pantalla completa, no en miniatura */}
                <div
                    ref={containerRef}
                    className="relative w-full h-full pointer-events-auto bg-black overflow-hidden flex items-center justify-center"
                >
                    {modoCine && (
                        <CinemaScene3D lucesApagadas={lucesApagadas} encendido={confirmado} />
                    )}

                    {/* HEADER */}
                    <div
                        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-b from-black/80 to-transparent transition-all duration-500 ${
                            lucesApagadas && !mostrarControles ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                        }`}
                    >
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs md:text-sm font-bold text-white truncate">{titulo}</span>
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wide">Servidor: {servidor}</span>
                        </div>

                        <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
                            <button
                                onClick={() => setModoCine((v) => !v)}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors"
                                title={modoCine ? "Quitar sala de cine" : "Mostrar sala de cine"}
                            >
                                {modoCine ? <MonitorPlay size={16} /> : <Clapperboard size={16} />}
                            </button>
                            <button
                                onClick={() => setLucesApagadas((v) => !v)}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors"
                                title={lucesApagadas ? "Encender luces" : "Apagar luces"}
                            >
                                {lucesApagadas ? <LightbulbOff size={16} /> : <Lightbulb size={16} />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors"
                                title={esFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                            >
                                {esFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* PANTALLA / VIDEO — tamaño FIJO en px (no escala con la ventana). La pantalla de un cine
                        es un objeto físico de tamaño constante; lo que cambia con el viewport es cuánta sala
                        (butacas, paredes) se ve alrededor — eso ya lo resuelve el Canvas/cámara de Three.js. */}
                    <div
                        className={
                            modoCine
                                ? "absolute z-20 bg-black overflow-hidden left-0 right-0 mx-auto top-[340px] md:top-[225px] aspect-video w-[500px] h-[280px] md:w-[800px] md:h-[400px]"
                                : "absolute z-20 bg-black overflow-hidden inset-0"
                        }
                    >
                        {!confirmado ? (
                            <button
                                onClick={() => setConfirmado(true)}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 md:gap-4 bg-gradient-to-br from-[#1A1719] to-black group"
                            >
                                <div className="h-10 w-10 md:h-16 md:w-16 rounded-full bg-[#E8B04B] flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Play size={18} className="text-black fill-black ml-0.5 md:w-[26px] md:h-[26px]" />
                                </div>
                                <p className="text-white/50 text-[9px] md:text-xs font-semibold text-center px-2 md:px-4">Toca para cargar el reproductor</p>
                            </button>
                        ) : (
                            <iframe
                                src={linkVideo(token)}
                                title={`${titulo} - ${servidor}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                                referrerPolicy="no-referrer"
                                loading="lazy"
                            />
                        )}
                    </div>

                    {/* AVISO */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 z-30 flex items-start gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-t from-black/90 to-transparent transition-all duration-500 ${
                            lucesApagadas && !mostrarControles ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                        }`}
                    >
                        <ShieldAlert size={12} className="text-white/25 shrink-0 mt-0.5" />
                        <p className="text-[9px] md:text-[10px] text-white/30 leading-relaxed">
                            Video servido desde un servidor externo ({servidor}). Si tu antivirus muestra una advertencia, cierra y prueba otro servidor.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoPlayerModal;