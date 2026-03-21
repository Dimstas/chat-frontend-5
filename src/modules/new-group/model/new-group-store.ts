import { create } from 'zustand';

type NewGroupState = {
  name: string;
  description: string;
  chatType: 'public-group' | 'private-group' | 'public-channel' | 'private-channel';
  avatarUid?: string;
  avatarPreview?: string;
  setGroupData: (data: Partial<Omit<NewGroupState, 'setGroupData' | 'resetGroup'>>) => void;
  resetGroup: () => void;
};

export const useNewGroupStore = create<NewGroupState>((set) => ({
  name: '',
  description: '',
  chatType: 'private-group',
  avatarUid: undefined,
  avatarPreview: undefined,
  setGroupData: (data: Partial<Omit<NewGroupState, 'setGroupData' | 'resetGroup'>>): void =>
    set((state) => ({ ...state, ...data })),
  resetGroup: (): void =>
    set({ name: '', description: '', chatType: 'private-group', avatarUid: undefined, avatarPreview: undefined }),
}));
