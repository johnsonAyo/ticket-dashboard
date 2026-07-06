import type { TicketPriority } from '@ticket/shared';
import { useUpdateTicket } from '../../hooks/use-update-ticket';
import { PrioritySelect } from './PrioritySelect';

type TicketPriorityUpdaterProps = {
  ticketId: number;
  priority: TicketPriority;
  label?: string;
};

export function TicketPriorityUpdater({ ticketId, priority, label }: TicketPriorityUpdaterProps) {
  const updateTicket = useUpdateTicket();

  const handleChange = (newPriority: TicketPriority) => {
    if (newPriority !== priority) {
      updateTicket.mutate({ ticketId, data: { priority: newPriority } });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <PrioritySelect
        value={priority}
        onChange={handleChange}
        disabled={updateTicket.isPending}
        label={label || 'Update priority'}
      />
      {updateTicket.isError ? (
        <p role="alert" className="text-xs text-rose-600">
          Could not update priority. Please try again.
        </p>
      ) : null}
    </div>
  );
}
