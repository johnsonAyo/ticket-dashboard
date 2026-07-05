import { ApiProperty } from '@nestjs/swagger';
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from '@ticket/shared';

export class TicketResponseDto implements Ticket {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  customerName!: string;

  @ApiProperty({ format: 'email' })
  customerEmail!: string;

  @ApiProperty({ enum: TICKET_STATUSES })
  status!: TicketStatus;

  @ApiProperty({ enum: TICKET_PRIORITIES })
  priority!: TicketPriority;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
