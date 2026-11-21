import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export default function AuthGuard() {
  const { user, initialized } = useAuthStore(); const location = useLocation();
  if (!initialized) return <p className="state">正在检查登录状态…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return <Outlet />;
}
