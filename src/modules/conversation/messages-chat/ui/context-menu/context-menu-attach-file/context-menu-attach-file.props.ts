export type Attachment = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'file';
};

export type ContextMenuAttachFileProps = {
  contextMenuPos: {
    x: number;
    y: number;
  };
  handleCloseMenu: () => void;
};
