import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TicketListItem } from '@ticket/shared';
import { Link } from 'react-router-dom';
import { ticketDetailPath } from '../../lib/constants';
import { formatDate } from '../../lib/format';
import { PriorityBadge } from './PriorityBadge';
import { Trash2 } from 'lucide-react';
import { useConfirmDeleteTicket } from '../../hooks/use-confirm-delete';
import { useDeleteTicket } from '../../hooks/use-delete-ticket';

type KanbanCardProps = {
  ticket: TicketListItem;
};

export function KanbanCard({ ticket }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteTicket = useDeleteTicket();
  const confirmDelete = useConfirmDeleteTicket();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (await confirmDelete()) {
      deleteTicket.mutate(ticket.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-testid="kanban-card"
      data-ticket-title={ticket.title}
      className={`group relative cursor-grab touch-none rounded-md border border-slate-200 bg-white p-3 shadow-sm ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          to={ticketDetailPath(ticket.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-left text-sm font-medium text-slate-800 hover:text-slate-950 hover:underline"
        >
          {ticket.title}
        </Link>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <button
            type="button"
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={deleteTicket.isPending}
            className="rounded-md p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100 disabled:opacity-50"
            title="Delete ticket"
            aria-label="Delete ticket"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-xs text-slate-500">{ticket.customerName}</p>
        <p className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</p>
      </div>
    </div>
  );
}
