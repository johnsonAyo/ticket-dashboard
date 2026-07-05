export const TICKET_STATUSES = ['open', 'in_progress', 'resolved'] as const;
export const TICKET_PRIORITIES = ['low', 'medium', 'high'] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const DEFAULT_TICKET_STATUS: TicketStatus = 'open';

export type Ticket = {
  id: number;
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
};

export type CreateTicketInput = {
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  priority: TicketPriority;
};

export type UpdateTicketInput = {
  status?: TicketStatus;
  priority?: TicketPriority;
};

export type TicketFilters = {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'priority_high' | 'priority_low' | 'status_asc' | 'status_desc';
};

export function isTicketStatus(value: unknown): value is TicketStatus {
  return typeof value === 'string' && TICKET_STATUSES.includes(value as TicketStatus);
}

export function isTicketPriority(value: unknown): value is TicketPriority {
  return typeof value === 'string' && TICKET_PRIORITIES.includes(value as TicketPriority);
}
