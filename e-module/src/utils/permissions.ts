import type { Trip, User } from '../types';
export const canManageTrip = (user: User | null, trip: Trip) => user?.id === trip.ownerId;
// 前端用于呈现按钮，真实权限必须由后端独立校验。
