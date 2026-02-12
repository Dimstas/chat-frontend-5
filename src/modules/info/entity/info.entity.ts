export type ProfileInfo = {
  uid: string;
  isDeleted: boolean;
  userName: string;
  nickName: string;
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
