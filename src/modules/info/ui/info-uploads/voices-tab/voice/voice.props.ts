import { VoiceContent } from '../../info-uploads.props';

export type VoiceProps = {
  item: VoiceContent;
  onToggle: (fileId: number, audioRef: HTMLAudioElement | null) => void;
};
