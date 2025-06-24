import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

describe('TicketService', () => {
  test('should calculate total payment correctly for a single adult ticket', () => {
    const ticketService = new TicketService();
    const request = new TicketTypeRequest('ADULT', 1);
    
    expect(ticketService.purchaseTickets(1, request)).toBe(25);
  });
});