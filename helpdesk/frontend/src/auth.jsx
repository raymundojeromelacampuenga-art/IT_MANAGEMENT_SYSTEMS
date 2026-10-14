import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const KEY = 'helpdesk_auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(() => localStorage.getItem(KEY) === '1');

  const login = (username, password) => {
    const ok = username === 'itadmin' && password === 'helpdesk123';
    if (ok) localStorage.setItem(KEY, '1');
    setAuthed(ok);
    return ok;
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setAuthed(false);
  };

  return <AuthContext.Provider value={{ authed, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function ProtectedRoute({ children }) {
  const { authed } = useAuth();
  const location = useLocation();
  return authed ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
