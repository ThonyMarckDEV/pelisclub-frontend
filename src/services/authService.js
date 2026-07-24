import axios from 'axios';
import API_BASE_URL from 'js/urlHelper';
import { fetchWithAuth } from 'js/authToken';
import { handleResponse } from 'utilities/Responses/handleResponse';

const login = async (username, password, rememberMe) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/login`,
    { username, password, remember_me: rememberMe },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

// code = authorization code que devuelve @react-oauth/google (flow: 'auth-code')
const loginGoogle = async (code) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/login/google`,
    { code },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

const logout = async () => {
  const response = await axios.post(
    `${API_BASE_URL}/api/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

const verifySession = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/me`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
};

const authService = {
  login,
  loginGoogle,
  logout,
  verifySession
};

export default authService;