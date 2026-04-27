import { create } from 'zustand';

export type EntityMode = 'group' | 'channel';
export type ChatType = 'public-group' | 'private-group' | 'public-channel' | 'private-channel';

type NewGroupStore = {
  mode: EntityMode;
  name: string;
  description: string;
  chatType: ChatType;
  avatarUid: string | null;
  avatarPreview: string | null;
  setMode: (mode: EntityMode) => void;
  setGroupData: (data: Partial<Omit<NewGroupStore, 'setGroupData' | 'resetGroup' | 'setMode'>>) => void;
  resetGroup: () => void;
};

export const useNewGroupStore = create<NewGroupStore>(
  (set): NewGroupStore => ({
    mode: 'group',
    name: '',
    description: '',
    chatType: 'public-group',
    avatarUid: null,
    avatarPreview: null,
    setMode: (mode: EntityMode): void => set({ mode }),
    setGroupData: (data: Partial<Omit<NewGroupStore, 'setGroupData' | 'resetGroup' | 'setMode'>>): void =>
      set((state): NewGroupStore => ({ ...state, ...data })),
    resetGroup: (): void =>
      set({
        mode: 'group',
        name: '',
        description: '',
        chatType: 'public-group',
        avatarUid: null,
        avatarPreview: null,
      }),
  }),
);
