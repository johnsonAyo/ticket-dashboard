import { TICKET_STATUSES, type TicketListItem, type TicketStatus } from '@ticket/shared';
import { STATUS_LABELS } from '../../lib/labels';

type TicketSummaryStatsProps = {
  tickets: TicketListItem[];
};

export function TicketSummaryStats({ tickets }: TicketSummaryStatsProps) {
  const countByStatus = countTicketsByStatus(tickets);

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total" value={tickets.length} />
      {TICKET_STATUSES.map((status) => (
        <StatCard key={status} label={STATUS_LABELS[status]} value={countByStatus[status]} />
      ))}
    </dl>
  );
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function countTicketsByStatus(tickets: TicketListItem[]): Record<TicketStatus, number> {
  const counts = TICKET_STATUSES.reduce(
    (accumulator, status) => ({ ...accumulator, [status]: 0 }),
    {} as Record<TicketStatus, number>,
  );

  for (const ticket of tickets) {
    counts[ticket.status] += 1;
  }

  return counts;
}
