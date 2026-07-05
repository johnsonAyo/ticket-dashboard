import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TICKET_PRIORITIES, type CreateTicketInput, type TicketPriority } from '@ticket/shared';
import {
  CUSTOMER_EMAIL_MAX_LENGTH,
  CUSTOMER_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from './ticket-validation.constants';

export class CreateTicketDto implements CreateTicketInput {
  @ApiProperty({ maxLength: TITLE_MAX_LENGTH, example: 'Cannot reset password from login page' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TITLE_MAX_LENGTH)
  title!: string;

  @ApiProperty({ maxLength: DESCRIPTION_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description!: string;

  @ApiProperty({ maxLength: CUSTOMER_NAME_MAX_LENGTH, example: 'Amara Okafor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CUSTOMER_NAME_MAX_LENGTH)
  customerName!: string;

  @ApiProperty({ format: 'email', maxLength: CUSTOMER_EMAIL_MAX_LENGTH })
  @IsEmail()
  @MaxLength(CUSTOMER_EMAIL_MAX_LENGTH)
  customerEmail!: string;

  @ApiProperty({ enum: TICKET_PRIORITIES })
  @IsIn([...TICKET_PRIORITIES])
  priority!: TicketPriority;
}
