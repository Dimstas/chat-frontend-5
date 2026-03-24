export type StatusMessage = '' | 'outgoing' | 'incoming';

export type IncomingMessageCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  register: (el: Element | null, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
};
