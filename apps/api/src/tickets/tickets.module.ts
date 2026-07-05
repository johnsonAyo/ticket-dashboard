import { Module } from '@nestjs/common';
import { TicketsService } from './application/tickets.service';
import { TICKET_REPOSITORY } from './domain/ticket.repository';
import { PrismaTicketRepository } from './infrastructure/prisma-ticket.repository';
import { TicketsController } from './presentation/tickets.controller';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, { provide: TICKET_REPOSITORY, useClass: PrismaTicketRepository }],
})
export class TicketsModule {}
