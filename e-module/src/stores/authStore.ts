import { create } from 'zustand';
import type { Credentials, User } from '../types';
import { authApi } from '../api/auth';
import { clearToken, getToken, setToken } from '../utils/token';
interface AuthState { user: User | null; initialized: boolean; initialize: () => Promise<void>; login: (data: Credentials) => Promise<void>; logout: () => void; setUser: (user: User) => void }
let initialization: Promise<void> | undefined;
export const useAuthStore = create<AuthState>(set => ({
  user: null, initialized: false,
  initialize: () => {
    if (!initialization) initialization = (async () => {
      if (!getToken()) { set({ initialized: true }); return; }
      try { const user = await authApi.me(); set({ user, initialized: true }); }
      catch { clearToken(); set({ user: null, initialized: true }); }
    })();
    return initialization;
  },
  login: async data => {
    const { token } = await authApi.login(data); setToken(token);
    try { set({ user: await authApi.me(), initialized: true }); }
    catch (error) { clearToken(); set({ user: null }); throw error; }
  },
  logout: () => { clearToken(); set({ user: null, initialized: true }); },
  setUser: user => set({ user })
}));
