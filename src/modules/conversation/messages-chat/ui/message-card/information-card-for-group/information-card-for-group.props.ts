import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list/user-messages.api.schema';
export type InformationForGroupCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  register: (el: Element | null, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
};
