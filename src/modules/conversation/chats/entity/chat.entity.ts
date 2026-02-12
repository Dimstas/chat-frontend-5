import { ChatType } from 'modules/conversation/chats/model/chat';

type PeerEntity = {
  uid: string;

  username: string;
  nickname: string;
  firstName: string;
  lastName: string;

  avatarUrl: string;
  avatarWebpUrl: string;

  isBlocked: boolean;
  isOnline: boolean;
  isInContacts: boolean;

  wasOnlineAt: number | null;
};

type ChatEntity = {
  id: number;
  chatKey: string;
  chatType: ChatType;
  name: string;
  is_favorite: boolean;
  notifications: boolean;
  newMessageCount: number;
  lastActivityAt: number;
};

type BaseMessageEntity = {
  id: number;
  uid: string;
};

export type AttachmentKind = 'image' | 'video' | 'audio' | 'file';
export type FilesSummaryEntity = {
  types: AttachmentKind[];
  count: number;
};

type LastMessageEntity = BaseMessageEntity & {
  fromUser: string;
  content: string;

  filesSummary: FilesSummaryEntity;
  hasRepliedMessage: boolean;
  hasForwardedMessage: boolean;
  new: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Chat = {
  peer: PeerEntity;
  chat: ChatEntity;
  messages: {
    lastSeenMessage?: BaseMessageEntity;
    firstNewMessage?: BaseMessageEntity;
    lastMessage?: LastMessageEntity;
  };
};
