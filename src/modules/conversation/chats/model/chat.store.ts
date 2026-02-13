import { create } from 'zustand';
import { Chat } from '../entity';

type ChatState = {
  chats: Chat[];
  selected?: Chat;
  isInfoOpen: boolean;
  setChats: (chats: Chat[]) => void;
  toggleInfoOpen: () => void;
  setSelected: (uid: string) => void;
  findById: (id?: number) => Chat | undefined;
  findByUid: (uid: string) => Chat | undefined;
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  selected: undefined,
  isInfoOpen: false,
  setChats: (chats: Chat[]): void => {
    set({ chats });

    const state = get();
    if (state.selected) {
      const chat = state.chats.find((ch) => ch.chat.id === state.selected?.chat.id);
      set({ selected: chat });
    }
  },
  setSelected: (uid: string): void => {
    const state = get();
    const chat = state.chats.find((ch) => ch.peer.uid === uid);
    set({ selected: chat });
  },
  toggleInfoOpen: (): void => {
    const state = get();
    set({ isInfoOpen: !state.isInfoOpen });
  },
  findByUid: (uid: string): Chat | undefined => {
    const state = get();
    const chat = state.chats.find((ch) => ch.peer.uid === uid);

    return chat;
  },
  findById: (id?: number): Chat | undefined => {
    if (!id) return undefined;

    const state = get();
    const chat = state.chats.find((ch) => ch.chat.id === id);

    return chat;
  },
}));
