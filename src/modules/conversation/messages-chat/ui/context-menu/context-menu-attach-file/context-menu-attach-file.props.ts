import type { FileMessageApi } from 'modules/conversation/messages-chat/model/messages-list/create-text-message.api.schema';
export type Attachment = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'file';
  // формат для отправки
  fileData: FileMessageApi;
};

export type ContextMenuAttachFileProps = {
  contextMenuPos: {
    x: number;
    y: number;
  };
  handleCloseMenu: () => void;
  handleAttachmentFilesClick: () => Promise<void>;
};
