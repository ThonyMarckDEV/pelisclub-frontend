import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useDevToolsDetector } from 'hooks/useDevToolsDetector';

const DevToolsGuard = ({ children }) => {
    const esProduccion = process.env.NODE_ENV === 'production';
    const devToolsAbierto = useDevToolsDetector(esProduccion);

    if (devToolsAbierto) {
        return (
            <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center gap-4 p-6 text-center">
                <ShieldAlert size={48} className="text-[#E8B04B]" />
                <h1 className="text-xl font-black text-white uppercase tracking-wide">
                    Acceso restringido
                </h1>
                <p className="text-sm text-white/50 max-w-sm">
                    Cierra las herramientas de desarrollador para continuar navegando en Pelis Club.
                </p>
            </div>
        );
    }

    return children;
};

export default DevToolsGuard;