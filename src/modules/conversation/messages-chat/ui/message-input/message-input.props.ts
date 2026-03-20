import { RefObject } from 'react';

export type MessageInputProps = {
  textInput: string;
  setTextInput: (text: string) => void;
};
export type ButtonSmailProps = {
  buttonRef: RefObject<HTMLDivElement | null>;
  showEmojiPicker: boolean;
  openEmojiPicker: () => void;
  pos: {
    right: number;
    bottom: number;
  };
};
