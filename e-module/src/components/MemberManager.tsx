import { useCallback, useEffect, useState } from 'react';
import { membersApi } from '../api/members';
import { usersApi } from '../api/users';
import { useAsync } from '../hooks/useAsync';
import type { User } from '../types';
import LoadState from './LoadState';
export default function MemberManager({ tripId }: { tripId: number }) {
  const load = useCallback(() => membersApi.list(tripId), [tripId]); const { data, loading, error: loadError, reload } = useAsync(load);
  const [query, setQuery] = useState(''); const [results, setResults] = useState<User[]>([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false; setResults([]);
    const timer = setTimeout(() => { if (query.trim()) void usersApi.search(query).then(users => { if (!cancelled) setResults(users); }).catch(e => { if (!cancelled) setError(e.message); }); }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);
  async function act(action: () => Promise<void>) { setBusy(true); setError(''); try { await action(); await reload(); setQuery(''); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }
  function confirmRemove(username: string, memberId: number) { if (window.confirm(`确定将 @${username} 移出该行程吗？`)) void act(() => membersApi.remove(tripId, memberId)); }
  return <section className="panel"><h3>管理行程成员</h3><p className="muted">按用户名搜索并直接添加成员，当前版本无需对方接受邀请。</p><LoadState loading={loading} error={loadError} retry={() => void reload()}/>{!loading && !loadError && <><label>搜索用户名<input value={query} onChange={e => setQuery(e.target.value)} placeholder="试试 xiaolin 或 ahe"/></label>{results.map(user => <div className="member-row" key={user.id}><span>{user.nickname} @{user.username}</span><button className="button secondary" disabled={busy || data?.some(m => m.userId === user.id)} onClick={() => void act(() => membersApi.add(tripId, user.id, user.username))}>{data?.some(m => m.userId === user.id) ? '已加入' : '添加'}</button></div>)}{query.trim() && !results.length && <p className="muted">没有找到匹配用户。</p>}{data?.map(member => <div className="member-row" key={member.id}><span>@{member.username} · {member.role === 'owner' ? '创建者' : '成员'}</span>{member.role !== 'owner' && <button disabled={busy} className="text-button" onClick={() => confirmRemove(member.username, member.id)}>移除</button>}</div>)}</>}{error && <p className="error" role="alert">{error}</p>}</section>;
}
