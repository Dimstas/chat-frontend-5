import { ReactNode } from 'react';
import { create } from 'zustand';

type ChatsState = {
  ordering: string;
  setOrdering: (q: string) => void;
  clearOrdering: () => void;
  search: string;
  setSearch: (q: string) => void;
  clearSearch: () => void;
  modalSearch: string;
  setModalSearch: (s: string) => void;
  clearModalSearch: () => void;
  is_active: boolean;
  setIsActive: (q: boolean) => void;
  is_blocked: boolean;
  setIsBlocked: (q: boolean) => void;
  is_favorite: boolean;
  setIsFavorite: (q: boolean) => void;
  selected: number | undefined;
  setSelected: (id: number | undefined) => void;
  clearSelected: () => void;
  isDeleteModalOpen: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  notificationIcon: ReactNode | undefined;
  setNotificationIcon: (icon: ReactNode) => void;
  notificationTitle: string;
  setNotificationTitle: (title: string) => void;
  isNotificationModalOpen: boolean;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
};

export const useChatsStore = create<ChatsState>((set) => ({
  ordering: '',
  setOrdering: (ordering): void => set({ ordering }),
  clearOrdering: (): void => set({ ordering: '' }),
  search: '',
  setSearch: (search): void => set({ search }),
  clearSearch: (): void => set({ search: '' }),
  modalSearch: '',
  setModalSearch: (modalSearch): void => set({ modalSearch }),
  clearModalSearch: (): void => set({ modalSearch: '' }),
  is_active: true,
  setIsActive: (is_active): void => set({ is_active: !is_active }),
  is_blocked: false,
  setIsBlocked: (is_blocked): void => set({ is_blocked: !is_blocked }),
  is_favorite: true,
  setIsFavorite: (is_favorite): void => set({ is_favorite: !is_favorite }),
  selected: undefined,
  setSelected: (id): void => set({ selected: id }),
  clearSelected: (): void => set({ selected: undefined }),
  isDeleteModalOpen: false,
  openDeleteModal: (): void => set({ isDeleteModalOpen: true }),
  closeDeleteModal: (): void => set({ isDeleteModalOpen: false }),
  isAddModalOpen: false,
  openAddModal: (): void => set({ isAddModalOpen: true }),
  closeAddModal: (): void => set({ isAddModalOpen: false }),
  isNotificationModalOpen: false,
  openNotificationModal: (): void => set({ isNotificationModalOpen: true }),
  closeNotificationModal: (): void => set({ isNotificationModalOpen: false }),
  notificationIcon: undefined,
  setNotificationIcon: (icon): void => set({ notificationIcon: icon }),
  notificationTitle: '',
  setNotificationTitle: (title): void => set({ notificationTitle: title }),
}));
