## Milestone 2 — Authentication & Authorization

After completing Milestone 1, start the development server:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:3000
```

### Testing Authentication

Use Postman to test the authentication endpoints.

#### Register

```text
POST /api/auth/register
```

Example body:

```json
{
  "firstName": "Philip",
  "lastName": "Test",
  "email": "philip@test.com",
  "password": "Password123!",
  "role": "CLIENT"
}
```

#### Login

```text
POST /api/auth/login
```

Example body:

```json
{
  "email": "philip@test.com",
  "password": "Password123!"
}
```

Copy the JWT token returned from the login response.

### Testing Protected Routes

Use the JWT as a **Bearer Token** in Postman.

```text
GET /api/protected
```

In Postman:

1. Open **Authorization**.
2. Select **Bearer Token**.
3. Paste the JWT into the Token field.
4. Send the request.

### Testing Role-Based Routes

The available roles are:

```text
CLIENT
PROVIDER
ADMIN
```

Test the following routes using a valid JWT:

```text
GET /api/protected/client
GET /api/protected/provider
GET /api/protected/admin
```

A user with the correct role should receive a successful response.

A user attempting to access a route that requires a different role should receive:

```text
403 Forbidden
```

A request without a valid JWT should receive:

```text
401 Unauthorized
```

### Milestone 2 Environment Variables

Make sure the `.env` file contains:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
```

Do not commit the `.env` file or expose these values.

### Milestone 2 Verification

To confirm that Milestone 2 is working correctly, verify:

- User registration works.
- User login works and returns a JWT.
- Protected routes reject unauthenticated requests.
- Protected routes accept valid JWTs.
- Users can access routes permitted for their role.
- Users are denied access to routes outside their role.
