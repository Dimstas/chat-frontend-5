import { create } from 'zustand';
import { Chat } from '../entity';

type ChatState = {
  chats: Chat[];
  selected?: Chat;
  setChats: (chats: Chat[]) => void;
  toggleSelected: (uid: string) => void;
  findById: (uid: string) => Chat | undefined;
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  selected: undefined,
  setChats: (chats: Chat[]): void => set({ chats }),
  toggleSelected: (uid: string): void => {
    const state = get();
    const chat = state.chats.find((ch) => ch.peer.uid === uid);

    if (state.selected) {
      set({ selected: undefined });
    } else {
      set({ selected: chat });
    }
  },
  findById: (uid: string): Chat | undefined => {
    const state = get();
    const chat = state.chats.find((ch) => ch.peer.uid === uid);

    return chat;
  },
}));
