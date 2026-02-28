import { create } from 'zustand';
import type { RestMessageApi } from '../model/messages-list';

type MessagesChatState = {
  messagesChat: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[];
  setMessagesChat: (q: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[]) => void;
  clearMessagesChat: () => void;
  updateMessageByUidChat: (uid: string, patch: { status?: 'pending' | 'sent' | 'failed' }) => void;
  upsertMessageChat: (m: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }) => void;
  addMessageChat: (m: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }) => void;
};

export const useMessagesChatStore = create<MessagesChatState>((set) => ({
  messagesChat: [],
  setMessagesChat: (messagesChat): void => set({ messagesChat }),
  clearMessagesChat: (): void => set({ messagesChat: [] }),
  addMessageChat: (m: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }): void =>
    set((s) => ({
      messagesChat: [m, ...s.messagesChat],
    })),
  updateMessageByUidChat: (uid: string, patch: { status?: 'pending' | 'sent' | 'failed' }): void =>
    set((s) => ({
      messagesChat: s.messagesChat.map((msg) => (msg.uid === uid ? { ...msg, ...patch } : msg)),
    })),
  upsertMessageChat: (m: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }): void =>
    set((s) => {
      const exists = s.messagesChat.find((x) => x.uid === m.uid);
      if (exists) {
        return { messagesChat: s.messagesChat.map((x) => (x.uid === m.uid ? { ...x, ...m } : x)) };
      }
      return { messagesChat: [m, ...s.messagesChat] };
    }),
}));
