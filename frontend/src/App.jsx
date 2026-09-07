import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { TerapisAuthProvider } from './context/TerapisAuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <TerapisAuthProvider>
            <AppRoutes />
          </TerapisAuthProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
