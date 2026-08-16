# Milestone 6 — Frontend Integration

## Overview

Milestone 6 focused on turning the SkillLink frontend from a Figma-generated prototype into a working application connected to the existing backend.

The frontend uses React, TypeScript, Vite, and Tailwind CSS and integrates with the existing Express, Prisma, PostgreSQL, and JWT-based backend.

## Frontend Setup

The frontend is organized as a separate application inside the repository:

```text
IT-Project/
├── src/                  # Backend
├── prisma/
├── tests/
├── package.json
└── frontend/             # React frontend
    ├── src/
    ├── public/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    └── ...
```

## UI and Product Direction

The Figma-generated interface was refined to feel like a real Nigerian marketplace instead of an AI-generated template.

The design prioritizes:

- Professional and practical layouts
- Clear hierarchy and readable typography
- Restrained use of cards and rounded elements
- Minimal decorative elements
- Nigerian context
- Nigerian Naira (₦)
- Realistic Nigerian locations
- Responsive desktop and mobile layouts

Unnecessary emojis, glowing gradients, floating blobs, excessive pill-shaped elements, and other AI-style decorative patterns were intentionally avoided.

## Authentication Integration

The frontend authentication flow is connected to the real backend.

Implemented:

- Registration
- Login
- Logout
- JWT storage
- Persistent sessions across browser refreshes
- Role-aware navigation for CLIENT and PROVIDER users
- Expired token detection
- Automatic session clearing after unauthorized API responses

Authenticated requests attach:

```text
Authorization: Bearer <token>
```

## API Client

A shared frontend API client was created at:

```text
frontend/src/lib/api.ts
```

It provides:

- GET
- POST
- PUT
- PATCH
- DELETE

The client also attaches the stored JWT, handles JSON requests, converts API errors into readable errors, and handles HTTP 401 responses globally.

## Service Marketplace

The Browse Services page was connected to the real backend.

Implemented:

- Real service loading
- Search
- Pricing filtering
- Location filtering
- Category presentation
- Loading states
- Empty states
- Error states

Endpoints:

```text
GET /api/services
GET /api/services/:id
```

## Category and Image Handling

The current backend does not yet persist a dedicated service category or listing image.

For now:

- Categories are derived from service titles.
- Fallback images are selected according to the service title/category.

Examples:

```text
Web Development → Development
Logo Design → Design
SEO Strategy → Marketing
Technical Writing → Writing
Photography → Photography & Video
```

This is a frontend presentation strategy and leaves room for future backend support for real categories and provider-uploaded images.

## Booking Integration

The booking workflow was connected to the real backend.

Implemented:

- Create booking
- View client bookings
- Cancel pending bookings
- View provider bookings
- Accept pending bookings
- Reject pending bookings
- Complete accepted bookings

Booking status flow:

```text
PENDING → ACCEPTED → COMPLETED
PENDING → REJECTED
PENDING → CANCELLED
```

Endpoints:

```text
POST  /api/bookings
GET   /api/bookings/client
GET   /api/bookings/provider

PATCH /api/bookings/:id/cancel
PATCH /api/bookings/:id/accept
PATCH /api/bookings/:id/reject
PATCH /api/bookings/:id/complete
```

## Provider Service Management

Implemented:

- Create service
- View services
- Edit service
- Delete service

Endpoints:

```text
GET    /api/services
POST   /api/services
PATCH  /api/services/:id
DELETE /api/services/:id
```

Important implementation detail: the update endpoint uses `PATCH`, not `PUT`.

## Dashboards

Both client and provider dashboards now use real booking data.

Client dashboard:

```text
GET /api/bookings/client
```

Provider dashboard:

```text
GET /api/bookings/provider
```

They now display real:

- Recent bookings
- Booking counts
- Booking statuses
- Service activity

## Mock Data Cleanup

Core application flows were migrated away from the original Figma mock users, services, and bookings.

The backend is now the source of truth for:

- Authentication
- Services
- Bookings
- Provider service management
- Dashboard activity

## Session Persistence

The frontend persists:

- JWT
- User information
- Current page
- Page parameters

Refreshing the browser no longer forces the user back to the home screen and login page.

The frontend also checks JWT expiration on startup and clears invalid sessions.

## Error and Loading States

The frontend now includes loading and error handling across the main API-driven experiences, including:

- Authentication
- Service loading
- Booking submission
- Booking cancellation
- Provider booking actions
- Empty service results
- Empty booking results
- Expired sessions

## Build Verification

The frontend production build was successfully verified using:

```bash
npm run build
```

The build completed successfully.

Vite reported configuration warnings related to Figma-generated config features, but these did not prevent a successful production build.

## End-to-End Verification

### Client

```text
Register
→ Login
→ Browse services
→ View service
→ Create booking
→ View booking
→ Cancel booking
```

### Provider

```text
Register
→ Login
→ Create service
→ Edit service
→ Delete service
→ Receive booking
→ Accept booking
→ Complete booking
```

The rejection path was also implemented:

```text
PENDING → REJECTED
```

Session persistence was verified during browser refreshes.

## Intentionally Deferred Features

The following remain outside the current milestone:

- Reviews
- Admin functionality
- Payments
- Provider image uploads

## Milestone Status

**Milestone 6 — COMPLETE **

SkillLink now has a functional React frontend connected to the real backend, with working authentication, service discovery, booking workflows, provider service management, dashboard activity, session persistence, and production build verification.
