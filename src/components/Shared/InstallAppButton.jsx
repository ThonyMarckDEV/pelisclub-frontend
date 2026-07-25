import React from 'react';
import { Download } from 'lucide-react';
import { usePwaInstall } from 'hooks/usePwaInstall';

const InstallAppButton = () => {
    const { instalable, yaInstalada, instalar } = usePwaInstall();

    if (!instalable || yaInstalada) return null;

    return (
        <button
            onClick={instalar}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white/20 transition-colors"
        >
            <Download size={14} />
            Instalar app
        </button>
    );
};

export default InstallAppButton;