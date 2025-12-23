export const EMPTY_STATE = {
  chats: {
    src: '/images/empty-state/no-chats.png',
    title: 'У вас пока нет чатов',
    subtitle: 'Начните общение и здесь всё появится',
  },
  contacts: {
    src: '/images/empty-state/no-contacts.png',
    title: 'Список контактов пока пуст',
    subtitle: null,
  },
} as const;

export type EmptyStateVariant = keyof typeof EMPTY_STATE;

export type ConversationEmptyStateProps = {
  variant: EmptyStateVariant;
};
