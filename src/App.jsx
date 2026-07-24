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

// UI ADMIN
import StaffHome from 'pages/staff/Home';

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
      </Route>

      {/* 2. PANEL ADMIN — solo admin/superadmin */}
      <Route element={<ProtectedRoute element={<SidebarLayout />} />}>
        <Route path="/admin/home" element={<ProtectedRoute element={<StaffHome />} />} />
        <Route path="/admin/rol/listar" element={<ProtectedRoute requiredPermission="rol.index" element={<ListarRoles />} />} />
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