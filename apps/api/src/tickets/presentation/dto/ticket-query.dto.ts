import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketFilters,
  type TicketPriority,
  type TicketStatus,
} from '@ticket/shared';

export class TicketQueryDto implements TicketFilters {
  @ApiPropertyOptional({ enum: TICKET_STATUSES })
  @IsOptional()
  @IsIn([...TICKET_STATUSES])
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TICKET_PRIORITIES })
  @IsOptional()
  @IsIn([...TICKET_PRIORITIES])
  priority?: TicketPriority;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: ['newest', 'oldest', 'priority_high', 'priority_low', 'status_asc', 'status_desc'],
  })
  @IsOptional()
  @IsIn(['newest', 'oldest', 'priority_high', 'priority_low', 'status_asc', 'status_desc'])
  sortBy?: 'newest' | 'oldest' | 'priority_high' | 'priority_low' | 'status_asc' | 'status_desc';
}
