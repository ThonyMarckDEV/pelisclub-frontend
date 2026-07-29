import React, { useEffect, useState, useRef } from "react";
import { X, Play, ShieldAlert, Lightbulb, LightbulbOff, Clapperboard, MonitorPlay, Maximize, Minimize, RotateCw, ChevronRight, Sparkles } from "lucide-react";
import CinemaScene3D from "./CinemaScene3D";

const TUTORIAL_STORAGE_KEY = "pelisclub_tutorial_reproductor_visto";

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


const yaVioTutorial = () => {
    try {
        return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "1";
    } catch (err) {
        return false;
    }
};

const marcarTutorialVisto = () => {
    try {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
    } catch (err) {}
};

const construirPasos = (isMobile) => {
    const pasos = [
        {
            target: "cine",
            titulo: "Modo Cine",
            texto: "Activa o desactiva la sala de cine 3D. Toca el botón para continuar.",
        },
        {
            target: "luces",
            titulo: "Luces de la sala",
            texto: "Apaga las luces para una experiencia más inmersiva. Tócalo para continuar.",
        },
        {
            target: "fullscreen",
            titulo: "Pantalla completa",
            texto: "Alterna la pantalla completa cuando quieras.",
        },
    ];
    return isMobile ? pasos.filter((p) => p.target !== "fullscreen") : pasos;
};

