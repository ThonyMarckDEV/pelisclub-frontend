import { useState, useEffect, useCallback } from 'react';

export const usePwaInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [instalable, setInstalable] = useState(false);
    const [yaInstalada, setYaInstalada] = useState(false);

    useEffect(() => {
        // Si el navegador ya reporta que corre como app instalada (standalone), no mostramos nada
        const esStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setYaInstalada(esStandalone);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setInstalable(true);
        };

        const handleAppInstalled = () => {
            setInstalable(false);
            setDeferredPrompt(null);
            setYaInstalada(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const instalar = useCallback(async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstalable(false);
        }
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    return { instalable, yaInstalada, instalar };
};