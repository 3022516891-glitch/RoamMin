import { useState, type FormEvent } from 'react';
import { usersApi } from '../api/users';
import { useAuthStore } from '../stores/authStore';
export default function ProfilePage() {
  const user = useAuthStore(s => s.user)!; const setUser = useAuthStore(s => s.setUser);
  const [nickname, setNickname] = useState(user.nickname); const [bio, setBio] = useState(user.bio); const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setMessage(''); try { setUser(await usersApi.update({ nickname, bio, avatarUrl })); setMessage('个人资料已保存'); } catch (e) { setMessage((e as Error).message); } finally { setBusy(false); } }
  return <section className="panel narrow"><span className="eyebrow">YOUR PROFILE</span><h1>编辑个人资料</h1><p className="muted">让未来的旅行搭子更了解你。</p><form onSubmit={submit}><label>昵称<input required maxLength={50} value={nickname} onChange={e => setNickname(e.target.value)}/></label><label>邮箱<input readOnly value={user.email}/></label><label>个人简介<textarea maxLength={500} rows={4} value={bio} onChange={e => setBio(e.target.value)}/></label><label>头像图片地址<input type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://…"/></label><p className="muted">先使用图片 URL，文件上传接口待后端确认。</p>{message && <p role="status">{message}</p>}<button className="button" disabled={busy}>{busy ? '保存中…' : '保存资料'}</button></form></section>;
}
