import type { Credentials, RegisterData, User } from '../types';
import { request } from './client';
import { mock, useMock } from './mock';
export const authApi = {
  async login(data: Credentials): Promise<{ token: string }> {
    if (!useMock) return request('POST', '/auth/login', data);
    if (data.email !== mock.user().email || data.password !== 'demo123456') throw new Error('演示邮箱：demo@travel.test；密码：demo123456。注册后使用新邮箱和同一演示密码。');
    return { token: 'demo-local-session' };
  },
  async register(data: RegisterData): Promise<void> {
    if (!useMock) return request('POST', '/auth/register', data);
    if (data.password !== 'demo123456') throw new Error('演示注册请使用密码 demo123456；此模式不存储真实密码。');
    mock.saveUser({ ...mock.user(), email: data.email, username: data.username, nickname: data.username });
    mock.saveVerification({ verified: false });
  },
  async me(): Promise<User> { return useMock ? mock.user() : request('GET', '/auth/me'); }
};
