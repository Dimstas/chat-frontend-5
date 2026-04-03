import { chatApiSchema } from 'modules/conversation/chats/model/chat.api.schema';
import { z } from 'zod';

export const infoApiSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  username: z.string(),
  nickname: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string(),
  avatar_url: z.string(),
  avatar_webp: z.string(),
  avatar_webp_url: z.string(),
  is_filled: z.boolean(),
  additional_information: z.string(),
  birthday: z.number(),
  is_online: z.boolean(),
  was_online_at: z.number(),
  is_blocked: z.boolean(),
  chat_id: z.number(),
});

export type InfoProfileApi = z.infer<typeof infoApiSchema>;
export type InfoProfileApiResponse = z.infer<typeof infoApiSchema>;

export const blockApiSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  username: z.string(),
  nickname: z.string(),
  phone: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string(),
  avatar_url: z.string(),
  avatar_webp: z.string(),
  avatar_webp_url: z.string(),
  additional_information: z.string(),
  birthday: z.number(),
  chat_id: z.number(),
  is_online: z.boolean(),
  was_online_at: z.number(),
});

export type BlockProfileApi = z.infer<typeof blockApiSchema>;
export type BlockProfileApiResponse = z.infer<typeof blockApiSchema>;

export type NewContact = {
  phone: string;
  first_name: string;
  last_name: string;
};

export type ChatPost = {
  is_favorite?: boolean;
  notifications?: boolean;
  index?: number;
  last_seen_message?: number;
};

export type InviteSettingsPost = {
  expires_in: number;
};

export const ChatPostApiSchema = z.object({
  is_favorite: z.boolean(),
  notifications: z.boolean(),
  index: z.number(),
  last_seen_message: z.number(),
  last_seen_message_uid: z.string(),
});

export type ChatPostApiResponse = z.infer<typeof chatApiSchema>;

const chatSchema = z.object({
  uid: z.string(),
  username: z.string().nullable(),
  nickname: z.string().nullable(),
  avatar: z.string().optional(),
  avatar_url: z.string().nullable(),
  avatar_webp_url: z.string().nullable(),
  avatar_small_url: z.string().nullable(),
  avatar_master_url: z.string().nullable(),
});

const FileSchema = z.object({
  id: z.number(),
  uid: z.uuid(),
  file: z.string().nullable(),
  file_url: z.string().nullable(),
  file_webp: z.string().nullable().optional(),
  file_webp_url: z.string().nullable().optional(),
  file_type: z.string(),
  new: z.boolean(),
  created_at: z.number(),
  updated_at: z.number(),
});

const MessageSchema = z.object({
  id: z.number(),
  uid: z.uuid(),
  from_user: z.string(),
  content: z.string(),
  files_list: z.array(FileSchema),
  new: z.boolean(),
  replied_messages: z.array(z.number()),
  forwarded_messages: z.array(z.number()),
  created_at: z.number(),
  updated_at: z.number(),
});

const MessageShortSchema = z.object({
  id: z.number(),
  uid: z.uuid(),
});

const ParticipantSchema = z.object({
  uid: z.uuid(),
  full_name: z.string(),
});

const GroupOrChanelApiSchema = z.object({
  id: z.number(),
  chat: chatSchema,
  is_active: z.boolean(),
  is_favorite: z.boolean(),
  notifications: z.boolean(),
  message_count: z.number(),
  new_message_count: z.number(),
  last_message: MessageSchema.optional(),
  last_seen_message: MessageShortSchema.nullable(),
  first_new_message: MessageShortSchema.nullable(),
  name: z.string(),
  chat_type: z.enum(['private-group', 'public-group', 'private-channel', 'public-channel', 'chat']),
  chat_key: z.string(),
  created_by: z.uuid(),
  description: z.string().nullable(),
  participants: z.array(ParticipantSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GroupOrChanelApiResponse = z.infer<typeof GroupOrChanelApiSchema>;
export type MessageApiResponse = z.infer<typeof MessageSchema>;

const InviteLinkApiSchema = z.object({
  chat_key: z.string(),
  chat_type: z.string(),
  invite_link: z.string(),
  expires_at: z.number(),
});

export type InviteLinkApiResponse = z.infer<typeof InviteLinkApiSchema>;

export const ParticipantsQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().optional(),
  search: z.string().optional(),
});

export type ParticipantQuery = z.infer<typeof ParticipantsQuerySchema>;

export const ParticipantApiSchema = z.object({
  uid: z.uuid(),
  is_deleted: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_url: z.string(),
  avatar_webp_url: z.string(),
  avatar_small_url: z.string(),
  avatar_master_url: z.string(),
  is_owner: z.boolean(),
  is_blocked: z.boolean(),
  is_online: z.boolean(),
  was_online_at: z.number().nullable(),
  is_in_contacts: z.boolean(),
});

export const ParticipantPaginatedResponseSchema = z.object({
  count: z.number(),
  next: z.string().optional(),
  previous: z.string().optional(),
});

export const ParticipantResponseSchema = ParticipantPaginatedResponseSchema.extend({
  results: z.array(ParticipantApiSchema),
});

export type ParticipantApiResponse = z.infer<typeof ParticipantResponseSchema>;
export type ParticipantApi = z.infer<typeof ParticipantApiSchema>;
