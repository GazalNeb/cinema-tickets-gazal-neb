import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  test("should calculate total payment correctly for a single adult ticket", () => {
    const ticketService = new TicketService();
    const request = new TicketTypeRequest("ADULT", 1);

    expect(ticketService.purchaseTickets(1, request)).toBe(25);
  });

  test("should calculate total payment correctly for multiple tickets", () => {
    const ticketService = new TicketService();
    const requests = [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 1),
    ];

    expect(ticketService.purchaseTickets(1, ...requests)).toBe(65); // 2*25 + 1*15
  });

  test("should throw InvalidPurchaseException if child or infant tickets are purchased without adult tickets", () => {
    const ticketService = new TicketService();
    const requests = [new TicketTypeRequest("INFANT", 1)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException(
        "Child and Infant tickets require Adult tickets."
      )
    );
  });

  test("should throw InvalidPurchaseException if more than 25 tickets are purchased", () => {
    const ticketService = new TicketService();
    const requests = [new TicketTypeRequest("ADULT", 26)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException("Cannot purchase more than 25 tickets.")
    );
  });
});
