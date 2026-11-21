import axios from 'axios';
import { clearToken, getToken } from '../utils/token';
import type { ApiResponse } from '../types';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', timeout: 15000 });
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, error => {
  // 登录失败只在表单里提示；会话失效才清理全局状态。403 表示无权限，不退出登录。
  if (error.response?.status === 401 && !/\/auth\/(login|register)$/.test(error.config?.url || '')) {
    clearToken();
    window.dispatchEvent(new Event('travel-session-expired'));
  }
  return Promise.reject(new Error(error.response?.data?.message || error.message || '请求失败，请稍后重试'));
});
export async function request<T>(method: string, url: string, data?: unknown): Promise<T> {
  const response = await api.request<ApiResponse<T>>({ method, url, data });
  if (response.data.code !== 0) throw new Error(response.data.message || '操作失败');
  return response.data.data;
}
