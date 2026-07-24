import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from 'services/authService';
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout as logoutAction } from 'js/logout';
import LoadingScreen from 'components/Shared/LoadingScreen';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async () => {
        const token = jwtUtils.getAccessTokenFromCookie();

        if (!token) {
            handleLogoutState();
            return;
        }

        try {
            const response = await authService.verifySession();
            const userData = response.data || response;

            setUser(userData);
            setRole(userData.rol?.nombre || userData.rol || null);
            setPermissions(userData.permisos || []);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Sesión no válida:", error);
            logoutAction();
            handleLogoutState();
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutState = () => {
        setUser(null);
        setRole(null);
        setPermissions([]);
        setIsAuthenticated(false);
        setLoading(false);
    };

    const can = (permissionName) => {
        return permissions.includes(permissionName);
    };

    useEffect(() => {
        checkAuth();
        // eslint-disable-next-line
    }, []);

    // Refresca sesión desde /me (lo que ya tenías)
    const login = async () => {
        setLoading(true);
        await checkAuth();
    };

    // ================= LOGIN STAFF (usuario/contraseña) =================
    const loginStaff = async (username, password, rememberMe) => {
        const result = await authService.login(username, password, rememberMe);
        document.cookie = `access_token=${result.access_token}; path=/; Secure; SameSite=Strict`;
        await checkAuth();
        navigate('/home');
    };

    // ================= LOGIN GOOGLE (usuario cliente) =================
    const loginWithGoogle = async (code) => {
        const result = await authService.loginGoogle(code);
        document.cookie = `access_token=${result.access_token}; path=/; Secure; SameSite=Strict`;
        await checkAuth();
        // no navega, se queda donde el usuario estaba (Home)
    };

    const logout = () => {
        logoutAction();
        handleLogoutState();
    };

    const isStaff = role === 'admin' || role === 'superadmin';

    return (
        <AuthContext.Provider value={{
            user,
            role,
            permissions,
            can,
            isAuthenticated,
            isStaff,
            loading,
            login,
            loginStaff,
            loginWithGoogle,
            logout
        }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);