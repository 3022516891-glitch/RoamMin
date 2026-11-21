import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usersApi } from '../api/users';
import { communityApi } from '../api/community';
import { buddyApi } from '../api/buddy';
import { useAsync } from '../hooks/useAsync';
import { useAuthStore } from '../stores/authStore';
import TripCard from '../components/TripCard';
import BuddyCard from '../components/BuddyCard';
import LoadState from '../components/LoadState';
export default function UserHomePage() {
  const id = Number(useParams().id); const me = useAuthStore(s => s.user);
  const load = useCallback(async () => ({ user: await usersApi.get(id), trips: (await communityApi.list()).filter(t => t.ownerId === id), posts: (await buddyApi.list()).filter(p => p.authorId === id) }), [id]);
  const { data, loading, error, reload } = useAsync(load);
  return <><LoadState loading={loading} error={error} retry={() => void reload()}/>{data && !error && <><section className="profile-header"><span className="avatar">{data.user.avatarUrl ? <img src={data.user.avatarUrl} alt="用户头像"/> : data.user.nickname[0]}</span><div><span className="eyebrow">TRAVELER PROFILE</span><h1>{data.user.nickname}</h1><p>@{data.user.username} · {data.user.bio}</p></div>{me?.id === id && <Link className="button secondary" to="/profile">编辑资料</Link>}</section><h2 className="block-heading">公开的旅行故事</h2><div className="trip-grid">{data.trips.map(trip => <TripCard trip={trip} key={trip.id} onChange={reload}/>)}</div>{!data.trips.length && <p className="state">还没有公开行程。</p>}<h2 className="block-heading">发起的搭子邀约</h2><div className="buddy-grid">{data.posts.map(post => <BuddyCard post={post} key={post.id}/>)}</div>{!data.posts.length && <p className="state">还没有搭子邀约。</p>}</>}</>;
}
