import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import AuthGuard from '../components/AuthGuard';
import AuthPage from '../pages/AuthPage';
import CommunityPage from '../pages/CommunityPage';
import TripDetailPage from '../pages/TripDetailPage';
import ProfilePage from '../pages/ProfilePage';
import UserHomePage from '../pages/UserHomePage';
import MyTripsPage from '../pages/MyTripsPage';
import AccountPage from '../pages/AccountPage';
import { BuddyListPage, BuddyDetailPage, BuddyEditorPage } from '../pages/BuddyPages';
import VerificationPage from '../pages/VerificationPage';
import VerifiedGuard from '../components/VerifiedGuard';
export const router = createBrowserRouter([{ element: <App/>, errorElement: <p className="state">页面加载失败，请刷新后重试。</p>, children: [
  { path: '/', element: <Navigate to="/community" replace/> },
  { path: '/login', element: <AuthPage key="login"/> }, { path: '/register', element: <AuthPage key="register" register/> },
  { path: '/community', element: <CommunityPage/> }, { path: '/community/trips/:id', element: <TripDetailPage/> },
  { path: '/users/:id', element: <UserHomePage/> }, { path: '/buddy', element: <BuddyListPage/> }, { path: '/buddy/:id', element: <BuddyDetailPage/> },
  { element: <AuthGuard/>, children: [
    { path: '/me', element: <AccountPage/> },
    { path: '/profile', element: <ProfilePage/> }, { path: '/my-posts', element: <MyTripsPage/> }, { path: '/favorites', element: <MyTripsPage favorites/> },
    { path: '/verification', element: <VerificationPage/> },
    { element: <VerifiedGuard/>, children: [{ path: '/buddy/create', element: <BuddyEditorPage/> }] },
    { path: '/buddy/:id/edit', element: <BuddyEditorPage/> }
  ] },
  { path: '*', element: <div className="state">页面不存在。<a href="/community">返回社区</a></div> }
] }]);
