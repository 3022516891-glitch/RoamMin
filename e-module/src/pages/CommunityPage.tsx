import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { communityApi } from '../api/community';
import { useAsync } from '../hooks/useAsync';
import TripCard from '../components/TripCard';
import LoadState from '../components/LoadState';
export default function CommunityPage() {
  const load = useCallback(() => communityApi.list(), []); const { data, loading, error, reload } = useAsync(load); const [city, setCity] = useState('全部');
  const [query, setQuery] = useState(''); const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const cities = ['全部', ...new Set((data ?? []).map(trip => trip.destination))]; const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = data?.filter(t => city === '全部' || t.destination === city).filter(t => !normalizedQuery || [t.title, t.destination, t.description, t.author].some(value => value.toLocaleLowerCase().includes(normalizedQuery))).sort((a, b) => sort === 'popular' ? b.likeCount - a.likeCount : b.id - a.id);
  return <><section className="hero"><div className="hero-content"><span className="eyebrow">MIN-ROAMER / COMMUNITY</span><h1>把远方，写进<br/>下一段旅程。</h1><p>发现旅行者分享的真实路线，收藏喜欢的目的地。<br/>从一份灵感开始，让旅行成为生活的一部分。</p><Link className="button" to="/buddy">寻找同行的人 ↗</Link></div><div className="hero-illustration" aria-hidden="true"/></section><div className="section-heading"><div><span className="eyebrow">TRAVEL JOURNALS</span><h2>旅行者的漫游札记</h2></div><span className="muted">由旅行者分享的真实灵感</span></div><div className="filter-bar"><label>搜索行程<input value={query} onChange={event => setQuery(event.target.value)} placeholder="标题、目的地、作者"/></label><label>排序<select value={sort} onChange={event => setSort(event.target.value as 'latest' | 'popular')}><option value="latest">最新发布</option><option value="popular">最多点赞</option></select></label><span className="muted">找到 {filtered?.length ?? 0} 条公开行程</span></div><div className="filters">{cities.map(c => <button key={c} className={city === c ? 'chip selected' : 'chip'} onClick={() => setCity(c)}>{c}</button>)}</div><LoadState loading={loading} error={error} retry={() => void reload()}/>{!loading && !error && <div className="trip-grid">{filtered?.map(trip => <TripCard key={trip.id} trip={trip} onChange={reload}/>)}</div>}{!loading && !error && !filtered?.length && <p className="state">这里还没有匹配的公开行程，换个条件看看吧。</p>}</>;
}
