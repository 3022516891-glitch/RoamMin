import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { communityApi } from '../api/community';
import { buddyApi } from '../api/buddy';
import { useAsync } from '../hooks/useAsync';
import LoadState from '../components/LoadState';
import TripCard from '../components/TripCard';
import BuddyCard from '../components/BuddyCard';
import MemberManager from '../components/MemberManager';
import { useAuthStore } from '../stores/authStore';
import { canManageTrip } from '../utils/permissions';
export default function MyTripsPage({ favorites = false }: { favorites?: boolean }) {
  const user = useAuthStore(s => s.user); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [membersFor, setMembersFor] = useState<number>();
  const load = useCallback(async () => ({ trips: await (favorites ? communityApi.favorites() : communityApi.mine()), posts: favorites ? [] : await buddyApi.mine() }), [favorites]); const { data, loading, error, reload } = useAsync(load);
  async function publish(id: number, isPublic: boolean) { setBusy(true); setMessage(''); try { await communityApi.publish(id, isPublic); await reload(); } catch (e) { setMessage((e as Error).message); } finally { setBusy(false); } }
  return <><div className="section-heading"><div><span className="eyebrow">YOUR COLLECTION</span><h1>{favorites ? '我的收藏' : '我的发布'}</h1></div><Link className="button" to="/buddy/create">发布搭子帖 ＋</Link></div><LoadState loading={loading} error={error} retry={() => void reload()}/>{message && <p className="error" role="alert">{message}</p>}<div className="trip-grid">{data?.trips.map(trip => <div key={trip.id}>{trip.isPublic ? <TripCard trip={trip} onChange={reload}/> : <div className="panel"><span className="tag">私有行程</span><h3>{trip.title}</h3><p>{trip.description}</p></div>}{!favorites && canManageTrip(user, trip) && <div className="manage-actions"><button disabled={busy} className="button secondary" onClick={() => void publish(trip.id, !trip.isPublic)}>{trip.isPublic ? '取消公开' : '发布到社区'}</button><button className="button secondary" onClick={() => setMembersFor(membersFor === trip.id ? undefined : trip.id)}>管理成员</button></div>}</div>)}</div>{!loading && !error && !data?.trips.length && <p className="state">{favorites ? '还没有收藏，去社区发现喜欢的行程吧。' : '尚未创建行程，行程创建功能由 B 模块接入。'}</p>}{membersFor && <MemberManager tripId={membersFor}/>} {!favorites && <><h2 className="block-heading">我发起的搭子帖</h2><div className="buddy-grid">{data?.posts.map(post => <BuddyCard post={post} key={post.id}/>)}</div>{!loading && !error && !data?.posts.length && <p className="state">还没有搭子帖，发起你的第一次邀约。</p>}</>}</>;
}
