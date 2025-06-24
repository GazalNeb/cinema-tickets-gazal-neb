import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";

export default class TicketService {
  #paymentService;
  #seatReservationService;
  #ticketPrices = { ADULT: 25, CHILD: 15, INFANT: 0 };
  #MAX_TICKETS = 25;

  constructor(paymentService, seatReservationService) {
    this.#paymentService = paymentService;
    this.#seatReservationService = seatReservationService;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountId(accountId);
    const ticketCounts = this.#countTickets(ticketTypeRequests);
    this.#validateTickets(ticketCounts);

    const totalCost = this.#calculateTotalCost(ticketCounts);
    const seatsToReserve = ticketCounts.ADULT + ticketCounts.CHILD;

    this.#paymentService.makePayment(accountId, totalCost);
    this.#seatReservationService.reserveSeat(accountId, seatsToReserve);

    return totalCost;
  }

  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID.");
    }
  }

  #countTickets(ticketTypeRequests) {
    const counts = { ADULT: 0, CHILD: 0, INFANT: 0 };

    ticketTypeRequests.forEach((req) => {
      const type = req.getTicketType();
      counts[type] += req.getNoOfTickets();
    });

    return counts;
  }

  #validateTickets({ ADULT, CHILD, INFANT }) {
    const totalTickets = ADULT + CHILD + INFANT;

    if (totalTickets === 0) {
      throw new InvalidPurchaseException("Must purchase at least one ticket.");
    }

    if (totalTickets > this.#MAX_TICKETS) {
      throw new InvalidPurchaseException(
        `Cannot purchase more than ${this.#MAX_TICKETS} tickets.`
      );
    }

    if ((CHILD > 0 || INFANT > 0) && ADULT === 0) {
      throw new InvalidPurchaseException(
        "Child and Infant tickets require at least one Adult ticket."
      );
    }

    if (INFANT > ADULT) {
      throw new InvalidPurchaseException(
        "Each Infant must be accompanied by an Adult."
      );
    }
  }

  #calculateTotalCost(ticketCounts) {
    return Object.entries(ticketCounts).reduce((total, [type, quantity]) => {
      return total + this.#ticketPrices[type] * quantity;
    }, 0);
  }
}
