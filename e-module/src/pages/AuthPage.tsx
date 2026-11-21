import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { mock, useMock } from '../api/mock';
import { useAuthStore } from '../stores/authStore';
export default function AuthPage({ register = false }: { register?: boolean }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [username, setUsername] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const login = useAuthStore(s => s.login); const navigate = useNavigate(); const location = useLocation();
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('');
    if (register && password !== confirmation) { setError('两次输入的密码不一致'); return; }
    if (register && username.trim().length < 2) { setError('用户名至少需要两个字符'); return; }
    setBusy(true);
    try {
      if (register) await authApi.register({ email, password, username });
      await login({ email, password });
      const from: unknown = location.state?.from;
      navigate(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !from.startsWith('/login') && !from.startsWith('/register') ? from : '/me', { replace: true });
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <div className="auth-layout"><div className="auth-story"><div className="eyebrow">YOUR JOURNEY STARTS HERE</div><h1>把向往的远方，<br/>变成自己的故事。</h1><p>一个账号，连接你的旅行生活。<br/>保存灵感、分享路线，遇见同行的人。</p><div className="story-stamp">福州 · 青旅<br/><small>EXPLORE TOGETHER</small></div></div><section className="auth-form">
    <div className="auth-tabs"><Link className={!register ? 'selected' : ''} to="/login" state={location.state}>账号登录</Link><Link className={register ? 'selected' : ''} to="/register" state={location.state}>注册账号</Link></div>
    <span className="eyebrow">{register ? 'NEW ADVENTURE' : 'WELCOME BACK'}</span><h2>{register ? '创建你的账号' : '欢迎回来，旅行者'}</h2><p className="muted">{register ? '加入青旅，收集沿途的风景。' : '登录后进入个人中心，管理资料、发布与收藏。'}</p>
    <form onSubmit={submit}>{register && <label>用户名<input required minLength={2} maxLength={50} value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" placeholder="给自己起个名字"/></label>}<label>邮箱地址<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="请输入邮箱地址" autoComplete="email"/></label><label>密码<div className="password-field"><input required minLength={8} maxLength={72} type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="至少 8 个字符" autoComplete={register ? 'new-password' : 'current-password'}/><button type="button" aria-label={visible ? '隐藏密码' : '显示密码'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? '隐藏' : '显示'}</button></div></label>{register && <label>确认密码<input required minLength={8} maxLength={72} type={visible ? 'text' : 'password'} value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="new-password" placeholder="再次输入密码"/></label>}{error && <p role="alert" className="error">{error}</p>}<button disabled={busy} className="button full">{busy ? '正在处理…' : register ? '注册并登录 ↗' : '登录，继续旅行 ↗'}</button></form>
    <Link className="guest-link" to="/community">先以游客身份逛逛社区 →</Link>
    {useMock && <div className="demo-note"><strong>前端演示账号</strong><p>邮箱：{mock.user().email}<br/>密码：demo123456</p>{!register && <button type="button" className="button secondary full" onClick={() => { setEmail(mock.user().email); setPassword('demo123456'); setError(''); }}>填入演示账号</button>}<p>尚未连接后端。演示注册请使用密码 demo123456；仅保存一份本地用户资料，不保存真实密码。</p></div>}</section></div>;
}
