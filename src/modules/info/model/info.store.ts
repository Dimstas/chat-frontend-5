import { create } from 'zustand';

type InfoState = {
  isInfoOpen: boolean;
  isBlockModalOpen: boolean;
  isUnblockModalOpen: boolean;
  isClearModalOpen: boolean;
  isForwardModalOpen: boolean;
  uid: string | undefined;
  setUid: (uid: string) => void;
  chatId: number | undefined;
  setChatId: (id: number) => void;
  toggleInfoOpen: () => void;
  openBlockModal: () => void;
  closeBlockModal: () => void;
  openUnblockModal: () => void;
  closeUnblockModal: () => void;
  openClearModal: () => void;
  closeClearModal: () => void;
  openForwardModal: () => void;
  closeForwardModal: () => void;
};

export const useInfoStore = create<InfoState>((set, get) => ({
  isInfoOpen: false,
  isBlockModalOpen: false,
  isUnblockModalOpen: false,
  isClearModalOpen: false,
  isForwardModalOpen: false,
  uid: undefined,
  setUid: (uid): void => {
    set({ uid: uid });
  },
  chatId: undefined,
  setChatId: (chatId): void => {
    set({ chatId: chatId });
  },
  toggleInfoOpen: (): void => {
    const state = get();
    set({ isInfoOpen: !state.isInfoOpen });
  },
  openBlockModal: (): void => set({ isBlockModalOpen: true }),
  closeBlockModal: (): void => set({ isBlockModalOpen: false }),
  openUnblockModal: (): void => set({ isUnblockModalOpen: true }),
  closeUnblockModal: (): void => set({ isUnblockModalOpen: false }),
  openClearModal: (): void => set({ isClearModalOpen: true }),
  closeClearModal: (): void => set({ isClearModalOpen: false }),
  openForwardModal: (): void => set({ isForwardModalOpen: true }),
  closeForwardModal: (): void => set({ isForwardModalOpen: false }),
}));
