# Milestone 7 — Deployment Guide

## 1. Overview

SkillLink is deployed as:

```text
Vercel Frontend
      │
      │ HTTPS
      ▼
Render Express API
      │
      │ Prisma
      ▼
Render PostgreSQL
```

The frontend lives in:

```text
frontend/
```

The backend remains at the repository root.

## 2. Repository structure

```text
IT-Project/
├── src/                    # Express backend
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── package.json
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    └── vite.config.ts
```

Do not merge the frontend source into the backend `src/` directory.

Do not commit `node_modules/`.

## 3. PostgreSQL deployment

A managed PostgreSQL database was created on Render.

The database name can be Render-generated; the application connects through `DATABASE_URL`.

Existing Prisma migrations are stored in:

```text
prisma/migrations/
```

The local project was verified before deployment with:

```bash
npx prisma migrate status
npx prisma validate
npx prisma generate
```

## 4. Backend deployment

The Express API is deployed as a Render Web Service.

The server already supports cloud deployment because it uses the platform-provided port and binds to all interfaces:

```ts
const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`SkillLink API running on port ${PORT}`);
});
```

### Build command

The final Render build command is:

```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

The order is important:

```text
npm install
    ↓
Prisma Client generation
    ↓
Database migrations
    ↓
Application start
```

The `prisma generate` step is required because the backend imports the generated Prisma client from:

```text
generated/prisma/client
```

### Start command

```bash
npm start
```

The backend package currently uses:

```json
"start": "tsx src/server.ts"
```

## 5. Production environment variables

Configure these in Render:

```text
DATABASE_URL
JWT_SECRET
NODE_ENV=production
```

### DATABASE_URL

Use the Render PostgreSQL connection string.

Never commit this value to GitHub.

### JWT_SECRET

Use a strong random production secret.

Do not reuse development secrets unnecessarily and never commit this value.

### NODE_ENV

The production value is:

```text
NODE_ENV=production
```

## 6. Health checks

The backend exposes:

```text
GET /health
```

Configure Render's health-check path as:

```text
/health
```

This avoids using `/`, which is not the application's health endpoint.

## 7. CORS

The backend allows development origins and the deployed frontend origin.

Development:

```text
http://localhost:5173
http://localhost:8443
```

Production:

```text
https://<your-production-vercel-domain>
```

The production origin must match the browser origin exactly.

## 8. Frontend deployment

The frontend is deployed through Vercel.

Configuration:

```text
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

The production API variable is configured in Vercel as:

```text
VITE_API_URL=https://skilllink-api-dv8z.onrender.com
```

Because Vite injects `VITE_*` variables at build time, changing the variable requires a new frontend deployment.

## 9. API client

The shared frontend API client is:

```text
frontend/src/lib/api.ts
```

It:

- Supports GET, POST, PUT, PATCH, and DELETE
- Adds JSON request headers when a body exists
- Attaches the JWT as a Bearer token
- Converts non-success responses into errors
- Handles HTTP 401 responses globally

A production request should look like:

```text
https://skilllink-api-dv8z.onrender.com/api/...
```

and must not point to `localhost:3000`.

## 10. Authentication

Production authentication was verified:

```text
Register
  ↓
Login
  ↓
JWT stored
  ↓
Protected API requests
  ↓
Refresh browser
  ↓
Session restored
```

Expired or invalid sessions are cleared and the user is returned to Login.

## 11. Services

Production service endpoints:

```text
GET    /api/services
GET    /api/services/:id
POST   /api/services
PATCH  /api/services/:id
DELETE /api/services/:id
```

Verified frontend features:

- Browse
- Search
- Pricing filtering
- Location filtering
- Service details
- Provider service creation
- Provider service editing
- Provider service deletion

## 12. Bookings

Production booking endpoints:

```text
POST  /api/bookings
GET   /api/bookings/client
GET   /api/bookings/provider

PATCH /api/bookings/:id/cancel
PATCH /api/bookings/:id/accept
PATCH /api/bookings/:id/reject
PATCH /api/bookings/:id/complete
```

Verified status flows:

```text
PENDING → ACCEPTED → COMPLETED
PENDING → REJECTED
PENDING → CANCELLED
```

## 13. Dashboards

The client dashboard loads real transactions from:

```text
GET /api/bookings/client
```

The provider dashboard loads real transactions from:

```text
GET /api/bookings/provider
```

Recent activity no longer uses the original Figma mock booking data.

## 14. Production build verification

The frontend production build was successfully verified with:

```bash
npm run build
```

The build completed successfully.

Vite emitted configuration warnings from the Figma-generated config, but these did not block deployment.

## 15. Production troubleshooting

### Failed to Fetch

Check:

1. Vercel `VITE_API_URL`
2. Browser Network → Request URL
3. Backend CORS
4. Render backend health
5. Production browser console

The request should target:

```text
https://skilllink-api-dv8z.onrender.com/api/...
```

### Backend cannot find generated Prisma client

If Render reports:

```text
Cannot find module '../../generated/prisma/client'
```

make sure the build command includes:

```bash
npx prisma generate
```

The final build command is:

```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

### Authentication returns 500

Check:

- `DATABASE_URL`
- `JWT_SECRET`
- database migration output
- Render deployment logs
- browser Network → response body

## 16. Security

Never commit:

```text
.env
DATABASE_URL
JWT_SECRET
```

Use Render/Vercel environment variables for production configuration.

## 17. Final production checklist

```text
[ ] Render PostgreSQL is running
[ ] DATABASE_URL configured
[ ] JWT_SECRET configured
[ ] NODE_ENV=production
[ ] Prisma generate runs during deployment
[ ] Prisma migrations deploy successfully
[ ] Render health check uses /health
[ ] Backend is healthy
[ ] VITE_API_URL points to production API
[ ] Vercel deployment succeeds
[ ] CORS includes production frontend origin
[ ] Login works in production
[ ] Session survives refresh
[ ] Service browsing works
[ ] Service details work
[ ] Provider service CRUD works
[ ] Booking creation works
[ ] Client bookings work
[ ] Client cancellation works
[ ] Provider bookings work
[ ] Accept/reject/complete work
[ ] Dashboard recent activity uses real data
[ ] Browser requests point to Render, not localhost
[ ] Frontend production build succeeds
```

## 18. Deployment status

**Production deployment — COMPLETE**

Current production stack:

```text
Vercel
  ↓
React + Vite frontend
  ↓
Render
  ↓
Express + Prisma API
  ↓
Render PostgreSQL
```
