import type { CreateTicketInput, Ticket, TicketFilters, UpdateTicketInput } from '@ticket/shared';
import { apiRequest } from './client';

function toQueryString(filters: TicketFilters): string {
  const params = new URLSearchParams();
  if (filters.status) {
    params.set('status', filters.status);
  }
  if (filters.priority) {
    params.set('priority', filters.priority);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function fetchTickets(filters: TicketFilters): Promise<Ticket[]> {
  return apiRequest<Ticket[]>(`/tickets${toQueryString(filters)}`);
}

export function fetchTicket(ticketId: number): Promise<Ticket> {
  return apiRequest<Ticket>(`/tickets/${ticketId}`);
}

export function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return apiRequest<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(input) });
}

export function updateTicket(ticketId: number, data: UpdateTicketInput): Promise<Ticket> {
  return apiRequest<Ticket>(`/tickets/${ticketId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTicket(ticketId: number): Promise<void> {
  return apiRequest<void>(`/tickets/${ticketId}`, { method: 'DELETE' });
}
