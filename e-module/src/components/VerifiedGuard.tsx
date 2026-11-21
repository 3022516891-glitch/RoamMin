import { useCallback } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { verificationApi } from '../api/verification';
import { useAsync } from '../hooks/useAsync';
import LoadState from './LoadState';

export default function VerifiedGuard() {
  const location = useLocation();
  const load = useCallback(() => verificationApi.status(), []);
  const { data, loading, error, reload } = useAsync(load);
  if (loading || error) return <LoadState loading={loading} error={error} retry={() => void reload()}/>;
  if (!data?.verified) return <Navigate to="/verification" replace state={{ from: location.pathname }}/>;
  return <Outlet/>;
}
