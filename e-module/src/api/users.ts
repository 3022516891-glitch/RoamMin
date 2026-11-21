import type { User } from '../types';
import { request } from './client';
import { mock, useMock } from './mock';
export const usersApi = {
  async update(data: Pick<User, 'nickname' | 'bio' | 'avatarUrl'>): Promise<User> {
    if (!useMock) return request('PUT', '/users/me', data);
    const user = { ...mock.user(), ...data }; mock.saveUser(user); return user;
  },
  async get(id: number): Promise<User> {
    if (!useMock) return request('GET', `/users/${id}`);
    if (id === 1) return mock.user();
    return { id, username: id === 2 ? 'xiaolin' : 'ahe', nickname: id === 2 ? '小林' : '阿禾', email: '', bio: '喜欢旅行，也喜欢认识新的朋友。', avatarUrl: '' };
  },
  async search(q: string): Promise<User[]> {
    if (!useMock) return request('GET', `/users/search?q=${encodeURIComponent(q)}`);
    const users = [mock.user(), await this.get(2), await this.get(3)];
    return q.trim() ? users.filter(user => `${user.username}${user.nickname}`.toLowerCase().includes(q.toLowerCase())) : [];
  }
};
