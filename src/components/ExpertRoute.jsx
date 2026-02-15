import { Navigate } from 'react-router-dom';
import { useExpert } from '../hooks/useExpert';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ExpertRoute({ children }) {
  const { isExpert, loading } = useExpert();

  if (loading) {
    return <LoadingSpinner size="lg" text="Checking expert access..." />;
  }

  if (!isExpert) {
    return <Navigate to="/" replace />;
  }

  return children;
}