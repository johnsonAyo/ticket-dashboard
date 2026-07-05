import { useQuery } from '@tanstack/react-query';
import type { TicketFilters } from '@ticket/shared';
import { fetchTicket, fetchTickets } from '../api/tickets';
import { ticketDetailKey, ticketsListKey } from '../lib/constants';

export function useTicketsQuery(filters: TicketFilters) {
  return useQuery({
    queryKey: ticketsListKey(filters),
    queryFn: () => fetchTickets(filters),
  });
}

export function useTicketQuery(ticketId: number) {
  return useQuery({
    queryKey: ticketDetailKey(ticketId),
    queryFn: () => fetchTicket(ticketId),
    enabled: Number.isInteger(ticketId),
  });
}
