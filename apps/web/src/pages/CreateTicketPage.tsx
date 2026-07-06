import type { Ticket } from '@ticket/shared';
import { useNavigate } from 'react-router-dom';
import { BackLink } from '../components/layout/BackLink';
import { CreateTicketForm } from '../components/tickets/CreateTicketForm';
import { ROUTES, ticketDetailPath } from '../lib/constants';

export function CreateTicketPage() {
  const navigate = useNavigate();

  const goToCreatedTicket = (ticket: Ticket) => navigate(ticketDetailPath(ticket.id));
  const goToList = () => navigate(ROUTES.tickets);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <BackLink to={ROUTES.tickets}>All tickets</BackLink>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">New ticket</h1>
          <p className="mt-1 text-sm text-slate-500">Capture a new customer support request.</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <CreateTicketForm onCreated={goToCreatedTicket} onCancel={goToList} />
      </div>
    </div>
  );
}
