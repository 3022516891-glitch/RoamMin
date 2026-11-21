export default function LoadState({ loading, error, retry }: { loading: boolean; error: string; retry: () => void }) {
  if (loading) return <p className="state" role="status">正在加载…</p>;
  if (error) return <div className="state" role="alert"><p>{error}</p><button className="button secondary" onClick={retry}>重新加载</button></div>;
  return null;
}
