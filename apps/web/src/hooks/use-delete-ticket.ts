import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteTicket } from '../api/tickets';
import { QUERY_KEYS } from '../lib/constants';

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: number) => deleteTicket(ticketId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets] });
      toast.success('Ticket deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete ticket. Please try again.');
    },
  });
}
