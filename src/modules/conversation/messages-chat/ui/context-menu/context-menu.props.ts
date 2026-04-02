import type { RestMessageApi } from '../../model/messages-list';

export type ContextMenuProps = {
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
  handleDeleteClick: () => Promise<void>;
  handleForwardClick: () => Promise<void>;
  setToastVisible: (v: boolean) => void;
  setCheckBoxsVisible: (v: boolean) => void;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
};
