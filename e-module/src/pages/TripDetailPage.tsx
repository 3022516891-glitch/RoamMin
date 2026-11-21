import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { communityApi } from '../api/community';
import { useAsync } from '../hooks/useAsync';
import LoadState from '../components/LoadState';
import { useAuthStore } from '../stores/authStore';
export default function TripDetailPage() {
  const id = Number(useParams().id); const load = useCallback(() => communityApi.detail(id), [id]); const { data: trip, loading, error, reload } = useAsync(load);
  const user = useAuthStore(state => state.user); const navigate = useNavigate(); const location = useLocation(); const [busy, setBusy] = useState(false); const [actionError, setActionError] = useState('');
  async function toggle(kind: 'like' | 'favorite') { if (!trip) return; if (!user) { navigate('/login', { state: { from: location.pathname } }); return; } setBusy(true); setActionError(''); try { await communityApi.toggle(id, kind, !(kind === 'like' ? trip.liked : trip.favorited)); await reload(); } catch (toggleError) { setActionError((toggleError as Error).message); } finally { setBusy(false); } }
  return <><Link className="back-link" to="/community">← 返回社区</Link><LoadState loading={loading} error={error} retry={() => void reload()}/>{trip && !error && <><section className={`detail-banner ${trip.color}`}><span className="eyebrow">公开行程 · 只读浏览</span><h1>{trip.title}</h1><p>{trip.destination} · {trip.startDate} — {trip.endDate}</p><Link to={`/users/${trip.ownerId}`}>旅行者：{trip.author} ↗</Link><div className="manage-actions"><button className="button secondary" disabled={busy} onClick={() => void toggle('like')}>{trip.liked ? '♥ 已点赞' : '♡ 点赞'} · {trip.likeCount}</button><button className="button secondary" disabled={busy} onClick={() => void toggle('favorite')}>{trip.favorited ? '★ 已收藏' : '☆ 收藏'}</button></div>{actionError && <p className="error" role="alert">{actionError}</p>}</section><div className="detail-columns"><section className="panel"><h2>沿途的安排</h2>{trip.days.map((day, index) => <div className="day-row" key={index}><span className="day-number">DAY {String(index + 1).padStart(2, '0')}</span><h3>{day}</h3><p className="muted">详细日程与地图组件由 B 模块接入，此处先展示摘要。</p></div>)}</section><aside className="panel"><h3>关于这次旅行</h3><p>{trip.description}</p><span className="tag">{trip.days.length} 天慢旅行</span></aside></div></>}</>;
}
