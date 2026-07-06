import type { TicketFilters, TicketListItem } from '@ticket/shared';
import { Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useConfirmDeleteTicket } from '../../hooks/use-confirm-delete';
import { useDeleteTicket } from '../../hooks/use-delete-ticket';
import { Link } from 'react-router-dom';
import { ticketDetailPath } from '../../lib/constants';
import { formatDate } from '../../lib/format';
import { PriorityBadge } from './PriorityBadge';
import { TicketStatusUpdater } from './TicketStatusUpdater';

type TicketTableProps = {
  tickets: TicketListItem[];
  sortBy?: TicketFilters['sortBy'];
  onSortChange?: (sortBy?: TicketFilters['sortBy']) => void;
};

const HEADER_CELL_CLASSES = 'px-4 py-3 font-medium';
const BODY_CELL_CLASSES = 'px-4 py-3 align-middle';

export function TicketTable({ tickets, sortBy, onSortChange }: TicketTableProps) {
  const handleCreatedSortToggle = () => {
    if (!onSortChange) return;
    if (sortBy === 'newest') onSortChange('oldest');
    else if (sortBy === 'oldest') onSortChange(undefined);
    else onSortChange('newest');
  };

  const handlePrioritySortToggle = () => {
    if (!onSortChange) return;
    if (sortBy === 'priority_high') onSortChange('priority_low');
    else if (sortBy === 'priority_low') onSortChange(undefined);
    else onSortChange('priority_high');
  };

  const handleStatusSortToggle = () => {
    if (!onSortChange) return;
    if (sortBy === 'status_asc') onSortChange('status_desc');
    else if (sortBy === 'status_desc') onSortChange(undefined);
    else onSortChange('status_asc');
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className={HEADER_CELL_CLASSES}>Title</th>
            <th className={HEADER_CELL_CLASSES}>Customer</th>
            <th className={HEADER_CELL_CLASSES}>
              <button
                type="button"
                onClick={handlePrioritySortToggle}
                className="group flex items-center gap-1 hover:text-slate-700"
              >
                Priority
                {sortBy === 'priority_high' ? (
                  <ArrowDown className="h-4 w-4 text-slate-600" />
                ) : sortBy === 'priority_low' ? (
                  <ArrowUp className="h-4 w-4 text-slate-600" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </th>
            <th className={HEADER_CELL_CLASSES}>
              <button
                type="button"
                onClick={handleCreatedSortToggle}
                className="group flex items-center gap-1 hover:text-slate-700"
              >
                Created
                {sortBy === 'oldest' ? (
                  <ArrowUp className="h-4 w-4 text-slate-600" />
                ) : sortBy === 'newest' ? (
                  <ArrowDown className="h-4 w-4 text-slate-600" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </th>
            <th className={HEADER_CELL_CLASSES}>
              <button
                type="button"
                onClick={handleStatusSortToggle}
                className="group flex items-center gap-1 hover:text-slate-700"
              >
                Status
                {sortBy === 'status_asc' ? (
                  <ArrowUp className="h-4 w-4 text-slate-600" />
                ) : sortBy === 'status_desc' ? (
                  <ArrowDown className="h-4 w-4 text-slate-600" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </th>
            <th className={HEADER_CELL_CLASSES}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="group border-b border-slate-100 last:border-0 hover:bg-slate-50"
            >
              <td className={BODY_CELL_CLASSES}>
                <Link
                  to={ticketDetailPath(ticket.id)}
                  className="font-medium text-slate-800 hover:text-slate-950 hover:underline"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className={`${BODY_CELL_CLASSES} text-slate-600`}>{ticket.customerName}</td>
              <td className={BODY_CELL_CLASSES}>
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className={`${BODY_CELL_CLASSES} text-slate-500`}>
                {formatDate(ticket.createdAt)}
              </td>
              <td className={BODY_CELL_CLASSES}>
                <TicketStatusUpdater
                  ticketId={ticket.id}
                  status={ticket.status}
                  label={`Update status for ${ticket.title}`}
                />
              </td>
              <td className={BODY_CELL_CLASSES}>
                <DeleteButton ticketId={ticket.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex flex-col divide-y divide-slate-100 md:hidden">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="group p-4">
            <div className="flex items-start justify-between gap-3">
              <Link
                to={ticketDetailPath(ticket.id)}
                className="font-medium text-slate-800 hover:underline"
              >
                {ticket.title}
              </Link>
              <PriorityBadge priority={ticket.priority} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{ticket.customerName}</p>
            <p className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</p>
            <div className="mt-3 flex items-center justify-between">
              <TicketStatusUpdater
                ticketId={ticket.id}
                status={ticket.status}
                label={`Update status for ${ticket.title}`}
              />
              <DeleteButton ticketId={ticket.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeleteButton({ ticketId }: { ticketId: number }) {
  const deleteTicket = useDeleteTicket();
  const confirmDelete = useConfirmDeleteTicket();

  const handleDelete = async () => {
    if (await confirmDelete()) {
      deleteTicket.mutate(ticketId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleteTicket.isPending}
      aria-label="Delete ticket"
      title="Delete ticket"
      className="rounded-md p-2 text-slate-400 opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 disabled:opacity-50 md:opacity-0 md:group-hover:opacity-100"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
