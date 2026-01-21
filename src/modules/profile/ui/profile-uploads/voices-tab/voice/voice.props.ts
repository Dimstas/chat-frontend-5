import { VoiceContent } from '../../profile-uploads.props';

export type VoiceProps = {
  item: VoiceContent;
  onToggle: (fileId: number, audioRef: HTMLAudioElement | null) => void;
};
