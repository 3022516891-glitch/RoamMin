import { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useMock } from './api/mock';
import { applyTheme, readTheme, type Theme } from './theme';

function CompassIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-2 5.6-5.6 2 2-5.6 5.6-2Z"/></svg>;
}

export default function App() {
  const { user, logout } = useAuthStore(); const navigate = useNavigate();
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<Theme>(readTheme);
  useEffect(() => applyTheme(theme), [theme]);
  const context = pathname.startsWith('/buddy') ? '找搭子' : pathname === '/verification' ? '实名认证' : pathname.startsWith('/me') || pathname.startsWith('/profile') || pathname.startsWith('/my-posts') || pathname.startsWith('/favorites') ? '我的空间' : '旅行社区';
  return <>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" to="/community"><span className="brand-mark"><CompassIcon/></span><span className="brand-copy"><strong>MIN<span>·</span>roamer</strong><small>漫行札记</small></span></Link>
      <div className="topbar-context"><span>旅行者中心</span><b>›</b><strong>{context}</strong></div>
      <nav aria-label="主导航"><NavLink to="/community">旅行社区</NavLink><NavLink to="/buddy">找搭子</NavLink><NavLink to="/me">个人中心</NavLink></nav>
      <div className="header-account"><div className="theme-switch" role="group" aria-label="页面主题"><button aria-label="浅色主题" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>☼<span>浅色</span></button><button aria-label="深色主题" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>☾<span>深色</span></button></div>{user ? <><Link className="account-link" to="/me"><span className="mini-avatar">{user.nickname[0]}</span>{user.nickname}</Link><button className="text-button" onClick={() => { logout(); navigate('/login'); }}>退出</button></> : <><Link to="/login">登录</Link><Link className="button small secondary" to="/register">注册 ↗</Link></>}</div>
    </div></header>
    {useMock && <div className="mode-banner">本地演示模式 · 数据保存在当前浏览器，登录和互动用于前端预览</div>}
    <main className="main-container"><Outlet/></main><footer className="site-footer"><span>MIN·roamer / 漫行札记</span><span>让每一次出发，都有期待</span></footer>
  </>;
}
