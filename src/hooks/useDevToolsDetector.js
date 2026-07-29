import { useEffect, useState, useRef } from 'react';

const THRESHOLD = 160;

export const useDevToolsDetector = (enabled = true) => {
    const [devToolsAbierto, setDevToolsAbierto] = useState(false);
    const detectadoRef = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const detectarPorTamano = () => {
            const anchoDiff = window.outerWidth - window.innerWidth;
            const altoDiff = window.outerHeight - window.innerHeight;
            return anchoDiff > THRESHOLD || altoDiff > THRESHOLD;
        };

        const detectarPorConsola = () => {
            const marcador = new Image();
            let activado = false;

            Object.defineProperty(marcador, 'id', {
                get() {
                    activado = true;
                    return '';
                },
            });

            // eslint-disable-next-line no-console
            console.log('%c', marcador);
            console.clear();

            return activado;
        };

        const chequear = () => {
            if (detectadoRef.current) return;

            const abierto = detectarPorTamano() || detectarPorConsola();

            if (abierto) {
                detectadoRef.current = true;
                setDevToolsAbierto(true);
            }
        };

        chequear();
        const interval = setInterval(chequear, 700);
        window.addEventListener('resize', chequear);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', chequear);
        };
    }, [enabled]);

    return devToolsAbierto;
};