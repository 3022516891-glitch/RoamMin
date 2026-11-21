import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { communityApi } from '../api/community';
import { buddyApi } from '../api/buddy';
import { useAuthStore } from '../stores/authStore';
import { useAsync } from '../hooks/useAsync';
import LoadState from '../components/LoadState';
import TripCard from '../components/TripCard';
import BuddyCard from '../components/BuddyCard';
import { verificationApi } from '../api/verification';

export default function AccountPage() {
  const user = useAuthStore(state => state.user)!;
  const load = useCallback(async () => {
    const [trips, favorites, posts, verification] = await Promise.all([communityApi.mine(), communityApi.favorites(), buddyApi.mine(), verificationApi.status()]);
    return { trips, favorites, posts, verification };
  }, []);
  const { data, loading, error, reload } = useAsync(load);
  return <div className="account-page">
    <div className="account-heading"><div><span className="eyebrow">MY TRAVEL SPACE</span><h1>你好，{user.nickname}</h1><p>每一次出发，都从这里开始。</p></div><Link className="button" to="/buddy/create">发布搭子邀约 ＋</Link></div>
    <div className="account-layout"><aside className="account-sidebar panel"><span className="avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.nickname}的头像`}/> : user.nickname[0]}</span><h2>{user.nickname}</h2><p className="muted">@{user.username}</p>{data && <Link className={data.verification.verified ? 'verification-badge verified' : 'verification-badge'} to="/verification">{data.verification.verified ? '✓ 已实名认证' : '○ 未实名认证 · 去认证'}</Link>}<p>{user.bio || '介绍一下自己，让旅伴更了解你。'}</p><Link className="button secondary full" to="/profile">编辑个人资料</Link><div className="account-side-links"><Link to={`/users/${user.id}`}>查看我的公开主页 ↗</Link><Link to="/my-posts">我的发布 →</Link><Link to="/favorites">我的收藏 →</Link></div></aside>
      <div className="account-main"><LoadState loading={loading} error={error} retry={() => void reload()}/>{data && !error && <>
        <div className="account-stats"><Link to="/my-posts"><strong>{data.trips.filter(t => t.isPublic).length}</strong><span>公开行程 →</span></Link><Link to="/favorites"><strong>{data.favorites.length}</strong><span>收藏行程 →</span></Link><Link to="/my-posts"><strong>{data.posts.length}</strong><span>搭子邀约 →</span></Link></div>
        <section className="account-section"><div className="section-heading"><h2>我的旅行发布</h2><Link className="text-link" to="/my-posts">管理全部 →</Link></div><div className="account-trip-grid">{data.trips.filter(t => t.isPublic).slice(0,2).map(trip => <TripCard key={trip.id} trip={trip} onChange={reload}/>)}</div>{!data.trips.some(t => t.isPublic) && <div className="account-empty">还没有公开行程。<Link to="/my-posts">管理我的行程 →</Link></div>}</section>
        <section className="account-section"><div className="section-heading"><h2>收藏的旅行灵感</h2><Link className="text-link" to="/favorites">查看全部 →</Link></div>{data.favorites.length ? <div className="account-trip-grid">{data.favorites.slice(0,2).map(trip => <TripCard key={trip.id} trip={trip} onChange={reload}/>)}</div> : <div className="account-empty">还没有收藏。<Link to="/community">去社区找一点灵感 →</Link></div>}</section>
        <section className="account-section"><div className="section-heading"><h2>我的搭子邀约</h2><Link className="text-link" to="/buddy/create">发起邀约 →</Link></div>{data.posts.length ? data.posts.slice(0,2).map(post => <BuddyCard key={post.id} post={post}/>) : <div className="account-empty">还没有搭子帖。<Link to="/buddy/create">邀请新朋友一起出发 →</Link></div>}</section>
      </>}</div>
    </div>
  </div>;
}
