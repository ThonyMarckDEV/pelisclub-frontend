import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import SidebarLayout from 'layouts/SidebarLayout';
import PublicLayout from 'layouts/PublicLayout';
import DevToolsGuard from 'components/Shared/DevToolsGuard';

import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';

import Home from 'pages/home/Home';

import StaffHome from 'pages/staff/Home';

import ListarGeneros from 'pages/genero/Index';
import AgregarGenero from 'pages/genero/Store';
import EditarGenero from 'pages/genero/Update';

import ListarActores from 'pages/actor/Index';
import AgregarActor from 'pages/actor/Store';
import EditarActor from 'pages/actor/Update';

import ListarPeliculas from 'pages/pelicula/Index';
import AgregarPelicula from 'pages/pelicula/Store';
import EditarPelicula from 'pages/pelicula/Update';

import GestionVideo from 'pages/video/Gestion';

import ListarSeries from 'pages/serie/Index';
import AgregarSerie from 'pages/serie/Store';
import EditarSerie from 'pages/serie/Update';

import GestionTemporadas from 'pages/temporada/Gestion';

import PoliticaPrivacidad from 'pages/legal/PoliticaPrivacidad';
import Terminos from 'pages/legal/Terminos';

import ListarRoles from 'pages/rol/Index';

import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function AppContent() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/terminos" element={<Terminos />} />
      </Route>

      <Route element={<ProtectedRoute element={<SidebarLayout />} />}>

        <Route path="/home" element={<ProtectedRoute requiredPermission="rol.index"  element={<StaffHome />} />} />

        <Route path="/rol/listar" element={<ProtectedRoute requiredPermission="rol.index" element={<ListarRoles />} />} />

        <Route path="/genero/listar" element={<ProtectedRoute requiredPermission="genero.index" element={<ListarGeneros />} />} />
        <Route path="/genero/agregar" element={<ProtectedRoute requiredPermission="genero.store" element={<AgregarGenero />} />} />
        <Route path="/genero/editar/:id" element={<ProtectedRoute requiredPermission="genero.update" element={<EditarGenero />} />} />

        <Route path="/actor/listar" element={<ProtectedRoute requiredPermission="actor.index" element={<ListarActores />} />} />
        <Route path="/actor/agregar" element={<ProtectedRoute requiredPermission="actor.store" element={<AgregarActor />} />} />
        <Route path="/actor/editar/:id" element={<ProtectedRoute requiredPermission="actor.update" element={<EditarActor />} />} />

        <Route path="/pelicula/listar" element={<ProtectedRoute requiredPermission="pelicula.index" element={<ListarPeliculas />} />} />
        <Route path="/pelicula/agregar" element={<ProtectedRoute requiredPermission="pelicula.store" element={<AgregarPelicula />} />} />
        <Route path="/pelicula/editar/:id" element={<ProtectedRoute requiredPermission="pelicula.update" element={<EditarPelicula />} />} />

        <Route path="/serie/listar" element={<ProtectedRoute requiredPermission="serie.index" element={<ListarSeries />} />} />
        <Route path="/serie/agregar" element={<ProtectedRoute requiredPermission="serie.store" element={<AgregarSerie />} />} />
        <Route path="/serie/editar/:id" element={<ProtectedRoute requiredPermission="serie.update" element={<EditarSerie />} />} />

        <Route path="/temporada/gestionar" element={<ProtectedRoute requiredPermission="temporada.index" element={<GestionTemporadas />} />} />

        <Route path="/video/gestionar" element={<ProtectedRoute requiredPermission="video.index" element={<GestionVideo />} />} />

      </Route>

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
          <DevToolsGuard>
            <div className="min-h-screen bg-black text-white">
              <AppContent />
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </DevToolsGuard>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;