import { string, z } from 'zod';

const serializerRequestObjectAddMembersApiSchema = z.object({
  chat_key: z.string().nullable().optional(),
  uid_users_list: z.array(string()),
});

export const serializerRequestApiSchema = z.object({
  action: z.enum(['add_members_to_chat']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectAddMembersApiSchema,
});

export type CreateAddMembersRequestAPI = z.infer<typeof serializerRequestApiSchema>;
