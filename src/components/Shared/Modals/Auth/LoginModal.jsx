import React, { useState } from "react";
import { X, ShieldCheck, User } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";
import LoadingScreen from "components/Shared/LoadingScreen";
import logo from "assets/img/logo.png";

const LoginModal = ({ onClose }) => {
  const { loginWithGoogle, loginStaff } = useAuth();
  const [tab, setTab] = useState("cliente"); // 'cliente' | 'staff'

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        await loginWithGoogle(codeResponse.code);
        toast.success("Sesión iniciada");
        onClose();
      } catch (error) {
        toast.error("No se pudo iniciar sesión con Google");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("No se pudo iniciar sesión con Google"),
  });

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginStaff(username, password, rememberMe);
      toast.success("Bienvenido al panel");
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Credenciales inválidas";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-[#111013] border border-white/10 rounded-lg shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={logo}
            alt="Pelis Club"
            className="h-20 w-20 object-contain mb-3"
          />
          <h2 className="text-lg font-black text-white uppercase tracking-wide">
            Entra a Pelis Club
          </h2>
          <p className="text-xs text-white/40 mt-2">
            Guarda favoritos y continúa viendo donde lo dejaste
          </p>
        </div>

        {/* SWITCH DE TABS */}
        <div className="flex items-center bg-white/5 rounded-sm p-1 mb-6">
          <button
            onClick={() => setTab("cliente")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors ${
              tab === "cliente" ? "bg-[#E8B04B] text-black" : "text-white/50 hover:text-white/80"
            }`}
          >
            <User size={13} /> Usuario
          </button>
          <button
            onClick={() => setTab("staff")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors ${
              tab === "staff" ? "bg-[#E8B04B] text-black" : "text-white/50 hover:text-white/80"
            }`}
          >
            <ShieldCheck size={13} /> Staff
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingScreen />
          </div>
        ) : tab === "cliente" ? (
          // ================= LOGIN GOOGLE =================
          <button
            onClick={() => googleLogin()}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            Continuar con Google
          </button>
        ) : (
          // ================= LOGIN STAFF =================
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B04B] transition-colors text-sm rounded-sm"
              placeholder="Usuario"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B04B] transition-colors text-sm rounded-sm"
              placeholder="Contraseña"
              required
            />

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#E8B04B] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-white/60 font-medium cursor-pointer select-none">
                Recordar dispositivo
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E8B04B] text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#f0c06a] transition-colors"
            >
              Ingresar al panel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;