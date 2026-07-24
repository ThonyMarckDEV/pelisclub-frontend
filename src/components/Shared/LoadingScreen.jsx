import React from 'react';
import { FadeLoader } from 'react-spinners';
import logo from 'assets/img/logo.png';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all duration-300">

      <img
        src={logo}
        alt="Pelis Club"
        className="h-40 w-auto mb-8 animate-pulse"
      />

      <p className="mt-6 text-white/40 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
        Cargando
      </p>

    </div>
  );
};

export default LoadingScreen;