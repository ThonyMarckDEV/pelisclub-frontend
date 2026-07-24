import React, { useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Film } from 'lucide-react';

const UnauthorizedPage = () => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-in');
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-show');
      }, 150 * index);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans p-4 relative overflow-hidden">
      {/* Fondo con gradiente igual al hero del Home */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-[#2A0E10] via-[#17070A] to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      <div className="relative z-10 text-center max-w-lg">

        {/* Icono principal */}
        <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-8 flex justify-center">
          <div className="relative inline-flex items-center justify-center border border-[#E8B04B]/30 p-6 rounded-full bg-white/5">
            <ShieldAlert className="text-5xl text-[#E8B04B]" size={48} />
            <Film className="text-white bg-black rounded-full p-1 absolute -bottom-1 -right-1 border border-[#E8B04B]/40" size={26} />
          </div>
        </div>

        <span className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out block text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8B04B] mb-3">
          Acceso restringido
        </span>

        <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-6xl font-black text-white mb-2">
          401
        </h1>

        <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-6">
          Área reservada
        </h2>

        <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-10 leading-relaxed text-white/60 text-sm">
          No tienes permiso para ver este contenido. Inicia sesión con una cuenta autorizada o vuelve al catálogo.
        </p>

        <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out">
          <a
            href="/"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Volver al inicio
          </a>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default UnauthorizedPage;