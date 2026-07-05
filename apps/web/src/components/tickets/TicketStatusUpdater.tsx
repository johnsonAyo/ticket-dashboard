import type { TicketStatus } from '@ticket/shared';
import { useUpdateTicket } from '../../hooks/use-update-ticket';
import { StatusSelect } from './StatusSelect';

type TicketStatusUpdaterProps = {
  ticketId: number;
  status: TicketStatus;
  label?: string;
};

/**
 * Optimistically updates a ticket's status when a new value is selected.
 * Falls back to the server state if the mutation fails.
 */
export function TicketStatusUpdater({ ticketId, status, label }: TicketStatusUpdaterProps) {
  const updateTicket = useUpdateTicket();

  const handleChange = (newStatus: TicketStatus) => {
    if (newStatus !== status) {
      updateTicket.mutate({ ticketId, data: { status: newStatus } });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <StatusSelect
        value={status}
        onChange={handleChange}
        disabled={updateTicket.isPending}
        label={label || 'Update status'}
      />
      {updateTicket.isError ? (
        <p role="alert" className="text-xs text-rose-600">
          Could not update status. Please try again.
        </p>
      ) : null}
    </div>
  );
}
