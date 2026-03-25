import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type ReplyCardProps = {
  repliedMessageStore: RestMessageApi | null;
  isIncomingMessage: boolean;
};
