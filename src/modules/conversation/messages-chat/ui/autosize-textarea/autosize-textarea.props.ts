export type AutosizeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  maxHeight?: number;
  onInput?: React.FormEventHandler<HTMLTextAreaElement>;
};
