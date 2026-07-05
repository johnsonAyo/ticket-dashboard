import type { Ticket } from '@ticket/shared';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ticketDetailPath } from '../../lib/constants';
import { Drawer } from '../ui/Drawer';
import { CreateTicketForm } from './CreateTicketForm';

/** Route-driven drawer: mounted while at /tickets/new, overlaying the list. */
export function CreateTicketDrawer() {
  const navigate = useNavigate();

  const closeDrawer = () => navigate(ROUTES.tickets);
  const goToCreatedTicket = (ticket: Ticket) => navigate(ticketDetailPath(ticket.id));

  return (
    <Drawer title="New ticket" onClose={closeDrawer}>
      <CreateTicketForm onCreated={goToCreatedTicket} onCancel={closeDrawer} />
    </Drawer>
  );
}
