import { create } from 'zustand';

type InfoState = {
  isInfoOpen: boolean;
  toggleInfoOpen: () => void;
};

export const useInfoStore = create<InfoState>((set, get) => ({
  isInfoOpen: false,
  toggleInfoOpen: (): void => {
    const state = get();
    set({ isInfoOpen: !state.isInfoOpen });
  },
}));
