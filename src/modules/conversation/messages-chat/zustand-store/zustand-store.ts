import { create } from 'zustand';
import type { RestMessageApi } from '../model/messages-list';

type Msg = RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };

type MessagesChatState = {
  messagesByUser: Record<string, Msg[]>;
  setMessagesForUser: (userId: string, messages: Msg[]) => void;
  clearMessagesForUser: (userId?: string) => void; // если userId не передан — очищает все
  addMessageForUser: (userId: string, m: Msg) => void;
  upsertMessageForUser: (userId: string, m: Msg) => void;
  updateMessageByUidForUser: (userId: string, request_uid: string, patch: Partial<Msg>) => void;
};

export const useMessagesChatStore = create<MessagesChatState>((set, get) => ({
  messagesByUser: {},

  setMessagesForUser: (userId: string, messages: Msg[]): void =>
    set((s) => ({
      messagesByUser: {
        ...s.messagesByUser,
        [userId]: messages,
      },
    })),

  clearMessagesForUser: (userId?: string): void =>
    set((s) => {
      if (typeof userId === 'string' && userId.length) {
        return { messagesByUser: { ...s.messagesByUser, [userId]: [] } };
      }
      return { messagesByUser: {} };
    }),

  addMessageForUser: (userId: string, m: Msg): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      return { messagesByUser: { ...s.messagesByUser, [userId]: [m, ...prev] } };
    }),

  upsertMessageForUser: (userId: string, m: Msg): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      const exists = prev.find((x) => x.uid === m.uid);
      if (exists) {
        return {
          messagesByUser: {
            ...s.messagesByUser,
            [userId]: prev.map((x) => (x.uid === m.uid ? { ...x, ...m } : x)),
          },
        };
      }
      return { messagesByUser: { ...s.messagesByUser, [userId]: [m, ...prev] } };
    }),

  updateMessageByUidForUser: (userId: string, request_uid: string, patch): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      return {
        messagesByUser: {
          ...s.messagesByUser,
          [userId]: prev.map((msg) => (msg.uid === request_uid ? { ...msg, ...patch } : msg)),
        },
      };
    }),
}));

type UserIdState = {
  userId: string;
  setUserId: (q: string) => void;
  clearUserId: () => void;
};

export const useUserIdStore = create<UserIdState>((set) => ({
  userId: '',
  setUserId: (userId): void => set({ userId }),
  clearUserId: (): void => set({ userId: '' }),
}));
