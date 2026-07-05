import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Ticket } from '@ticket/shared';
import { TicketsService } from '../application/tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOkResponse({ type: TicketResponseDto, isArray: true })
  findMany(@Query() filters: TicketQueryDto): Promise<Ticket[]> {
    return this.ticketsService.findMany(filters);
  }

  @Get(':id')
  @ApiOkResponse({ type: TicketResponseDto })
  @ApiNotFoundResponse({ description: 'Ticket not found.' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.ticketsService.findById(id);
  }

  @Post()
  @ApiCreatedResponse({ type: TicketResponseDto })
  create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TicketResponseDto })
  @ApiNotFoundResponse({ description: 'Ticket not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Ticket successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Ticket not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.ticketsService.delete(id);
  }
}
