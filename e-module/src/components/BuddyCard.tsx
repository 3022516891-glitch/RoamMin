import { Link } from 'react-router-dom';
import type { BuddyPost } from '../types';
export default function BuddyCard({ post }: { post: BuddyPost }) {
  return <Link className="buddy-card" to={`/buddy/${post.id}`}><div className="buddy-top"><span className="tag">{post.destination}</span><span className={post.status === 'open' ? 'status' : 'muted'}>{post.status === 'open' ? '● 招募中' : '招募已结束'}</span></div><h3>{post.title}</h3><p>{post.description}</p><div className="meta">{post.startDate} — {post.endDate}</div><div className="card-footer"><span className="author"><span className="mini-avatar">{post.author[0]}</span>{post.author}</span><span className="meta">寻找 {post.peopleNeeded} 位搭子 →</span></div></Link>;
}
