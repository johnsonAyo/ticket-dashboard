import type { CreateTicketInput, Ticket, TicketFilters, TicketListItem } from '@ticket/shared';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface TicketRepository {
  findMany(filters: TicketFilters): Promise<TicketListItem[]>;
  findById(id: number): Promise<Ticket | null>;
  create(input: CreateTicketInput): Promise<Ticket>;
  update(id: number, data: Partial<Ticket>): Promise<Ticket | null>;
  delete(id: number): Promise<void>;
}
