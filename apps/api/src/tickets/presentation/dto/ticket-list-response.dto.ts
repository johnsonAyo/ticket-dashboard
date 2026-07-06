import { ApiProperty } from '@nestjs/swagger';
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketListItem,
  type TicketPriority,
  type TicketStatus,
} from '@ticket/shared';

export class TicketListItemResponseDto implements TicketListItem {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  customerName!: string;

  @ApiProperty({ enum: TICKET_STATUSES })
  status!: TicketStatus;

  @ApiProperty({ enum: TICKET_PRIORITIES })
  priority!: TicketPriority;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
