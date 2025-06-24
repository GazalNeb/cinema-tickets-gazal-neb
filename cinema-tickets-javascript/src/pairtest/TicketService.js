import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  #prices = { ADULT: 25, CHILD: 15, INFANT: 0 };

  purchaseTickets(accountId, ...ticketTypeRequests) {
   const ticketCounts = { ADULT: 0, CHILD: 0, INFANT: 0 };

    ticketTypeRequests.forEach(req => {
      ticketCounts[req.getTicketType()] += req.getNoOfTickets();
    });

    if ((ticketCounts.INFANT > 0 || ticketCounts.CHILD > 0) && ticketCounts.ADULT === 0) {
      throw new InvalidPurchaseException('Child and Infant tickets require Adult tickets.');
    }
    
    const totalCost = ticketTypeRequests.reduce((total, req) => {
      return total + (this.#prices[req.getTicketType()] * req.getNoOfTickets());
    }, 0);
    return totalCost;
  }
}
