import { createContext, useState, useContext, useEffect } from 'react';
import { adminAuthApi } from '../api/adminApi';
import { jwtDecode } from 'jwt-decode';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('nata_admin_token'));
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminToken) {
      try {
        const decoded = jwtDecode(adminToken);
        if (decoded.role === 'admin' && decoded.exp * 1000 > Date.now()) {
          setIsAdminAuth(true);
        } else {
          logoutAdmin();
        }
      } catch (e) {
        logoutAdmin();
      }
    } else {
      setIsAdminAuth(false);
    }
    setLoading(false);
  }, [adminToken]);

  const loginAdmin = async (email, kataSandi) => {
    try {
      const response = await adminAuthApi.login(email, kataSandi);
      if (response.data.success) {
        const token = response.data.data.token;
        localStorage.setItem('nata_admin_token', token);
        setAdminToken(token);
        setIsAdminAuth(true);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Terjadi kesalahan saat login' 
      };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('nata_admin_token');
    setAdminToken(null);
    setIsAdminAuth(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuth, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
