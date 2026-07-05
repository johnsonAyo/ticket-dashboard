import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTicketInput } from '@ticket/shared';
import toast from 'react-hot-toast';
import { updateTicket } from '../api/tickets';
import { QUERY_KEYS } from '../lib/constants';

type UpdateTicketVariables = {
  ticketId: number;
  data: UpdateTicketInput;
};

/**
 * Pessimistic update mutation: the server is the source of truth, so we only
 * invalidate ticket queries after the API confirms the change.
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, data }: UpdateTicketVariables) => updateTicket(ticketId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets] });
      toast.success('Ticket updated successfully');
    },
    onError: () => {
      toast.error('Failed to update ticket. Please try again.');
    },
  });
}
