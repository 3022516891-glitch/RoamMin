export interface User { id: number; username: string; email: string; nickname: string; bio: string; avatarUrl: string }
export interface Trip { id: number; ownerId: number; author: string; title: string; destination: string; startDate: string; endDate: string; description: string; days: string[]; likeCount: number; liked: boolean; favorited: boolean; isPublic: boolean; color: string }
export interface BuddyPost { id: number; authorId: number; author: string; title: string; destination: string; startDate: string; endDate: string; peopleNeeded: number; description: string; status: 'open' | 'closed' }
export interface Member { id: number; userId: number; username: string; role: 'owner' | 'member' }
export interface ApiResponse<T> { code: number; message: string; data: T }
export interface Credentials { email: string; password: string }
export interface RegisterData extends Credentials { username: string }
export interface VerificationStatus { verified: boolean; verifiedAt?: string }
export interface VerificationRequest { realName: string; idNumber: string; consent: boolean }
