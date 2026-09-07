import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { TerapisAuthContext } from '../../context/TerapisAuthContext';

export default function TerapisProtectedRoute() {
  const { terapisToken } = useContext(TerapisAuthContext);

  if (!terapisToken) {
    return <Navigate to="/terapis/login" replace />;
  }

  return <Outlet />;
}
