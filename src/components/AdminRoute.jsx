import { Navigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import LoadingSpinner from './ui/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <LoadingSpinner size="lg" text="Checking admin access..." />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}