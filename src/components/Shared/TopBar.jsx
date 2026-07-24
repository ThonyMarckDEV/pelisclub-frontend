import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, ShieldCheck, Search, Menu, X } from "lucide-react";
import { useAuth } from "context/AuthContext";
import LoginModal from "components/Shared/Modals/Auth/LoginModal";
import { generos as fetchGeneros } from "services/publicoService";
import logo from "assets/img/logo.png";

const CATALOGO = [
  { nombre: "Estrenos", slug: "estrenos" },
  { nombre: "Más vistos", slug: "mas-vistos" },
  { nombre: "Mejor calificados", slug: "mejor-calificados" },
  { nombre: "Todos los cortos", slug: "todos" },
];

const HoverDropdown = ({ label, items, onSelect }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-widest text-white/60 hover:text-[#E8B04B] transition-colors py-2">
        {label}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-52">
          <div className="bg-[#111013] border border-white/10 rounded-lg shadow-2xl py-2 overflow-hidden">
            {items.length > 0 ? items.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  onSelect(item.slug);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[13px] font-medium text-white/70 hover:bg-white/5 hover:text-[#E8B04B] transition-colors"
              >
                {item.nombre}
              </button>
            )) : (
              <p className="px-4 py-3 text-[12px] text-white/30 text-center">Sin géneros aún</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TopBar = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [generos, setGeneros] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGeneros = async () => {
      try {
        const response = await fetchGeneros();
        setGeneros((response.data || []).map(g => ({ nombre: g.nombre, slug: g.slug })));
      } catch (error) {
        setGeneros([]);
      }
    };
    loadGeneros();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const irAGenero = (slug) => navigate(`/?genero=${slug}`);
  const irACatalogo = (slug) => navigate(`/?filtro=${slug}`);

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-[#3A1416]">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E8B04B]/70 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={logo}
              alt="Pelis Club"
              className="h-20 w-20 md:h-16 md:w-16 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold tracking-[0.15em] text-[#F5F0E8] text-lg md:text-xl uppercase">
              Pelis<span className="text-[#E8B04B]">Club</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-[13px] font-semibold uppercase tracking-widest text-white/60 hover:text-[#E8B04B] transition-colors"
            >
              Inicio
            </Link>
            <HoverDropdown label="Catálogo" items={CATALOGO} onSelect={irACatalogo} />
            <HoverDropdown label="Géneros" items={generos} onSelect={irAGenero} />
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="hidden sm:flex p-2 text-white/60 hover:text-[#E8B04B] transition-colors"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#E8B04B]/50 transition-colors"
                >
                  {user?.foto ? (
                    <img
                      src={user.foto}
                      alt={user.nombre}
                      className="h-7 w-7 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-[#B8232B] flex items-center justify-center text-[11px] font-black text-white uppercase">
                      {user?.nombre?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden sm:block text-xs font-semibold text-white/80 max-w-[110px] truncate">
                    {user?.nombre || "Usuario"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-white/40 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#111013] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-bold text-white truncate">{user?.nombre}</p>
                      <p className="text-[11px] text-white/40 truncate">{user?.correo}</p>
                      {isStaff && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider text-[#E8B04B]">
                          <ShieldCheck size={12} /> {user?.rol}
                        </span>
                      )}
                    </div>

                    {isStaff && (
                      <Link
                        to="/home"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-[#E8B04B] transition-colors"
                      >
                        Ir al panel de gestión
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 bg-[#E8B04B] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#f0c06a] transition-colors"
              >
                Iniciar sesión
              </button>
            )}

            <button
              className="md:hidden p-2 text-white/70"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-white/10 bg-black px-4 py-3 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-sm font-semibold text-white/70 hover:text-[#E8B04B]"
            >
              Inicio
            </Link>

            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Catálogo</p>
              <div className="flex flex-wrap gap-2">
                {CATALOGO.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      irACatalogo(c.slug);
                      setMobileOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white/70 bg-white/5 rounded-full"
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>

            {generos.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Géneros</p>
                <div className="flex flex-wrap gap-2">
                  {generos.map((g) => (
                    <button
                      key={g.slug}
                      onClick={() => {
                        irAGenero(g.slug);
                        setMobileOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white/70 bg-white/5 rounded-full"
                    >
                      {g.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
        )}
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default TopBar;