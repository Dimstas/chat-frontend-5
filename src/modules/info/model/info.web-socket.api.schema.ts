import { string, z } from 'zod';

const serializerRequestObjectMembersApiSchema = z.object({
  chat_key: z.string().nullable().optional(),
  uid_users_list: z.array(string()),
});

export const serializerRequestApiSchema = z.object({
  action: z.enum(['add_members_to_chat', 'remove_members_from_chat']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectMembersApiSchema,
});

export type AddOrRemoveMembersRequestAPI = z.infer<typeof serializerRequestApiSchema>;
