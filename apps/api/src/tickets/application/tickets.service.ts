import { Inject, Injectable } from '@nestjs/common';
import type { CreateTicketInput, Ticket, TicketFilters, TicketListItem } from '@ticket/shared';
import { TicketNotFoundError } from '../domain/ticket-not-found.error';
import { TICKET_REPOSITORY, type TicketRepository } from '../domain/ticket.repository';

@Injectable()
export class TicketsService {
  constructor(@Inject(TICKET_REPOSITORY) private readonly ticketRepository: TicketRepository) {}

  findMany(filters: TicketFilters): Promise<TicketListItem[]> {
    return this.ticketRepository.findMany(filters);
  }

  async findById(ticketId: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }
    return ticket;
  }

  create(input: CreateTicketInput): Promise<Ticket> {
    return this.ticketRepository.create(input);
  }

  async update(ticketId: number, data: Partial<Ticket>): Promise<Ticket> {
    const ticket = await this.ticketRepository.update(ticketId, data);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }
    return ticket;
  }

  async delete(ticketId: number): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }
    await this.ticketRepository.delete(ticketId);
  }
}
