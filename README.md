# 🎟️ TicketService Coding Assignment

This is my JavaScript solution for the Cinema Tickets assignment given here:- https://github.com/dwp/cinema-tickets. This repository also contains original starter code for Java and Python, which I have left unchanged.

I have worked on an implementation of a TicketService that handles purchasing different ticket types (ADULT, CHILD, INFANT) with validations, pricing, and integration with external payment and seat reservation services.

## 🎯 Business Rules and Constraints

### 🎟️ Ticket Pricing

| Ticket Type | Price |
|-------------|-------|
| `ADULT`     | £25   |
| `CHILD`     | £15   |
| `INFANT`    | £0    |

### ✅ Validation Rules

- Maximum of **25 tickets** per transaction.
- Must purchase at least **one ticket**.
- `CHILD` and `INFANT` tickets **require at least one `ADULT` ticket**.
- Number of `INFANT` tickets **cannot exceed** the number of `ADULT` tickets.
- Account ID must be a positive integer (greater than zero).

### 💺 Seat Allocation Rules

- Infants do **not occupy** seats (they must sit on an adult's lap).

---

## 🛠️ Installation & Testing

### 📌 Prerequisites

- **Node.js v20+**
- **npm**

### 🚀 Installation Steps

Install dependencies:

```bash
npm install
```

### ✅ Running Unit Tests

Execute Jest tests:

```bash
npm test
```

---

## 🧪 Test-Driven Development (TDD)

The implementation follows a **Test-Driven Development** approach, involving:

- Writing failing unit tests first.
- Implementing minimal logic to pass tests.
- Incrementally adding new tests for additional validations and features.
- Final integration tests verifying external service interactions.

---

## 🚩 Exception Handling

All validation errors throw an instance of `InvalidPurchaseException` with descriptive error messages.

Example:

```javascript
throw new InvalidPurchaseException('Cannot purchase more than 25 tickets.');
```

---

## 🔗 Integration with External Services

The implementation integrates seamlessly with the following external services:

- `TicketPaymentService` – Handles all payment transactions.
- `SeatReservationService` – Manages seat reservations.

Mock implementations are provided for unit testing.

---

## 📋 Validations and Constraints Checklist

| Rule/Validation                               | Status |
|-----------------------------------------------|--------|
| Must purchase at least one ticket             | ✅     |
| Maximum of 25 tickets per transaction         | ✅     |
| Child/Infant requires adult ticket            | ✅     |
| Number of Infants ≤ Adults                    | ✅     |
| Positive integer account ID                   | ✅     |
| Correct total cost calculation                | ✅     |
| Correct seat reservation calculation          | ✅     |
| Integration with external services            | ✅     |

---

## 🚀 Future Improvements

- Enhanced logging and monitoring capabilities.
- Real integration tests with external services.
- Enhanced scalability (e.g., handling concurrent transactions).

---

## 🙋 Author

- **Gazal Neb**

---

## 📅 Last Updated

- **June 24, 2025**