const VideoPlayerModal = ({ token, servidor, titulo, linkVideo, onClose }) => {
    const [confirmado, setConfirmado] = useState(false);
    const [lucesApagadas, setLucesApagadas] = useState(false);

    const [modoCine, setModoCine] = useState(false);
    const [esFullscreen, setEsFullscreen] = useState(false);

    const [controlesActivos, setControlesActivos] = useState(true);
    const hideControlsTimer = useRef(null);

    const [mostrarTutorial, setMostrarTutorial] = useState(() => !yaVioTutorial());
    const [pasoTutorial, setPasoTutorial] = useState(0);

    const containerRef = useRef(null);
    const isMobile = useIsMobile();
    const esVertical = useOrientation();

    const pasos = construirPasos(isMobile);
    const pasoActual = pasos[pasoTutorial];

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => setEsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const entrarFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
            }
            if (isMobile && window.screen.orientation && window.screen.orientation.lock) {
                await window.screen.orientation.lock("landscape").catch(() => {});
            }
        } catch (err) {}
    };

    const salirFullscreen = async () => {
        if (window.screen.orientation && window.screen.orientation.unlock) {
            try { window.screen.orientation.unlock(); } catch (err) {}
        }
        if (document.fullscreenElement) {
            try { await document.exitFullscreen(); } catch (err) {}
        }
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            salirFullscreen();
        } else {
            entrarFullscreen();
        }
    };

    useEffect(() => {
        entrarFullscreen();
        return () => { salirFullscreen(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirmar = () => {
        setConfirmado(true);
        entrarFullscreen();
    };

    const handleClose = () => {
        salirFullscreen();
        onClose();
    };

    const activarControles = () => {
        setControlesActivos(true);
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        hideControlsTimer.current = setTimeout(() => setControlesActivos(false), 3000);
    };

    useEffect(() => {
        activarControles();
        return () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const avanzarTutorial = () => {
        if (pasoTutorial < pasos.length - 1) {
            setPasoTutorial((p) => p + 1);
        } else {
            setMostrarTutorial(false);
            marcarTutorialVisto();
        }
    };

    const saltarTutorial = () => {
        setMostrarTutorial(false);
        marcarTutorialVisto();
    };

    const handleClickCine = () => {
        setModoCine((v) => !v);
        if (mostrarTutorial && pasoActual?.target === "cine") avanzarTutorial();
    };

    const handleClickLuces = () => {
        setLucesApagadas((v) => !v);
        if (mostrarTutorial && pasoActual?.target === "luces") avanzarTutorial();
    };

    const handleClickFullscreen = () => {
        toggleFullscreen();
        if (mostrarTutorial && pasoActual?.target === "fullscreen") avanzarTutorial();
    };

    const mostrarAvisoRotar = isMobile && esVertical;
    const controlesVisibles = controlesActivos || mostrarTutorial;

    const anilloActivo = (target) =>
        mostrarTutorial && pasoActual?.target === target
            ? "ring-2 ring-[#E8B04B] ring-offset-2 ring-offset-black animate-pulse"
            : "";

    return (
        <>
            <div className={`fixed inset-0 z-[60] transition-colors duration-700 ${lucesApagadas ? "bg-black" : "bg-black/95"}`} />

            <div
                className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                onMouseMove={activarControles}
                onTouchStart={activarControles}
            >
                <div
                    ref={containerRef}
                    className="relative w-full h-full pointer-events-auto bg-black overflow-hidden flex items-center justify-center"
                >
                    {modoCine && (
                        <CinemaScene3D lucesApagadas={lucesApagadas} encendido={confirmado} />
                    )}

                    <div
                        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-700 ${
                            controlesVisibles ? "opacity-100" : "opacity-40"
                        }`}
                    >
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs md:text-sm font-bold text-white truncate">{titulo}</span>
                            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wide">Servidor: {servidor}</span>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2 shrink-0">
                            <button
                                onClick={handleClickCine}
                                disabled={mostrarAvisoRotar}
                                className={`h-11 w-11 md:h-12 md:w-12 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/70 disabled:cursor-not-allowed ${anilloActivo("cine")}`}
                                title={modoCine ? "Quitar sala de cine" : "Mostrar sala de cine"}
                            >
                                {modoCine ? <MonitorPlay size={22} className="md:w-6 md:h-6" /> : <Clapperboard size={22} className="md:w-6 md:h-6" />}
                            </button>
                            <button
                                onClick={handleClickLuces}
                                disabled={mostrarAvisoRotar}
                                className={`h-11 w-11 md:h-12 md:w-12 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/70 disabled:cursor-not-allowed ${anilloActivo("luces")}`}
                                title={lucesApagadas ? "Encender luces" : "Apagar luces"}
                            >
                                {lucesApagadas ? <LightbulbOff size={22} className="md:w-6 md:h-6" /> : <Lightbulb size={22} className="md:w-6 md:h-6" />}
                            </button>

                            <button
                                onClick={handleClickFullscreen}
                                className={`h-11 w-11 md:h-12 md:w-12 flex items-center justify-center text-white/70 hover:text-[#E8B04B] hover:bg-white/10 rounded-full transition-colors ${anilloActivo("fullscreen")}`}
                                title={esFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                            >
                                {esFullscreen ? <Minimize size={22} className="md:w-6 md:h-6" /> : <Maximize size={22} className="md:w-6 md:h-6" />}
                            </button>

                            <button
                                onClick={handleClose}
                                className="h-11 w-11 md:h-12 md:w-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} className="md:w-7 md:h-7" />
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

                    <div
                        className={`absolute bottom-0 left-0 right-0 z-30 flex items-start gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-700 ${
                            controlesVisibles ? "opacity-100" : "opacity-40"
                        }`}
                    >
                        <ShieldAlert size={12} className="text-white/25 shrink-0 mt-0.5" />
                        <p className="text-[9px] md:text-[10px] text-white/30 leading-relaxed">
                            Video servido desde un servidor externo ({servidor}). Si tu antivirus muestra una advertencia, cierra y prueba otro servidor.
                        </p>
                    </div>

                    {mostrarTutorial && pasoActual && !mostrarAvisoRotar && (
                        <div className="absolute top-16 md:top-20 right-3 md:right-4 z-40 w-64 md:w-72 bg-[#0D0C0E] border border-[#E8B04B]/40 rounded-sm shadow-2xl p-4 animate-[fadeIn_0.3s_ease-out]">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-[#E8B04B]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8B04B]">
                                    Paso {pasoTutorial + 1} de {pasos.length}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-white mb-1">{pasoActual.titulo}</p>
                            <p className="text-xs text-white/60 leading-relaxed mb-4">{pasoActual.texto}</p>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={saltarTutorial}
                                    className="text-[10px] font-semibold text-white/40 hover:text-white/70 transition-colors"
                                >
                                    Saltar
                                </button>
                                <button
                                    onClick={avanzarTutorial}
                                    className="flex items-center gap-1 text-xs font-bold text-black bg-[#E8B04B] hover:bg-[#f0c06a] px-3 py-1.5 rounded-sm transition-colors"
                                >
                                    {pasoTutorial < pasos.length - 1 ? "Siguiente" : "Entendido"}
                                    <ChevronRight size={13} />
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 mt-3">
                                {pasos.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-colors ${
                                            i <= pasoTutorial ? "bg-[#E8B04B]" : "bg-white/10"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

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