import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const TerapisAuthContext = createContext();

export const TerapisAuthProvider = ({ children }) => {
  const [terapisToken, setTerapisToken] = useState(localStorage.getItem('nata_terapis_token') || null);
  const [terapisUser, setTerapisUser] = useState(() => {
    const saved = localStorage.getItem('nata_terapis_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();

  const loginTerapis = (token, userData) => {
    setTerapisToken(token);
    setTerapisUser(userData);
    localStorage.setItem('nata_terapis_token', token);
    localStorage.setItem('nata_terapis_user', JSON.stringify(userData));
    navigate('/terapis/jadwal');
  };

  const logoutTerapis = () => {
    setTerapisToken(null);
    setTerapisUser(null);
    localStorage.removeItem('nata_terapis_token');
    localStorage.removeItem('nata_terapis_user');
    navigate('/terapis/login');
  };

  useEffect(() => {
    // Optional: Validate token on mount
  }, []);

  return (
    <TerapisAuthContext.Provider value={{ terapisToken, terapisUser, loginTerapis, logoutTerapis }}>
      {children}
    </TerapisAuthContext.Provider>
  );
};
