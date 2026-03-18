export type AlertLayoutProps = {
  id: string | number;
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  showCheckBox?: boolean;
  onOk: () => void;
  onCancel: () => void;
};
