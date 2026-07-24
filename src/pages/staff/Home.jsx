import React, { useMemo } from "react";
import { Film, Users, Star, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { useAuth } from "context/AuthContext";

// Placeholder — luego viene de /api/dashboard
const STATS = [
  { label: "Cortometrajes", value: 12, icon: Film },
  { label: "Usuarios registrados", value: 148, icon: Users },
  { label: "Calificación promedio", value: "4.6", icon: Star },
  { label: "Minutos vistos (mes)", value: "3,204", icon: Clock },
];

const RECIENTES = [
  { titulo: "El último rollo", estado: "publicado", fecha: "20 jul" },
  { titulo: "Retrato en Talara", estado: "procesando", fecha: "18 jul" },
  { titulo: "Marea baja", estado: "publicado", fecha: "12 jul" },
];

const ESTADO_STYLES = {
  publicado: "bg-[#1D9E75]/10 text-[#5DCAA5] border-[#1D9E75]/30",
  procesando: "bg-[#E8B04B]/10 text-[#E8B04B] border-[#E8B04B]/30",
  borrador: "bg-white/5 text-white/40 border-white/10",
};

const Home = () => {
  const { user } = useAuth();

  const saludo = useMemo(() => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 19) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#E8B04B] mb-1">
              Panel de gestión
            </p>
            <h1 className="text-2xl font-black text-white">
              {saludo}, {user?.nombre?.split(" ")[0] || "Staff"}
            </h1>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm">
            <ShieldCheck size={16} className="text-[#E8B04B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              {user?.rol}
            </span>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#0D0C0E] border border-white/10 rounded-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-sm bg-[#B8232B]/15 flex items-center justify-center">
                    <Icon size={16} className="text-[#B8232B]" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wide mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* GRID INFERIOR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SUBIDOS RECIENTES */}
          <div className="lg:col-span-2 bg-[#0D0C0E] border border-white/10 rounded-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black text-sm uppercase tracking-wide flex items-center gap-2">
                <TrendingUp size={16} className="text-[#E8B04B]" />
                Subidos recientes
              </h3>
            </div>

            <div className="space-y-1">
              {RECIENTES.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 px-3 rounded-sm hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-sm bg-black flex items-center justify-center border border-white/10">
                      <Film size={16} className="text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.titulo}</p>
                      <p className="text-[11px] text-white/30">{item.fecha}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border ${ESTADO_STYLES[item.estado]}`}
                  >
                    {item.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ACCESOS RÁPIDOS */}
          <div className="bg-[#0D0C0E] border border-white/10 rounded-sm p-6">
            <h3 className="text-white font-black text-sm uppercase tracking-wide mb-5">
              Accesos rápidos
            </h3>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 py-3 px-3 rounded-sm bg-[#E8B04B] text-black text-sm font-bold hover:bg-[#f0c06a] transition-colors">
                <Film size={16} />
                Subir cortometraje
              </button>
              <button className="w-full flex items-center gap-3 py-3 px-3 rounded-sm bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors">
                <Users size={16} />
                Ver usuarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;