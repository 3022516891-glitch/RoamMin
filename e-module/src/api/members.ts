import type { Member } from '../types';
import { request } from './client';
import { mock, useMock } from './mock';
export const membersApi = {
  async list(tripId: number): Promise<Member[]> { return useMock ? mock.members(tripId) : request('GET', `/trips/${tripId}/members`); },
  async add(tripId: number, userId: number, username: string): Promise<void> {
    if (!useMock) return request('POST', `/trips/${tripId}/members`, { userId });
    const members = mock.members(tripId); if (members.some(m => m.userId === userId)) throw new Error('这个用户已经是成员');
    mock.saveMembers(tripId, [...members, { id: Date.now(), userId, username, role: 'member' }]);
  },
  async remove(tripId: number, memberId: number): Promise<void> {
    if (!useMock) return request('DELETE', `/members/${memberId}`);
    const members = mock.members(tripId); if (members.find(m => m.id === memberId)?.role === 'owner') throw new Error('不能移除创建者');
    mock.saveMembers(tripId, members.filter(m => m.id !== memberId));
  }
};
