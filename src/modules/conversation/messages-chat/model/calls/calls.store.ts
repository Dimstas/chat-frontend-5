import { create } from 'zustand';

type CallsState = {
  isCallModalOpen: boolean;
  isFullScreen: boolean;
  isIncomingModalOpen: boolean;
  isSound: boolean;
  duration: number;
  state: 'call' | 'connecting' | 'connected' | 'end' | 'error' | 'rejected' | 'unreceived';
  toggleCallsOpen: () => void;
  toggleFullScreen: () => void;
  toggleSound: () => void;
  setDuration: (val: number) => void;
};

export const useCallsStore = create<CallsState>((set, get) => ({
  isCallModalOpen: false,
  isFullScreen: false,
  isIncomingModalOpen: false,
  isSound: true,
  duration: 0,
  state: 'call',
  toggleCallsOpen: (): void => {
    const state = get();
    set({ isCallModalOpen: !state.isCallModalOpen });
  },
  toggleFullScreen: (): void => {
    const state = get();
    set({ isFullScreen: !state.isFullScreen });
  },
  toggleSound: (): void => {
    const state = get();
    set({ isSound: !state.isSound });
  },
  setDuration: (val: number): void => {
    set({ duration: val });
  },
}));
