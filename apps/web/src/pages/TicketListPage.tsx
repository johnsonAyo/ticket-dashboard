import { useState } from 'react';
import type { TicketFilters } from '@ticket/shared';
import { Link, Outlet } from 'react-router-dom';
import { EmptyState } from '../components/feedback/EmptyState';
import { ErrorState } from '../components/feedback/ErrorState';
import { LoadingState } from '../components/feedback/LoadingState';
import { TicketFilterBar } from '../components/tickets/TicketFilterBar';
import { TicketSummaryStats } from '../components/tickets/TicketSummaryStats';
import { TicketTable } from '../components/tickets/TicketTable';
import { useTicketsQuery } from '../hooks/use-tickets';
import { ROUTES } from '../lib/constants';
import { getErrorMessage } from '../lib/errors';

const PRIMARY_ACTION_CLASSES =
  'shrink-0 whitespace-nowrap rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700';

export function TicketListPage() {
  const [filters, setFilters] = useState<TicketFilters>({});
  const ticketsQuery = useTicketsQuery(filters);
  const tickets = ticketsQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Tickets</h1>
          <p className="text-sm text-slate-500">Track and update customer support tickets.</p>
        </div>
        <Link to={ROUTES.newTicket} className={PRIMARY_ACTION_CLASSES}>
          New ticket
        </Link>
      </div>

      {tickets ? <TicketSummaryStats tickets={tickets} /> : null}
      <TicketFilterBar filters={filters} onChange={setFilters} />

      {ticketsQuery.isPending ? <LoadingState message="Loading tickets…" /> : null}

      {ticketsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(ticketsQuery.error, 'Unable to load tickets.')}
          onRetry={() => void ticketsQuery.refetch()}
        />
      ) : null}

      {tickets && tickets.length === 0 ? (
        <EmptyState
          title="No tickets match these filters"
          description="Try clearing the filters or create a new ticket."
          action={
            <Link to={ROUTES.newTicket} className={PRIMARY_ACTION_CLASSES}>
              New ticket
            </Link>
          }
        />
      ) : null}

      {tickets && tickets.length > 0 ? (
        <TicketTable
          tickets={tickets}
          sortBy={filters.sortBy}
          onSortChange={(sortBy) => setFilters({ ...filters, sortBy })}
        />
      ) : null}

      {/* Renders the create-ticket drawer for the nested /tickets/new route. */}
      <Outlet />
    </div>
  );
}
