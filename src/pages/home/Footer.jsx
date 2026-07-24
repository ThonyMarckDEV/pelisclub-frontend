import React from "react";
import { Link } from "react-router-dom";
import { Clapperboard } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-white/10 bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

        {/* MARCA */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clapperboard size={20} className="text-[#E8B04B]" />
            <span className="text-white font-black text-lg uppercase tracking-wide">
              Pelis Club
            </span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed max-w-xs">
            Ningún archivo de visualización y/o descarga se encuentra alojado en nuestros servidores.
          </p>
        </div>

        {/* NAVEGACION */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">
            Explorar
          </span>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-white/50 text-xs font-semibold hover:text-[#E8B04B] transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/?filtro=populares" className="text-white/50 text-xs font-semibold hover:text-[#E8B04B] transition-colors">
                Populares
              </Link>
            </li>
            <li>
              <Link to="/?filtro=recientes" className="text-white/50 text-xs font-semibold hover:text-[#E8B04B] transition-colors">
                Recién agregadas
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">
            Información
          </span>
          <ul className="space-y-2">
            <li>
              <Link to="/terminos" className="text-white/50 text-xs font-semibold hover:text-[#E8B04B] transition-colors">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link to="/privacidad" className="text-white/50 text-xs font-semibold hover:text-[#E8B04B] transition-colors">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-[11px]">
          © {new Date().getFullYear()} Pelis Club. Todos los derechos reservados.
        </p>
        <p className="text-white/20 text-[11px]">
          Hecho con <span className="text-[#E8B04B]">♥</span> para los amantes del cine
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;