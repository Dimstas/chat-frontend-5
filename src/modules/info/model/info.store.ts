import { create } from 'zustand';

type InfoState = {
  isInfoOpen: boolean;
  isBlockModalOpen: boolean;
  isUnblockModalOpen: boolean;
  selectedUid: string | undefined;
  setSelectedUid: (uid: string) => void;
  toggleInfoOpen: () => void;
  openBlockModal: () => void;
  closeBlockModal: () => void;
  openUnblockModal: () => void;
  closeUnblockModal: () => void;
};

export const useInfoStore = create<InfoState>((set, get) => ({
  isInfoOpen: false,
  isBlockModalOpen: false,
  isUnblockModalOpen: false,
  selectedUid: undefined,
  setSelectedUid: (uid): void => {
    set({ selectedUid: uid });
  },
  toggleInfoOpen: (): void => {
    const state = get();
    set({ isInfoOpen: !state.isInfoOpen });
  },
  openBlockModal: (): void => set({ isBlockModalOpen: true }),
  closeBlockModal: (): void => set({ isBlockModalOpen: false }),
  openUnblockModal: (): void => set({ isUnblockModalOpen: true }),
  closeUnblockModal: (): void => set({ isUnblockModalOpen: false }),
}));
