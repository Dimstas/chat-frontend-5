import { ReactNode } from 'react';
import { create } from 'zustand';

type NotificationState = {
  notificationIcon: ReactNode | undefined;
  setNotificationIcon: (icon: ReactNode) => void;
  notificationTitle: string;
  setNotificationTitle: (title: string) => void;
  isNotificationModalOpen: boolean;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  isNotificationModalOpen: false,
  openNotificationModal: (): void => set({ isNotificationModalOpen: true }),
  closeNotificationModal: (): void => set({ isNotificationModalOpen: false }),
  notificationIcon: undefined,
  setNotificationIcon: (icon): void => set({ notificationIcon: icon }),
  notificationTitle: '',
  setNotificationTitle: (title): void => set({ notificationTitle: title }),
}));
