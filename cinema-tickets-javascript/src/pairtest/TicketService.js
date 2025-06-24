import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  #prices = { ADULT: 25, CHILD: 15, INFANT: 0 };
  #paymentService;
  #seatReservationService;

  constructor(paymentService, seatReservationService) {
    this.#paymentService = paymentService;
    this.#seatReservationService = seatReservationService;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    const ticketCounts = { ADULT: 0, CHILD: 0, INFANT: 0 };

    ticketTypeRequests.forEach((req) => {
      ticketCounts[req.getTicketType()] += req.getNoOfTickets();
    });

    if (
      (ticketCounts.INFANT > 0 || ticketCounts.CHILD > 0) &&
      ticketCounts.ADULT === 0
    ) {
      throw new InvalidPurchaseException(
        "Child and Infant tickets require Adult tickets."
      );
    }

    const totalTickets = ticketTypeRequests.reduce(
      (sum, req) => sum + req.getNoOfTickets(),
      0
    );
    if (totalTickets > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets."
      );
    }

    const totalCost = ticketTypeRequests.reduce((total, req) => {
      return total + this.#prices[req.getTicketType()] * req.getNoOfTickets();
    }, 0);

    const seatsToReserve = ticketCounts.ADULT + ticketCounts.CHILD;

    this.#paymentService.makePayment(accountId, totalCost);
    this.#seatReservationService.reserveSeat(accountId, seatsToReserve);

    return totalCost;
  }
}
