export type ProfileInfo = {
  uid: string;
  isDeleted: boolean;
  username: string;
  nickname: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarUrl: string;
  avatarWebp: string;
  avatarWebpUrl: string;
  isFilled: boolean;
  additionalInformation: string;
  birthday: number;
  isOnline: boolean;
  wasOnlineAt: number;
  isBlocked: boolean;
  chatId: number;
};

export type BlockInfo = {
  uid: string;
  isDeleted: boolean;
  userName: string;
  nickName: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarUrl: string;
  avatarWebp: string;
  avatarWebpUrl: string;
  additionalInformation: string;
  birthday: number;
  chatId: number;
  isOnline: boolean;
  wasOnlineAt: number;
};

export type ChatType = 'private-group' | 'public-group' | 'private-channel' | 'public-channel';

export type GroupInfo = {
  id: number;
  uid: string;
  notifications: boolean;
  isActive: boolean;
  isFavorite: boolean;
  chatKey: string;
  chatType: ChatType;
  name: string;
  description: string;
  avatar?: string | null;
  messageCount: number;
  newMessageCount: number;
  lastMessage?: {
    content: string;
    fromUser: string;
    createdAt?: number;
  };
  participants: Array<{
    uid: string;
    fullName: string;
  }>;
  createdBy: string;
};
