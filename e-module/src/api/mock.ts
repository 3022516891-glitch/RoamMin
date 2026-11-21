import type { BuddyPost, Member, Trip, User, VerificationStatus } from '../types';
const demoUser: User = { id: 1, username: 'traveler', nickname: '旅行同学', email: 'demo@travel.test', bio: '慢慢走，认真看。一起发现福州的日常风景。', avatarUrl: '' };
const initialTrips: Trip[] = [
  { id: 1, ownerId: 1, author: '旅行同学', title: '在福州，走一场慢旅行', destination: '福州', startDate: '2026-10-18', endDate: '2026-10-20', description: '三坊七巷的老巷子、烟台山的咖啡馆，还有一碗热腾腾的鱼丸。把脚步慢下来。', days: ['三坊七巷 → 林则徐纪念馆 → 东街口', '上下杭 → 闽江步道 → 烟台山', '鼓山 → 西湖公园 → 美食街'], likeCount: 32, liked: false, favorited: false, isPublic: true, color: 'green' },
  { id: 2, ownerId: 2, author: '小林', title: '厦门海边的两天一夜', destination: '厦门', startDate: '2026-10-24', endDate: '2026-10-25', description: '看海、骑车、吃沙茶面。给周末留一点轻松的空白。', days: ['环岛路 → 黄厝海滩', '鼓浪屿 → 中山路'], likeCount: 48, liked: false, favorited: false, isPublic: true, color: 'blue' },
  { id: 3, ownerId: 3, author: '阿禾', title: '泉州古城的烟火气', destination: '泉州', startDate: '2026-11-01', endDate: '2026-11-02', description: '沿着西街散步，在古城里寻找藏着的闽南味道。', days: ['开元寺 → 西街 → 钟楼', '关岳庙 → 蟳埔村'], likeCount: 21, liked: false, favorited: false, isPublic: true, color: 'orange' }
];
const initialPosts: BuddyPost[] = [
  { id: 1, authorId: 2, author: '小林', title: '周末去烟台山散步，找咖啡搭子', destination: '福州', startDate: '2026-10-18', endDate: '2026-10-18', peopleNeeded: 2, description: '下午慢慢逛街区，拍照喝咖啡，欢迎时间合适的朋友。', status: 'open' },
  { id: 2, authorId: 3, author: '阿禾', title: '泉州两日游，一起逛古城', destination: '泉州', startDate: '2026-11-01', endDate: '2026-11-02', peopleNeeded: 3, description: '主要步行，喜欢美食和老建筑。预算各自负责，路线可以一起商量。', status: 'open' }
];
function read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
export const mock = {
  user: () => read<User>('travel-ae-user', demoUser),
  saveUser: (user: User) => localStorage.setItem('travel-ae-user', JSON.stringify(user)),
  trips: () => read<Trip[]>('travel-ae-trips', initialTrips),
  saveTrips: (trips: Trip[]) => localStorage.setItem('travel-ae-trips', JSON.stringify(trips)),
  posts: () => read<BuddyPost[]>('travel-ae-posts', initialPosts),
  savePosts: (posts: BuddyPost[]) => localStorage.setItem('travel-ae-posts', JSON.stringify(posts)),
  members: (tripId: number) => read<Member[]>(`travel-ae-members-${tripId}`, [{ id: 1, userId: 1, username: 'traveler', role: 'owner' }]),
  saveMembers: (tripId: number, members: Member[]) => localStorage.setItem(`travel-ae-members-${tripId}`, JSON.stringify(members)),
  verification: () => read<VerificationStatus>('travel-ae-verification', { verified: false }),
  saveVerification: (status: VerificationStatus) => localStorage.setItem('travel-ae-verification', JSON.stringify(status))
};
export const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
