import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import SidebarLayout from 'layouts/SidebarLayout';
import PublicLayout from 'layouts/PublicLayout';

// UIS ERRORS
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';

// UI PÚBLICO (Pelis Club) — todo vive en Home, incluido el login (modal)
import Home from 'pages/home/Home';

// UI PRIVADAS
// UI ADMIN
import StaffHome from 'pages/staff/Home';

// UI GENEROS
import ListarGeneros from 'pages/genero/Index';
import AgregarGenero from 'pages/genero/Store';
import EditarGenero from 'pages/genero/Update';

// UI ACTORES
import ListarActores from 'pages/actor/Index';
import AgregarActor from 'pages/actor/Store';
import EditarActor from 'pages/actor/Update';

// UI PELICULAS
import ListarPeliculas from 'pages/pelicula/Index';
import AgregarPelicula from 'pages/pelicula/Store';
import EditarPelicula from 'pages/pelicula/Update';

// UI VIDEO
import GestionVideo from 'pages/video/Gestion'; 

// UI LEGAL
import PoliticaPrivacidad from 'pages/legal/PoliticaPrivacidad';
import Terminos from 'pages/legal/Terminos';

// SETTINGS
import ListarRoles from 'pages/rol/Index';

// Utilities
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function AppContent() {
  return (
    <Routes>
      {/* 1. SITIO PÚBLICO — una sola página, el login vive en un modal desde el TopBar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/terminos" element={<Terminos />} />
      </Route>

      {/* 2. PANEL ADMIN — solo admin/superadmin */}
      <Route element={<ProtectedRoute element={<SidebarLayout />} />}>

        <Route path="/home" element={<ProtectedRoute element={<StaffHome />} />} />

        {/* ROLES Y PERMISOS */}
        <Route path="/rol/listar" element={<ProtectedRoute requiredPermission="rol.index" element={<ListarRoles />} />} />

        {/* GENEROS */}
        <Route path="/genero/listar" element={<ProtectedRoute requiredPermission="genero.index" element={<ListarGeneros />} />} />
        <Route path="/genero/agregar" element={<ProtectedRoute requiredPermission="genero.store" element={<AgregarGenero />} />} />
        <Route path="/genero/editar/:id" element={<ProtectedRoute requiredPermission="genero.update" element={<EditarGenero />} />} />

        {/* ACTORES */}
        <Route path="/actor/listar" element={<ProtectedRoute requiredPermission="actor.index" element={<ListarActores />} />} />
        <Route path="/actor/agregar" element={<ProtectedRoute requiredPermission="actor.store" element={<AgregarActor />} />} />
        <Route path="/actor/editar/:id" element={<ProtectedRoute requiredPermission="actor.update" element={<EditarActor />} />} />

        {/* PELICULAS */}
        <Route path="/pelicula/listar" element={<ProtectedRoute requiredPermission="pelicula.index" element={<ListarPeliculas />} />} />
        <Route path="/pelicula/agregar" element={<ProtectedRoute requiredPermission="pelicula.store" element={<AgregarPelicula />} />} />
        <Route path="/pelicula/editar/:id" element={<ProtectedRoute requiredPermission="pelicula.update" element={<EditarPelicula />} />} />

        {/* VIDEO */}
        <Route path="/video/gestionar" element={<ProtectedRoute requiredPermission="video.index" element={<GestionVideo />} />} />

      </Route>

      {/* 3. ERRORES */}
      <Route path="/401" element={<ErrorPage401 />} />
      <Route path="*" element={<ErrorPage404 />} />
    </Routes>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-black text-white">
            <AppContent />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;