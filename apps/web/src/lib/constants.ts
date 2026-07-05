import type { TicketFilters } from '@ticket/shared';

export const ROUTES = {
  home: '/',
  tickets: '/tickets',
  newTicket: '/tickets/new',
  board: '/tickets/board',
  ticketDetail: '/tickets/:id',
} as const;

export function ticketDetailPath(ticketId: number): string {
  return `/tickets/${ticketId}`;
}

const TICKETS_QUERY_ROOT = 'tickets';

export const QUERY_KEYS = {
  tickets: TICKETS_QUERY_ROOT,
} as const;

export function ticketsListKey(filters: TicketFilters) {
  return [TICKETS_QUERY_ROOT, 'list', filters] as const;
}

export function ticketDetailKey(ticketId: number) {
  return [TICKETS_QUERY_ROOT, 'detail', ticketId] as const;
}
