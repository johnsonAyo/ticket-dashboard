import type { Ticket as PrismaTicket } from '@prisma/client';
import type { Ticket, TicketListItem } from '@ticket/shared';
import { isTicketPriority, isTicketStatus } from '@ticket/shared';

export function toDomainTicket(row: PrismaTicket): Ticket {
  if (!isTicketStatus(row.status) || !isTicketPriority(row.priority)) {
    throw new Error(`Ticket ${row.id} has invalid status or priority in storage.`);
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    status: row.status,
    priority: row.priority,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toDomainTicketListItem(
  row: PrismaTicket | Omit<PrismaTicket, 'description' | 'customerEmail' | 'updatedAt'>,
): TicketListItem {
  if (!isTicketStatus(row.status) || !isTicketPriority(row.priority)) {
    throw new Error(`Ticket ${row.id} has invalid status or priority in storage.`);
  }

  return {
    id: row.id,
    title: row.title,
    customerName: row.customerName,
    status: row.status,
    priority: row.priority,
    createdAt: row.createdAt.toISOString(),
  };
}
