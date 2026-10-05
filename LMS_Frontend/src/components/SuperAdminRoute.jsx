import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function SuperAdminRoute({ children }) {
  const { admin } = useAdminAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (admin.role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
