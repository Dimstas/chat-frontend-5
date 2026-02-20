import { Contact } from 'modules/conversation/contacts/entity';
import { create } from 'zustand';

type ContactsSelectionState = {
  isSelectionMode: boolean;
  isDeleteModalOpen: boolean;
  selectedIds: Set<string>;
  contacts: Contact[];
  globals: Contact[];

  enterSelectionMode: () => void;
  exitSelectionMode: () => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  setContacts: (contacts: Contact[]) => void;
  setGlobals: (contacts: Contact[]) => void;
  findByUid: (uid: string) => Contact | undefined;
  findGlobalByUid: (uid: string) => Contact | undefined;

  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export const useContactsSelectionStore = create<ContactsSelectionState>((set, get) => ({
  isSelectionMode: false,
  isDeleteModalOpen: false,
  selectedIds: new Set(),
  contacts: [],
  globals: [],

  enterSelectionMode: (): void =>
    set({
      isSelectionMode: true,
      selectedIds: new Set(),
    }),

  exitSelectionMode: (): void =>
    set({
      isSelectionMode: false,
      selectedIds: new Set(),
    }),

  toggleSelection: (id): void =>
    set((state) => {
      const next = new Set(state.selectedIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return { selectedIds: next };
    }),

  clearSelection: (): void =>
    set({
      selectedIds: new Set(),
    }),

  setContacts: (contacts): void =>
    set({
      contacts: contacts,
    }),

  setGlobals: (contacts): void =>
    set({
      globals: contacts,
    }),

  findGlobalByUid: (uid): Contact | undefined => {
    const state = get();
    const contact = state.globals.find((c) => c.uid === uid);
    return contact;
  },

  findByUid: (uid): Contact | undefined => {
    const state = get();
    const contact = state.contacts.find((c) => c.uid === uid);
    return contact;
  },

  openDeleteModal: (): void =>
    set({
      isDeleteModalOpen: true,
    }),

  closeDeleteModal: (): void =>
    set({
      isDeleteModalOpen: false,
    }),
}));
