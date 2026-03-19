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
  deleteMessageByUidForUser: (userId: string, uid: string) => void;
};

export const useMessagesChatStore = create<MessagesChatState>((set, get) => ({
  messagesByUser: {},

  setMessagesForUser: (userId: string, messages: Msg[]): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      const seen = new Set();
      const result = [];
      for (const msg of prev) {
        const uid = msg.uid;
        if (!seen.has(uid)) {
          seen.add(uid);
          result.push(msg);
        }
      }
      for (const msg of messages) {
        const uid = msg.uid;
        if (!seen.has(uid)) {
          seen.add(uid);
          result.push(msg);
        }
      }
      return {
        messagesByUser: {
          ...s.messagesByUser,
          [userId]: result,
        },
      };
    }),

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

  deleteMessageByUidForUser: (userId: string, uid: string): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      const exists = prev.find((x) => x.uid === uid);
      if (exists) {
        return {
          messagesByUser: {
            ...s.messagesByUser,
            [userId]: prev.filter((x) => x.uid !== uid),
          },
        };
      }
      return { messagesByUser: { ...s.messagesByUser, [userId]: [...prev] } };
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

type ForAllDelete = {
  forAllDelete: boolean | null;
  setForAllDelete: (q: boolean) => void;
};
export const useForAllDeleteStore = create<ForAllDelete>((set) => ({
  forAllDelete: null,
  setForAllDelete: (forAllDelete): void => set({ forAllDelete }),
}));
