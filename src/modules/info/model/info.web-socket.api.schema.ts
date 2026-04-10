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

const serializerRequestObjectLeaveGroupApiSchema = z.object({
  chat_key: z.string(),
});

export const serializerRequestLeaveGroupApiSchema = z.object({
  action: z.enum(['leave_chat']),
  request_uid: z.string(),
  object: serializerRequestObjectLeaveGroupApiSchema,
});

export type LeaveGroupRequestAPI = z.infer<typeof serializerRequestLeaveGroupApiSchema>;
