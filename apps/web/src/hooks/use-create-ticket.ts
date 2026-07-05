import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTicketInput } from '@ticket/shared';
import toast from 'react-hot-toast';
import { createTicket } from '../api/tickets';
import { QUERY_KEYS } from '../lib/constants';

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tickets] });
      toast.success('Ticket created successfully');
    },
  });
}
