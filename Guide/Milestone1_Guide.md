# SkillLink


## MVP Entities

- **User**
- **Service**
- **Booking**
- **Payment**

Category is planned for a later version and is not part of the current MVP.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- Render

## Getting Started

### Prerequisites

Make sure you have:

- Node.js
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/PhilipSwitch/IT-Project.git
cd IT-Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/Skill_Link"
```

Replace the value with your PostgreSQL connection string.


### 4. Set up the database

Run:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the application locally

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

### 6. Test the health check

Open:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "SkillLink API is running"
}
```

If you receive this response, the local API is running successfully.

## Production

The API is deployed on Render.

To verify the production deployment, open the deployed `/health` endpoint:

```text
https://it-project-hkdu.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "SkillLink API is running"
}
```

## Available Commands

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npx prisma migrate dev` | Apply Prisma migrations locally |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open Prisma Studio |



## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | postgresql://postgres:password123@localhost:5432/Skill_Link |


---
