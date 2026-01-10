import z from 'zod';

export const globalContactApiSchema = z.object({
  uid: z.string(),
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

export type GlobalContactApi = z.infer<typeof globalContactApiSchema>;

export const contactOrderingFields = [
  'first_name',
  'last_name',
  'phone',
  'system_contact__is_online',
  'system_contact__was_online_at',
] as const;

export const contactOrderingSchema = z.enum([
  ...contactOrderingFields,
  ...contactOrderingFields.map((f) => `-${f}`),
] as [string, ...string[]]);

export const contactQuerySchema = z.object({
  ordering: contactOrderingSchema.optional(),
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().optional(),
});

export type ContactQuery = z.infer<typeof contactQuerySchema>;
