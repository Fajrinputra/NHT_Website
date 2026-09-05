import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [klien, setKlien] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nht_token'));
  const [loading, setLoading] = useState(true);

  // Load user on mount or token change
  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('nht_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await getMe();
      setKlien(res.data.data);
    } catch {
      // Token tidak valid — bersihkan
      localStorage.removeItem('nht_token');
      localStorage.removeItem('nht_klien');
      setToken(null);
      setKlien(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginCtx = (newToken, klienData) => {
    localStorage.setItem('nht_token', newToken);
    localStorage.setItem('nht_klien', JSON.stringify(klienData));
    setToken(newToken);
    setKlien(klienData);
  };

  const logoutCtx = () => {
    localStorage.removeItem('nht_token');
    localStorage.removeItem('nht_klien');
    setToken(null);
    setKlien(null);
  };

  return (
    <AuthContext.Provider value={{ klien, token, loading, loginCtx, logoutCtx, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
