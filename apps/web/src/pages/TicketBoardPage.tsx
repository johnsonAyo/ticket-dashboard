import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import type { Ticket } from '@ticket/shared';
import { TICKET_STATUSES, isTicketStatus } from '@ticket/shared';
import { ErrorState } from '../components/feedback/ErrorState';
import { LoadingState } from '../components/feedback/LoadingState';
import { KanbanColumn } from '../components/tickets/KanbanColumn';
import { KanbanCard } from '../components/tickets/KanbanCard';
import { useTicketsQuery } from '../hooks/use-tickets';
import { useUpdateTicket } from '../hooks/use-update-ticket';
import { getErrorMessage } from '../lib/errors';

import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/constants';

const PRIMARY_ACTION_CLASSES =
  'shrink-0 whitespace-nowrap rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700';

const DRAG_ACTIVATION_DISTANCE = 5;

export function TicketBoardPage() {
  const ticketsQuery = useTicketsQuery({});
  const updateTicket = useUpdateTicket();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE } }),
  );

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);

  // Sync local state when the query data changes
  useEffect(() => {
    if (ticketsQuery.data) {
      setLocalTickets(ticketsQuery.data);
    }
  }, [ticketsQuery.data]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = localTickets.find((t) => t.id === Number(active.id));
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    // Over can be a column (status string) or another ticket (number ID)
    const overIsStatus = isTicketStatus(String(overId));

    setLocalTickets((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return prev;

      const activeItem = prev[activeIndex];
      let newStatus = activeItem.status;
      let overIndex = -1;

      if (overIsStatus) {
        newStatus = String(overId) as typeof newStatus;
      } else {
        overIndex = prev.findIndex((t) => t.id === Number(overId));
        if (overIndex !== -1) {
          newStatus = prev[overIndex].status;
        }
      }

      // If moving to a different status, instantly update the status locally
      if (activeItem.status !== newStatus) {
        const next = [...prev];
        next[activeIndex] = { ...activeItem, status: newStatus };
        return arrayMove(next, activeIndex, overIndex !== -1 ? overIndex : next.length - 1);
      }

      // If reordering within the same status
      if (overIndex !== -1 && activeIndex !== overIndex) {
        return arrayMove(prev, activeIndex, overIndex);
      }

      return prev;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = Number(active.id);
    const draggedTicket = ticketsQuery.data?.find((ticket) => ticket.id === ticketId);

    // Determine the status we dropped into (could be an item or a column)
    let nextStatus = '';
    if (isTicketStatus(String(over.id))) {
      nextStatus = String(over.id);
    } else {
      const overTicket = localTickets.find((t) => t.id === Number(over.id));
      if (overTicket) {
        nextStatus = overTicket.status;
      }
    }

    if (!draggedTicket || !isTicketStatus(nextStatus) || draggedTicket.status === nextStatus) {
      return;
    }
    updateTicket.mutate({ ticketId, data: { status: nextStatus } });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Board</h1>
          <p className="mt-1 text-sm text-slate-500">
            Drag tickets between columns to update their status.
          </p>
        </div>
        <Link to={ROUTES.newTicket} className={PRIMARY_ACTION_CLASSES}>
          New ticket
        </Link>
      </div>

      {updateTicket.isError ? (
        <ErrorState message={getErrorMessage(updateTicket.error, 'Could not move the ticket.')} />
      ) : null}

      {ticketsQuery.isPending ? <LoadingState message="Loading board…" /> : null}

      {ticketsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(ticketsQuery.error, 'Unable to load the board.')}
          onRetry={() => void ticketsQuery.refetch()}
        />
      ) : null}

      {ticketsQuery.isSuccess ? (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {TICKET_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tickets={localTickets.filter((ticket) => ticket.status === status)}
              />
            ))}
          </div>
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: '0.4' } },
              }),
            }}
          >
            {activeTicket ? <KanbanCard ticket={activeTicket} /> : null}
          </DragOverlay>
        </DndContext>
      ) : null}
    </div>
  );
}
