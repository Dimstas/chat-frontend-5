export type InfoUploadsProps = {
  uid: string;
};

type TabContentType = 'media' | 'files' | 'voices' | 'links';

export type Tab = {
  id: TabContentType;
  title: string;
  content: FileContent | LinkContent;
};

export type FileContent = {
  id: number;
  file: string;
  url: string;
  size: string;
  type: string;
  created: string;
  isLoading?: boolean;
  progress?: number;
};

export type VoiceContent = {
  id: number;
  file: string;
  url: string;
  size: string;
  type: string;
  created: string;
  isPlaying?: boolean;
  audioRef?: HTMLAudioElement | null;
};

export type LinkContent = {
  messageId: number;
  url: string;
  title: string;
  fromUser: string;
  created: string;
};
