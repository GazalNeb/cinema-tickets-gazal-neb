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
  });

  test("should calculate total payment correctly for multiple tickets", () => {
    const requests = [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 1),
    ];
    const result = ticketService.purchaseTickets(1, ...requests);

    expect(result).toBe(65); // 2*25 + 1*15
  });

  test("should throw InvalidPurchaseException if child or infant tickets are purchased without adult tickets", () => {
    const requests = [new TicketTypeRequest("INFANT", 1)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException(
        "Child and Infant tickets require Adult tickets."
      )
    );
  });

  test("should throw InvalidPurchaseException if more than 25 tickets are purchased", () => {
    const requests = [new TicketTypeRequest("ADULT", 26)];

    expect(() => ticketService.purchaseTickets(1, ...requests)).toThrow(
      new InvalidPurchaseException("Cannot purchase more than 25 tickets.")
    );
  });

  test("should call payment and reservation services correctly", () => {
    const requests = [
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("CHILD", 2),
      new TicketTypeRequest("INFANT", 1),
    ];

    const result = ticketService.purchaseTickets(1, ...requests);

    expect(mockPayment.makePayment).toHaveBeenCalledWith(1, 55); // 25 + 15 + 15
    expect(mockReservation.reserveSeat).toHaveBeenCalledWith(1, 3); // infants don't get seats
    expect(result).toBe(55);
  });
});
