import { create } from 'zustand';

type CallsState = {
  isCallModalOpen: boolean;
  isFullScreen: boolean;
  isIncomingModalOpen: boolean;
  toggleCallsOpen: () => void;
  toggleFullScreen: () => void;
};

export const useCallsStore = create<CallsState>((set, get) => ({
  isCallModalOpen: false,
  isFullScreen: false,
  isIncomingModalOpen: false,
  toggleCallsOpen: (): void => {
    const state = get();
    set({ isCallModalOpen: !state.isCallModalOpen });
  },
  toggleFullScreen: (): void => {
    const state = get();
    set({ isFullScreen: !state.isFullScreen });
  },
}));
