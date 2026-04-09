import { create } from 'zustand';
import type { RestMessageApi } from '../model/messages-list';
export type Msg = RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };

type MessagesChatState = {
  messagesByUser: Record<string, Msg[]>;
  setMessagesForUser: (userId: string, messages: Msg[]) => void;
  clearMessagesForUser: (userId?: string) => void; // если userId не передан — очищает все
  addMessageForUser: (userId: string, m: Msg) => void;
  upsertMessageForUser: (userId: string, m: Msg) => void;
  updateMessageByUidForUser: (userId: string, request_uid: string, patch: Partial<Msg>) => void;
  deleteMessageByUidForUser: (userId: string, uid: string) => void;
};

export const useMessagesChatStore = create<MessagesChatState>((set) => ({
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

type RepliedMessageState = {
  repliedMessage: RestMessageApi | null;
  setRepliedMessage: (msg: RestMessageApi) => void;
  clearRepliedMessage: () => void;
};

export const useRepliedMessageStore = create<RepliedMessageState>((set) => ({
  repliedMessage: null,
  setRepliedMessage: (repliedMessage: RestMessageApi): void => set({ repliedMessage }),
  clearRepliedMessage: (): void => set({ repliedMessage: null }),
}));

type ForwardMessageState = {
  forwardMessage: RestMessageApi | null;
  setForwardMessage: (msg: RestMessageApi) => void;
  clearForwardMessage: () => void;
};

export const useForwardMessageStore = create<ForwardMessageState>((set) => ({
  forwardMessage: null,
  setForwardMessage: (forwardMessage: RestMessageApi): void => set({ forwardMessage }),
  clearForwardMessage: (): void => set({ forwardMessage: null }),
}));

type SelectedMessagesState = {
  selectedMessages: RestMessageApi[] | null;
  checkBoxsVisible: boolean | null;
  addSelectedMessages: (msg: RestMessageApi) => void;
  deleteSelectedMessages: (msg: RestMessageApi) => void;
  clearSelectedMessages: () => void;
  setCheckBoxsVisible: (v: boolean) => void;
  setSelectedMessages: (arr: RestMessageApi[] | null) => void;
};

export const useSelectedMessagesStore = create<SelectedMessagesState>((set) => ({
  selectedMessages: null,
  checkBoxsVisible: null,
  setCheckBoxsVisible: (checkBoxsVisible: boolean): void => set({ checkBoxsVisible }),
  setSelectedMessages: (selectedMessages: RestMessageApi[] | null): void => set({ selectedMessages }),
  addSelectedMessages: (msg: RestMessageApi): void =>
    set((s) => {
      const prev = s.selectedMessages ?? [];
      const exists = prev.find((m) => m.uid === msg.uid);
      if (!exists) {
        return { selectedMessages: [...prev, msg] };
      }
      return { selectedMessages: [...prev] };
    }),
  deleteSelectedMessages: (msg: RestMessageApi): void =>
    set((s) => {
      const prev = s.selectedMessages ?? [];
      const exists = prev.find((m) => m.uid === msg.uid);
      if (exists) {
        return {
          selectedMessages: prev.filter((m) => m.uid !== msg.uid),
        };
      }
      return { selectedMessages: [...prev] };
    }),

  clearSelectedMessages: (): void => set({ selectedMessages: null }),
}));

type RecentEmojiState = {
  recentEmojis: string[];
  setRecentEmojis: (recentEmoji: string[]) => void;
  clearRecentEmojis: () => void;
};

export const useRecentEmojiStore = create<RecentEmojiState>((set) => ({
  recentEmojis: [],
  setRecentEmojis: (recentEmojis: string[]): void => set({ recentEmojis }),
  clearRecentEmojis: (): void => set({ recentEmojis: [] }),
}));

type SelectedUidUserForForwardMessageState = {
  selectedUidUserForForwardMessage: string;
  setSelectedUidUserForForwardMessage: (uid: string) => void;
  clearSelectedUidUserForForwardMessage: () => void;
};

export const useSelectedUidUserForForwardMessageStore = create<SelectedUidUserForForwardMessageState>((set) => ({
  selectedUidUserForForwardMessage: '',
  setSelectedUidUserForForwardMessage: (uid: string): void => set({ selectedUidUserForForwardMessage: uid }),
  clearSelectedUidUserForForwardMessage: (): void => set({ selectedUidUserForForwardMessage: '' }),
}));

type ToastVisibleState = {
  toastVisible: boolean;
  setToastVisible: (toastVisible: boolean) => void;
};
export const useToastVisibleStore = create<ToastVisibleState>((set) => ({
  toastVisible: false,
  setToastVisible: (toastVisible): void => set({ toastVisible }),
}));
type SearchMessagesState = {
  searchMessages: string;
  setSearchMessages: (searchMessages: string) => void;
  clearSearchMessages: () => void;
};

export const useSearchMessagesStore = create<SearchMessagesState>((set) => ({
  searchMessages: '',
  setSearchMessages: (searchMessages: string): void => set({ searchMessages }),
  clearSearchMessages: (): void => set({ searchMessages: '' }),
}));
