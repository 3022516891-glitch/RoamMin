import { useCallback, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verificationApi } from '../api/verification';
import { useAsync } from '../hooks/useAsync';
import LoadState from '../components/LoadState';

export default function VerificationPage() {
  const load = useCallback(() => verificationApi.status(), []);
  const { data, loading, error: loadError, reload } = useAsync(load);
  const [realName, setRealName] = useState(''); const [idNumber, setIdNumber] = useState('');
  const [consent, setConsent] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const navigate = useNavigate(); const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/me';
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { await verificationApi.verify({ realName, idNumber, consent }); navigate(from, { replace: true }); }
    catch (submitError) { setError((submitError as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="verification-page"><div className="verification-intro"><span className="eyebrow">TRUSTED TRAVELER</span><h1>先确认身份，<br/>再发起同行邀约。</h1><p>实名认证用于提高结伴信息的可信度。认证后，你才可以发布新的搭子帖。</p><div className="verification-points"><span>01 · 仅用于身份核验</span><span>02 · 页面不会公开证件信息</span><span>03 · 演示模式不保存姓名和证件号</span></div></div><section className="panel verification-form"><LoadState loading={loading} error={loadError} retry={() => void reload()}/>{!loading && !loadError && data?.verified ? <div className="verified-result"><span className="verified-seal">✓</span><h2>实名认证已完成</h2><p>你现在可以发布旅行邀约。</p><Link className="button" to={from}>继续发布邀约 ↗</Link></div> : !loading && !loadError && <><span className="eyebrow">IDENTITY VERIFICATION</span><h2>实名认证</h2><p className="muted">请填写与有效证件一致的信息。</p><form onSubmit={submit}><label>真实姓名<input autoComplete="name" required maxLength={50} value={realName} onChange={event => setRealName(event.target.value)} placeholder="请输入真实姓名"/></label><label>身份证号码<input autoComplete="off" inputMode="text" required maxLength={18} value={idNumber} onChange={event => setIdNumber(event.target.value.toUpperCase())} placeholder="18 位身份证号码"/></label><label className="verification-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/><span>我确认以上信息属于本人，并同意仅将其用于实名认证。</span></label>{error && <p className="error" role="alert">{error}</p>}<button className="button full" disabled={busy}>{busy ? '认证中…' : '提交认证'}</button><Link className="guest-link" to="/buddy">暂不认证，返回搭子广场</Link></form></>}</section></div>;
}
