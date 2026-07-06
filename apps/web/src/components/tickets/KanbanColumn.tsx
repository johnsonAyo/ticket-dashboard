import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TicketListItem, TicketStatus } from '@ticket/shared';
import { STATUS_LABELS } from '../../lib/labels';
import { KanbanCard } from './KanbanCard';
import { EmptyState } from '../feedback/EmptyState';

type KanbanColumnProps = {
  status: TicketStatus;
  tickets: TicketListItem[];
};

export function KanbanColumn({ status, tickets }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${STATUS_LABELS[status]} column`}
      className={`flex min-h-[12rem] flex-col gap-3 rounded-lg border p-3 transition-colors ${
        isOver ? 'border-slate-400 bg-slate-100' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[status]}</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200">
          {tickets.length}
        </span>
      </header>
      <div className="flex h-full flex-col gap-3">
        {tickets.length === 0 ? (
          <EmptyState title="No tickets" />
        ) : (
          <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tickets.map((ticket) => (
              <KanbanCard key={ticket.id} ticket={ticket} />
            ))}
          </SortableContext>
        )}
      </div>
    </section>
  );
}
