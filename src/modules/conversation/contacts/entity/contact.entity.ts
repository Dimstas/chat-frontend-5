import { z } from 'zod';

export const contactApiSchema = z.object({
  uid: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  system_contact: z.object({
    avatar_url: z.string(),
    is_online: z.boolean(),
    was_online_at: z.number(),
  }),
});
export type ContactApi = z.infer<typeof contactApiSchema>;

export type Contact = {
  uid: string;
  fullName: string;
  avatar: string;
  wasOnlineAt: number;
};

export const mapContactFromApi = (api: ContactApi): Contact => ({
  uid: api.uid,
  fullName: `${api.first_name} ${api.last_name}`,
  avatar: api.system_contact.avatar_url,
  wasOnlineAt: api.system_contact.was_online_at,
});
