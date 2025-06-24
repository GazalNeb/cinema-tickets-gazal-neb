import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  let mockPayment;
  let mockReservation;
  let ticketService;

  beforeEach(() => {
    mockPayment = { makePayment: jest.fn() };
    mockReservation = { reserveSeat: jest.fn() };
    ticketService = new TicketService(mockPayment, mockReservation);
  });

  test("should calculate total payment correctly for a single adult ticket", () => {
    const request = new TicketTypeRequest("ADULT", 1);
    const result = ticketService.purchaseTickets(1, request);

    expect(result).toBe(25);
    expect(mockPayment.makePayment).toHaveBeenCalledWith(1, 25);
    expect(mockReservation.reserveSeat).toHaveBeenCalledWith(1, 1);
  });

  test("should calculate total payment correctly for multiple tickets", () => {
    const requests = [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 1),
      new TicketTypeRequest("INFANT", 1),
    ];
    const result = ticketService.purchaseTickets(1, ...requests);

    expect(result).toBe(65); // 2*25 + 1*15
    expect(mockPayment.makePayment).toHaveBeenCalledWith(1, 65);
    expect(mockReservation.reserveSeat).toHaveBeenCalledWith(1, 3); // infants do not reserve seats
  });

  test("Invalid: No tickets purchased", () => {
    expect(() => ticketService.purchaseTickets(1)).toThrow(
      InvalidPurchaseException
    );
  });

  test("Invalid: More than 25 tickets", () => {
    const requests = [new TicketTypeRequest("ADULT", 26)];
    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      "Cannot purchase more than 25 tickets."
    );
  });

  test("Invalid: Child ticket without adult", () => {
    const requests = [new TicketTypeRequest("CHILD", 1)];
    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      "Child and Infant tickets require at least one Adult ticket."
    );
  });

  test("Invalid: Infant ticket without adult", () => {
    const requests = [new TicketTypeRequest("INFANT", 1)];
    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      "Child and Infant tickets require at least one Adult ticket."
    );
  });

  test("Invalid: Infants exceed adults", () => {
    const requests = [
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("INFANT", 2),
    ];
    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      "Each Infant must be accompanied by an Adult."
    );
  });

  test("Invalid: Negative account ID", () => {
    const requests = [new TicketTypeRequest("ADULT", 1)];
    expect(() => ticketService.purchaseTickets(-5, ...requests)).toThrow(
      "Invalid account ID."
    );
  });

  test("Invalid: Account ID of zero", () => {
    const requests = [new TicketTypeRequest("ADULT", 1)];
    expect(() => ticketService.purchaseTickets(0, ...requests)).toThrow(
      "Invalid account ID."
    );
  });
});
