import type { BuddyPost } from '../types';
import { request } from './client';
import { mock, useMock } from './mock';
import { verificationApi } from './verification';
export type BuddyForm = Omit<BuddyPost, 'id' | 'author' | 'authorId'>;
export const buddyApi = {
  async list(): Promise<BuddyPost[]> { return useMock ? mock.posts() : request('GET', '/buddy/posts'); },
  async mine(): Promise<BuddyPost[]> { return useMock ? mock.posts().filter(p => p.authorId === 1) : request('GET', '/buddy/posts/mine'); },
  async detail(id: number): Promise<BuddyPost> {
    if (!useMock) return request('GET', `/buddy/posts/${id}`);
    const post = mock.posts().find(p => p.id === id); if (!post) throw new Error('帖子不存在'); return post;
  },
  async save(data: BuddyForm, id?: number): Promise<BuddyPost> {
    if (!useMock) return request(id ? 'PUT' : 'POST', id ? `/buddy/posts/${id}` : '/buddy/posts', data);
    if (!id && !(await verificationApi.status()).verified) throw new Error('完成实名认证后才能发布搭子邀约');
    const posts = mock.posts(); const existing = posts.find(p => p.id === id);
    if (id && (!existing || existing.authorId !== 1)) throw new Error('无权编辑该帖子');
    const post: BuddyPost = { ...data, id: id ?? Math.max(0, ...posts.map(p => p.id)) + 1, authorId: 1, author: mock.user().nickname };
    mock.savePosts(id ? posts.map(p => p.id === id ? post : p) : [post, ...posts]); return post;
  },
  async remove(id: number): Promise<void> {
    if (!useMock) return request('DELETE', `/buddy/posts/${id}`);
    if (mock.posts().find(p => p.id === id)?.authorId !== 1) throw new Error('无权删除该帖子');
    mock.savePosts(mock.posts().filter(p => p.id !== id));
  }
};
