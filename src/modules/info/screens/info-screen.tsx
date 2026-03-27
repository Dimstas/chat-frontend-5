'use client';

import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { useInfoStore } from '../model/info.store';
import { InfoContactBlock } from '../ui';
import { InfoScreenProps } from './info-screen.props';

export const InfoScreen = ({ uid, wsUrl, currentUid }: InfoScreenProps): JSX.Element | null => {
  const { isInfoOpen, chatId } = useInfoStore();
  const { chats } = useChatsScreen();
  const pathname = usePathname();

  const chat = chats.find((c) => c.chat.id === chatId);
  const isContact = pathname.startsWith(`/contacts/${uid}`) || chat?.chat?.chatType === 'chat';

  if (!isInfoOpen) return null;

  return <>{isContact ? <InfoContactBlock uid={uid} wsUrl={wsUrl} currentUid={currentUid} /> : <div>test</div>}</>;
};
