import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  #prices = { ADULT: 25, CHILD: 15, INFANT: 0 };

  purchaseTickets(accountId, ...ticketTypeRequests) {
    const totalCost = ticketTypeRequests.reduce((total, req) => {
      return total + (this.#prices[req.getTicketType()] * req.getNoOfTickets());
    }, 0);
    return totalCost;
  }
}
