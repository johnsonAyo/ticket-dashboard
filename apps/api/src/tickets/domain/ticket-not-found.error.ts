export class TicketNotFoundError extends Error {
  constructor(public readonly ticketId: number) {
    super(`Ticket ${ticketId} was not found.`);
    this.name = 'TicketNotFoundError';
  }
}
