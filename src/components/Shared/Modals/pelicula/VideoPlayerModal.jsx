import React, { useEffect, useState, useRef } from "react";
import { X, Play, ShieldAlert, Lightbulb, LightbulbOff, Clapperboard, MonitorPlay, Maximize, Minimize, RotateCw } from "lucide-react";
import CinemaScene3D from "./CinemaScene3D";

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
};

const useOrientation = () => {
    const [esVertical, setEsVertical] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(orientation: portrait)");
        const update = () => setEsVertical(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);
    return esVertical;
};

const VideoPlayerModal = ({ token, servidor, titulo, linkVideo, onClose }) => {
    const [confirmado, setConfirmado] = useState(false);
    const [lucesApagadas, setLucesApagadas] = useState(false);
    const [modoCine, setModoCine] = useState(true);
    const [esFullscreen, setEsFullscreen] = useState(false);
    const [mostrarControles, setMostrarControles] = useState(true);

    const containerRef = useRef(null);
    const hideControlsTimer = useRef(null);
    const isMobile = useIsMobile();
    const esVertical = useOrientation();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => setEsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const entrarFullscreenHorizontal = async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
            }
            if (window.screen.orientation && window.screen.orientation.lock) {
                await window.screen.orientation.lock("landscape").catch(() => {});
            }
        } catch (err) {}
    };

    const salirFullscreen = () => {
        if (window.screen.orientation && window.screen.orientation.unlock) {
            try { window.screen.orientation.unlock(); } catch (err) {}
        }
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    };

    useEffect(() => {
        if (isMobile) {
            entrarFullscreenHorizontal();
        }
        return () => {
            if (isMobile) salirFullscreen();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    const toggleFullscreenDesktop = async () => {
        if (!document.fullscreenElement) {
            try { await containerRef.current?.requestFullscreen(); } catch (err) {}
        } else {
            document.exitFullscreen();
        }
    };

    const handleConfirmar = () => {
        setConfirmado(true);
        if (isMobile) {
            entrarFullscreenHorizontal();
        }
    };

    const handleClose = () => {
        if (isMobile) salirFullscreen();
        onClose();
    };

    const handleActivity = () => {
        setMostrarControles(true);
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        if (lucesApagadas) {
            hideControlsTimer.current = setTimeout(() => setMostrarControles(false), 2500);
        }
    };

    useEffect(() => () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current); }, []);

    const mostrarAvisoRotar = isMobile && esVertical;

    return (
        <>
            <div className={`fixed inset-0 z-[60] transition-colors duration-700 ${lucesApagadas ? "bg-black" : "bg-black/95"}`} />

            <div
                className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                onMouseMove={handleActivity}
                onTouchStart={handleActivity}
            >
                <div
                    ref={containerRef}
                    className="relative w-full h-full pointer-events-auto bg-black overflow-hidden flex items-center justify-center"
                >
                    {modoCine && (
                        <CinemaScene3D lucesApagadas={lucesApagadas} encendido={confirmado} />
                    )}

                    {/* HEADER — ya no se oculta ni se traslada, solo se atenúa la opacidad. Sigue siendo clicable siempre */}
                    <div
                        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${
                            lucesApagadas && !mostrarControles ? "opacity-30" : "opacity-100"
                        }`}
                    >
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs md:text-sm font-bold text-white truncate">{titulo}</span>
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wide">Servidor: {servidor}</span>
                        </div>

                        <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
                            <button
                                onClick={() => setModoCine((v) => !v)}
                                disabled={mostrarAvisoRotar}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/70 disabled:cursor-not-allowed"
                                title={modoCine ? "Quitar sala de cine" : "Mostrar sala de cine"}
                            >
                                {modoCine ? <MonitorPlay size={16} /> : <Clapperboard size={16} />}
                            </button>
                            <button
                                onClick={() => setLucesApagadas((v) => !v)}
                                disabled={mostrarAvisoRotar}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/70 disabled:cursor-not-allowed"
                                title={lucesApagadas ? "Encender luces" : "Apagar luces"}
                            >
                                {lucesApagadas ? <LightbulbOff size={16} /> : <Lightbulb size={16} />}
                            </button>

                            {!isMobile && (
                                <button
                                    onClick={toggleFullscreenDesktop}
                                    className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors"
                                    title={esFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                                >
                                    {esFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                                </button>
                            )}

                            {/* La X siempre queda habilitada, incluso con el aviso de rotar visible */}
                            <button
                                onClick={handleClose}
                                className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* PANTALLA / VIDEO */}
                    <div
                        className="absolute z-20 bg-black overflow-hidden"
                        style={
                            modoCine
                                ? { left: "28%", top: "20%", width: "44%", height: "45%" }
                                : { inset: 0 }
                        }
                    >
                        {!confirmado ? (
                            <button
                                onClick={handleConfirmar}
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

                    {/* AVISO EXTERNO SERVIDOR */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 z-30 flex items-start gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-500 ${
                            lucesApagadas && !mostrarControles ? "opacity-30" : "opacity-100"
                        }`}
                    >
                        <ShieldAlert size={12} className="text-white/25 shrink-0 mt-0.5" />
                        <p className="text-[9px] md:text-[10px] text-white/30 leading-relaxed">
                            Video servido desde un servidor externo ({servidor}). Si tu antivirus muestra una advertencia, cierra y prueba otro servidor.
                        </p>
                    </div>

                    {/* POPUP: gira tu dispositivo — solo bloquea visualmente, la X del header sigue tocable por encima (z-30 > z-40 no, corregido abajo) */}
                    <div
                        className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/92 backdrop-blur-sm transition-opacity duration-500 ${
                            mostrarAvisoRotar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <RotateCw size={40} className="text-[#E8B04B] animate-[spin_2.2s_ease-in-out_infinite]" />
                        <p className="text-white text-sm font-bold text-center px-8">
                            Gira tu dispositivo
                        </p>
                        <p className="text-white/50 text-xs text-center px-10 leading-relaxed">
                            Coloca tu dispositivo en horizontal para una mejor experiencia en modo cine
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoPlayerModal;