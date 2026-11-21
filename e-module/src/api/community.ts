import type { Trip } from '../types';
import { request } from './client';
import { mock, useMock } from './mock';
export const communityApi = {
  async list(): Promise<Trip[]> { return useMock ? mock.trips().filter(t => t.isPublic) : request('GET', '/community/trips'); },
  async mine(): Promise<Trip[]> { return useMock ? mock.trips().filter(t => t.ownerId === 1) : request('GET', '/trips/mine'); },
  async favorites(): Promise<Trip[]> { return useMock ? mock.trips().filter(t => t.favorited && t.isPublic) : request('GET', '/users/me/favorites'); },
  async detail(id: number): Promise<Trip> {
    if (!useMock) return request('GET', `/community/trips/${id}`);
    const trip = mock.trips().find(t => t.id === id && t.isPublic); if (!trip) throw new Error('行程不存在或尚未公开'); return trip;
  },
  async toggle(id: number, kind: 'like' | 'favorite', active: boolean): Promise<void> {
    if (!useMock) return request(active ? 'POST' : 'DELETE', `/community/trips/${id}/${kind}`);
    const trips = mock.trips().map(t => t.id !== id ? t : kind === 'like' ? { ...t, liked: active, likeCount: Math.max(0, t.likeCount + (active === t.liked ? 0 : active ? 1 : -1)) } : { ...t, favorited: active });
    mock.saveTrips(trips);
  },
  async publish(id: number, isPublic: boolean): Promise<void> {
    if (!useMock) return request('POST', `/trips/${id}/${isPublic ? 'publish' : 'unpublish'}`);
    const trip = mock.trips().find(t => t.id === id);
    if (!trip) throw new Error('行程不存在');
    if (trip.ownerId !== 1) throw new Error('只有行程创建者可以修改公开状态');
    mock.saveTrips(mock.trips().map(t => t.id === id ? { ...t, isPublic } : t));
  }
};
