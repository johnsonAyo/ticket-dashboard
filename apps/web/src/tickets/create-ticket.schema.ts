import { z } from 'zod';
import { TICKET_PRIORITIES } from '@ticket/shared';

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;
const CUSTOMER_NAME_MAX_LENGTH = 120;

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(TITLE_MAX_LENGTH),
  description: z.string().trim().min(1, 'Description is required').max(DESCRIPTION_MAX_LENGTH),
  customerName: z.string().trim().min(1, 'Customer name is required').max(CUSTOMER_NAME_MAX_LENGTH),
  customerEmail: z
    .string()
    .trim()
    .min(1, 'Customer email is required')
    .email('Enter a valid email address'),
  priority: z.enum(TICKET_PRIORITIES),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
