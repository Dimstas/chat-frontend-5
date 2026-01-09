export type ChatUser = {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  avatar_url: string;
  avatar_webp_url: string;
};

export type ChatFilesList = {
  id: number;
  uid: string;
  file: string;
  file_url: string;
  file_webp: string;
  file_webp_url: string;
  file_type: string;
  new: boolean;
  created_at: number;
  updated_at: number;
};

export type ChatRepliedMessage = {
  id: number;
  uid: string;
  from_user: string;
  content: string;
  files_list: ChatFilesList[];
};

export type ChatForwardedMessage = ChatRepliedMessage & { first_name: string; last_name: string };

export type ChatMessageRtc = {
  uid: string;
  duration: number;
  status: string;
  updated_at: number;
  created_at: number;
};

type ChartResult = {
  id: number;
  uid: string;
  from_user: ChatUser;
  to_user: ChatUser;
  content: string;
  replied_messages: ChatRepliedMessage[];
  forwarded_messages: ChatForwardedMessage[];
  files_list: ChatFilesList[];
  new: boolean;
  created_at: number;
  updated_at: number;
  chat_id: number;
  chat_key: string;
  chat_type: string;
  message_rtc: ChatMessageRtc;
};

export type MessagesList = {
  count: number;
  next: string;
  previous: string;
  results: ChartResult[];
};
