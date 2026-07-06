import type { Ticket } from '@ticket/shared';
import { useNavigate, useParams } from 'react-router-dom';
import { BackLink } from '../components/layout/BackLink';
import { ErrorState } from '../components/feedback/ErrorState';
import { LoadingState } from '../components/feedback/LoadingState';
import { PriorityBadge } from '../components/tickets/PriorityBadge';
import { StatusBadge } from '../components/tickets/StatusBadge';
import { TicketStatusUpdater } from '../components/tickets/TicketStatusUpdater';
import { TicketPriorityUpdater } from '../components/tickets/TicketPriorityUpdater';
import { useTicketQuery } from '../hooks/use-tickets';
import { getErrorMessage } from '../lib/errors';
import { formatDateTime } from '../lib/format';

import { useConfirmDeleteTicket } from '../hooks/use-confirm-delete';
import { useDeleteTicket } from '../hooks/use-delete-ticket';
import { ROUTES } from '../lib/constants';

export function TicketDetailPage() {
  const { id } = useParams();
  const ticketId = Number(id);
  const ticketQuery = useTicketQuery(ticketId);
  const deleteTicket = useDeleteTicket();
  const confirmDelete = useConfirmDeleteTicket();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (await confirmDelete()) {
      await deleteTicket.mutateAsync(ticketId);
      navigate(ROUTES.tickets);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <BackLink to={ROUTES.tickets}>All tickets</BackLink>
        <h1 className="text-xl font-semibold text-slate-900">
          {ticketQuery.data?.title ?? 'Ticket details'}
        </h1>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {ticketQuery.isPending ? <LoadingState message="Loading ticket…" /> : null}

        {ticketQuery.isError ? (
          <ErrorState
            title="Ticket unavailable"
            message={getErrorMessage(ticketQuery.error, 'This ticket could not be found.')}
          />
        ) : null}

        {ticketQuery.data ? (
          <TicketDetailCard
            ticket={ticketQuery.data}
            onDelete={handleDelete}
            isDeleting={deleteTicket.isPending}
          />
        ) : null}
      </div>
    </div>
  );
}

type TicketDetailCardProps = {
  ticket: Ticket;
  onDelete: () => void;
  isDeleting: boolean;
};

function TicketDetailCard({ ticket, onDelete, isDeleting }: TicketDetailCardProps) {
  return (
    <article className="flex flex-col gap-5 pb-4">
      <header className="flex w-full flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status:
          </span>
          <StatusBadge status={ticket.status} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Priority:
          </span>
          <PriorityBadge priority={ticket.priority} />
        </div>
      </header>

      <p className="whitespace-pre-line text-sm text-slate-700">{ticket.description}</p>

      <dl className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <DetailRow label="Customer name" value={ticket.customerName} />
        <DetailRow label="Customer email" value={ticket.customerEmail} />
        <DetailRow label="Created" value={formatDateTime(ticket.createdAt)} />
        <DetailRow label="Last updated" value={formatDateTime(ticket.updatedAt)} />
      </dl>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Update status
          </span>
          <TicketStatusUpdater
            ticketId={ticket.id}
            status={ticket.status}
            label={`Update status for ${ticket.title}`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Update priority
          </span>
          <TicketPriorityUpdater
            ticketId={ticket.id}
            priority={ticket.priority}
            label={`Update priority for ${ticket.title}`}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete ticket'}
        </button>
      </div>
    </article>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  );
}
