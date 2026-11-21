import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Trip } from '../types';
import { communityApi } from '../api/community';
import { useAuthStore } from '../stores/authStore';
export default function TripCard({ trip, onChange }: { trip: Trip; onChange: () => Promise<void> }) {
  const user = useAuthStore(s => s.user); const navigate = useNavigate(); const location = useLocation(); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function toggle(kind: 'like' | 'favorite') {
    if (!user) { navigate('/login', { state: { from: location.pathname } }); return; }
    setBusy(true); setError('');
    try { await communityApi.toggle(trip.id, kind, !(kind === 'like' ? trip.liked : trip.favorited)); await onChange(); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <article className="trip-card">
    <Link className={`trip-art ${trip.color}`} to={`/community/trips/${trip.id}`}><span className="art-city">{trip.destination}</span><span className="art-caption">CITY WALKS / 慢旅行</span><div className="hill hill-one"/><div className="hill hill-two"/><span className="art-sun"/></Link>
    <div className="card-body"><div className="meta">{trip.destination} · {trip.days.length} 天</div><Link to={`/community/trips/${trip.id}`}><h3>{trip.title}</h3></Link><p className="clamp">{trip.description}</p><div className="card-footer"><Link to={`/users/${trip.ownerId}`} className="author"><span className="mini-avatar">{trip.author[0]}</span>{trip.author}</Link><div className="actions"><button disabled={busy} className={trip.liked ? 'active' : ''} onClick={() => void toggle('like')} aria-label="点赞" aria-pressed={trip.liked}>♡ {trip.likeCount}</button><button disabled={busy} className={trip.favorited ? 'active' : ''} onClick={() => void toggle('favorite')} aria-pressed={trip.favorited}>{trip.favorited ? '★' : '☆'} 收藏</button></div></div>{error && <p className="error" role="alert">{error}</p>}</div>
  </article>;
}
