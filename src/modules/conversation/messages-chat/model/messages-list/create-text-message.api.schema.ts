import { string, z } from 'zod';

export const serializerFileMessageApiSchema = z.object({
  filename: z.string().default('document.pdf'),
  data: z.string().default('UERGLTEuNCBmaWxlIGNvbnRlbnQ='),
});

export const serializerRequestObjectCreateMessageApiSchema = z.object({
  to_user_uid: z.string(),
  chat_key: z.string(),
  content: z.string(),
  status: z.enum(['publish', 'draft']),
  files: z.array(serializerFileMessageApiSchema).max(10),
  replied_messages: z.array(string()),
  forwarded_messages: z.array(string()),
});

export const serializerRequestCreatingMessageApiSchema = z.object({
  action: z.enum(['create_text_message']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectCreateMessageApiSchema,
});

export type CreateTextMessageAPI = z.infer<typeof serializerRequestCreatingMessageApiSchema>;
