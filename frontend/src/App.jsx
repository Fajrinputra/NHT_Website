import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
