import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStatus } from '../hooks/useAuthStatus';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = () => {
  const { loggedIn, loadingStatus } = useAuthStatus();

  if (loadingStatus) {
    return <LoadingSpinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
