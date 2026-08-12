# Milestone 3 — Listings & Booking Flow

Milestone 3 implements the core SkillLink marketplace functionality.

Providers can create and manage service listings, while clients can discover services and create bookings. The milestone also introduces the complete booking status workflow.

---

## 1. Service Listings

Providers can manage their service listings using CRUD operations.

### Supported Operations

```text
POST   /api/services
GET    /api/services
GET    /api/services/:id
PUT    /api/services/:id
DELETE /api/services/:id
```

### Service Information

Each service contains:

- Title
- Description
- Price
- Pricing type
- Availability
- Provider information

Only authenticated providers can create and manage their own listings.

---

## 2. Search & Filtering

The service listing API supports searching and filtering services.

Clients can find relevant services based on available listing information such as:

- Service title
- Description
- Pricing type
- Provider information

Example:

```text
GET /api/services?search=web
```

---

## 3. Creating a Booking

Authenticated clients can create bookings for available services.

### Endpoint

```text
POST /api/bookings
```

A valid **CLIENT JWT** is required.

### Example Request

```json
{
  "serviceId": 1,
  "bookingDate": "2026-08-20",
  "scheduledTime": "2026-08-20T14:00:00.000Z",
  "notes": "I need this service for my project."
}
```

The `serviceId` must correspond to an existing service.

Every newly created booking starts with:

```text
PENDING
```

---

## 4. Provider Booking Management

Providers can view bookings associated with their own services.

### Endpoint

```text
GET /api/bookings/provider
```

A valid **PROVIDER JWT** is required.

The API only returns bookings for services owned by the authenticated provider.

---

## 5. Accepting a Booking

Providers can accept pending bookings.

### Endpoint

```text
PATCH /api/bookings/:id/accept
```

Example:

```text
PATCH /api/bookings/1/accept
```

### Result

```text
PENDING → ACCEPTED
```

---

## 6. Rejecting a Booking

Providers can reject pending bookings.

### Endpoint

```text
PATCH /api/bookings/:id/reject
```

Example:

```text
PATCH /api/bookings/1/reject
```

### Result

```text
PENDING → REJECTED
```

Only pending bookings can be rejected.

---

## 7. Client Booking Management

Clients can view their own bookings.

### Endpoint

```text
GET /api/bookings/client
```

A valid **CLIENT JWT** is required.

The endpoint returns bookings belonging to the authenticated client.

---

## 8. Cancelling a Booking

Clients can cancel their own pending bookings.

### Endpoint

```text
PATCH /api/bookings/:id/cancel
```

Example:

```text
PATCH /api/bookings/2/cancel
```

Only bookings with the status `PENDING` can be cancelled.

### Result

```text
PENDING → CANCELLED
```

---

## 9. Completing a Booking

Providers can mark an accepted booking as completed.

### Endpoint

```text
PATCH /api/bookings/:id/complete
```

Example:

```text
PATCH /api/bookings/1/complete
```

Only accepted bookings can be completed.

### Result

```text
ACCEPTED → COMPLETED
```

---

## 10. Booking Status Flow

The complete booking lifecycle implemented in Milestone 3 is:

```text
                    ┌──→ ACCEPTED ──→ COMPLETED
                    │
PENDING ────────────┼──→ REJECTED
                    │
                    └──→ CANCELLED
```

The API prevents invalid status transitions.

---

## 11. Role-Based Access

| Action | CLIENT | PROVIDER | ADMIN |
|---|---:|---:|---:|
| Create service | ❌ | ✅ | ❌ |
| Manage own service | ❌ | ✅ | ❌ |
| View services | ✅ | ✅ | ✅ |
| Create booking | ✅ | ❌ | ❌ |
| View own bookings | ✅ | ❌ | ❌ |
| Cancel booking | ✅ | ❌ | ❌ |
| View provider bookings | ❌ | ✅ | ❌ |
| Accept booking | ❌ | ✅ | ❌ |
| Reject booking | ❌ | ✅ | ❌ |
| Complete booking | ❌ | ✅ | ❌ |

---

## 12. API Endpoints Summary

### Services

```text
POST   /api/services
GET    /api/services
GET    /api/services/:id
PUT    /api/services/:id
DELETE /api/services/:id
```

### Bookings

```text
POST   /api/bookings
GET    /api/bookings/client
GET    /api/bookings/provider

PATCH  /api/bookings/:id/accept
PATCH  /api/bookings/:id/reject
PATCH  /api/bookings/:id/cancel
PATCH  /api/bookings/:id/complete
```

---

## 13. Testing With Postman

The Listings and Booking Flow was tested locally using Postman.

### Provider Flow

```text
1. Login as PROVIDER
        ↓
2. Create service
        ↓
3. View provider bookings
        ↓
4. Accept booking
        ↓
5. Complete booking
```

### Client Flow

```text
1. Login as CLIENT
        ↓
2. View available services
        ↓
3. Create booking
        ↓
4. View own bookings
        ↓
5. Cancel pending booking
```

### Verified Booking States

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
COMPLETED
```

---

## 14. End-to-End Booking Flow

```text
Provider
   │
   ├── Creates service
   │
   ▼
Service becomes available
   │
   ▼
Client views services
   │
   ├── Selects service
   │
   └── Creates booking
            │
            ▼
         PENDING
            │
            ▼
        Provider
            │
       ┌────┴────┐
       ▼         ▼
   ACCEPTED   REJECTED
       │
       ▼
   COMPLETED
```

A client can also cancel while the booking is pending:

```text
PENDING
   │
   ▼
CANCELLED
```

---

## 15. Security & Authorization

All booking operations are protected using JWT authentication.

The API verifies:

1. The user has provided a valid JWT.
2. The JWT has not expired.
3. The user's role is authorized for the requested action.
4. Providers can only manage bookings associated with their own services.
5. Clients can only manage their own bookings.

---

## 16. Current Milestone Status

### Milestone 3 — COMPLETE ✅

The SkillLink backend now supports:

- Service listing CRUD
- Search and filtering
- Client booking creation
- Provider booking management
- Client booking management
- Booking status management
- Booking cancellation
- Booking completion
- Role-based booking authorization
- JWT-protected booking endpoints
- Postman API testing

The complete booking lifecycle is now functional.

---

