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
