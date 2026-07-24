import React, { useEffect } from 'react';
import { ArrowLeft, Clapperboard } from 'lucide-react';

const NotFoundPage = () => {
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

        {/* Icono animado */}
        <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-10 flex justify-center">
          <div className="inline-flex items-center justify-center w-28 h-28 border border-[#E8B04B]/30 rounded-full relative animate-float bg-white/5">
            <div className="absolute inset-2 border border-dashed border-[#E8B04B]/30 rounded-full opacity-60"></div>
            <Clapperboard className="text-[#E8B04B]" size={44} />
          </div>
        </div>

        <span className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out block text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8B04B] mb-3">
          Película no encontrada
        </span>

        <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-8xl font-black tracking-tighter text-white mb-2">
          404
        </h1>

        <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-xs font-bold uppercase tracking-[0.4em] text-white/60 mb-8">
          Fuera de cartelera
        </h2>

        <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-10 px-2 leading-relaxed text-white/60 text-sm">
          El título que buscas no está disponible en nuestro catálogo. Volvamos a la sala principal.
        </p>

        <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out flex justify-center">
          <a
            href="/"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Volver al catálogo
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
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

export default NotFoundPage;