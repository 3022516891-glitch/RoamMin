import { useCallback, useEffect, useRef, useState } from 'react';
// 返回的函数必须由 useCallback 稳定引用；旧请求结束时不会覆盖新请求。
export function useAsync<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T>(); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const sequence = useRef(0);
  const reload = useCallback(async () => {
    const current = ++sequence.current; setLoading(true); setError('');
    try { const value = await load(); if (current === sequence.current) setData(value); }
    catch (e) { if (current === sequence.current) setError(e instanceof Error ? e.message : '加载失败'); }
    finally { if (current === sequence.current) setLoading(false); }
  }, [load]);
  useEffect(() => { void reload(); return () => { sequence.current++; }; }, [reload]);
  return { data, error, loading, reload };
}
