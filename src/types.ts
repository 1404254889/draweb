export interface Topic {
  id: string;
  title: string;
  description: string;
  prompt: string;
  creator: string;
  status: 'forming' | 'completed';
  joinedCount: number;
  targetCount: number;
  likes: string;
  city: string;
  tone: string;
  mode: string;
  deadline: string;
  durationLimit?: number;
  shares?: string;
  bookmarks?: string;
  image?: string;
}

export interface GiftRecord {
  id: string;
  topicId: string;
  userId: string;
  userName: string;
  avatar: string;
  giftName: string;
  giftValue: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  streak: number;
  followers: number;
  following: number;
  gender?: string;
}

export type Screen = 
  | 'splash'
  | 'login'
  | 'home' 
  | 'topic-detail' 
  | 'create-circle'
  | 'create-and-shoot'
  | 'create-success'
  | 'join'
  | 'join-success'
  | 'circle' 
  | 'content-detail' 
  | 'messages'
  | 'dm'
  | 'user-profile'
  | 'personal-profile'
  | 'relation-invite'
  | 'relation-sent'
  | 'relation-review'
  | 'relation-accepted'
  | 'relation-rejected'
  | 'smart-ring'
  | 'shop'
  | 'recharge'
  | 'gift'
  | 'video-edit'
  | 'me'
  | 'my-works'
  | 'friends'
  | 'settings'
  | 'energy-detail'
  | 'liked-topics'
  | 'saved-topics'
  | 'network-list'
  | 'account-profile'
  | 'privacy-policy'
  | 'notification-settings'
  | 'feedback'
  | 'feedback-detail';
