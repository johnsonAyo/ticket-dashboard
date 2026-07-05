import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  DEFAULT_TICKET_STATUS,
  type CreateTicketInput,
  type Ticket,
  type TicketFilters,
} from '@ticket/shared';
import { PrismaService } from '../../prisma/prisma.service';
import type { TicketRepository } from '../domain/ticket.repository';
import { toDomainTicket } from './ticket.mapper';

const PRISMA_RECORD_NOT_FOUND = 'P2025';

@Injectable()
export class PrismaTicketRepository implements TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: TicketFilters): Promise<Ticket[]> {
    const rows = await this.prisma.ticket.findMany({
      where: { status: filters.status, priority: filters.priority },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toDomainTicket);
  }

  async findById(id: number): Promise<Ticket | null> {
    const row = await this.prisma.ticket.findUnique({ where: { id } });
    return row ? toDomainTicket(row) : null;
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const row = await this.prisma.ticket.create({
      data: { ...input, status: DEFAULT_TICKET_STATUS },
    });
    return toDomainTicket(row);
  }

  async update(id: number, data: Partial<Ticket>): Promise<Ticket | null> {
    try {
      const row = await this.prisma.ticket.update({ where: { id }, data });
      return toDomainTicket(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_RECORD_NOT_FOUND
      ) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.ticket.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_RECORD_NOT_FOUND
      ) {
        return; // Already deleted
      }
      throw error;
    }
  }
}
