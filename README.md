# IT-Project
Internship project with TRIIBE 

# SkillLink — SIWES IT Project Brief

Welcome to your industrial training. This document is your project brief and program overview for the next few months — read it fully before we start, and keep coming back to it. It's the reference for what you're building, why, and how we'll work together.

# How this works
You're building one real project from start to finish: SkillLink, a local services marketplace. Not a tutorial clone, not a toy — a project you'll be able to demo to your university panel and put on your CV afterward.

My role is to guide, review, and push you to think — not to hand you solutions. When you get stuck, come with what you've already tried, not just "it's not worming." That's the single biggest thing that'll make this valuable for you.

# 1.	The Project
**Problem:** On most campuses and in most neighborhoods, people offering services — tutors, repair techs, hairstylists, caterers, errand runners — get found through word-of-mouth and WhatsApp status. There's no central place to discover them, compare them, book them, and hold them accountable. SkillLink fixes that.

**What you're building:** A two-sided marketplace where providers list services and clients search, book, pay, and review them. There's also an admin role for moderation.

**In scope:**

- Provider onboarding and service listings
- Client search and filtering
- Booking requests with a status flow (pending	accepted	completed/cancelled)
- Authentication with roles (client provider / admin)
- Reviews and ratings after completed bookings
- Admin dashboard (approve providers, remove listings, view basic stats)
- A mocked payment flow (no real money — you're simulating it)
- A live, publicly accessible deployed version

**Not in scope (for now):** real payment processing, native mobile apps, real-time chat, multi-language support. These are stretch goals if you finish early — not requirements.

**What you'll hand in by the end:**
1.	A GitHub repo with a real commit history (not one giant commit at the end)
2.	A live deployed app
3.	API documentation (Postman collection or Swagger/OpenAPI)
4.	An ERD and a short architecture write-up
5.	A README someone else could use to run your project from scratch
6.	A test suite covering the critical paths (auth, booming)
7.	A final presentation and live demo
8.	A short weekly engineering journal— you'll use this later for your "lessons learned"
   
**Stack:**
- Backend: Node.js + Express
- Database: PostgreSQL, via Prisma
- Frontend: React (Vite)
- Auth: JWT + bcrypt
- Testing: Jest + Supertest
- Deployment: Render/Railway (backend + DB), Vercel (frontend)
- Docs: Swagger/OpenAPI or Postman

**Stretch goals (only once the core is solid and working):** notifications, a provider availability calendar, real payment integration (Paystack/Flutterwave test mode), rewriting the backend in NestJS, a CI pipeline, rate limiting and input hardening.

# 2.	How the project breaks down
Nine milestones. Each one has a clear output and a research task attached — the research is not optional, it's part of the milestone.

| # | Milestone | You'll produce | You'll need to research |
| :--- | :--- | :--- | :--- |
| 0 | Planning | One-page project brief in your own words, feature list (MVP vs later), ERD sketch, repo set up | What a feature spec looks like, how to read/draw an ERD |
| 1 | Database & API skeleton | Finalized ERD, Prisma schema, scaffolded Express project, deployed health-check | Normalization basics, REST conventions, layered architecture |
| 2 | Auth & roles | Register/login, protected routes, role-based middleware | Password hashing, JWT structure and expiry, auth vs authorization |
| 3 | Listings & booking flow | CRUD for listings, search/filter, booking status flow | Designing state flows, pagination, query filtering |
| 4 | Reviews & admin | Reviews tied to completed bookings, admin moderation, stats endpoint | Server-side business rules, aggregate queries |
| 5 | Testing & error handling | Test suite, centralized error handling, structured logging | Unit vs integration tests, log levels |
| 6 | Frontend integration | Working UI for auth, browsing, booking, reviews | React data fetching, client-side route protection |
| 7 | Deployment & docs | Live app, managed environment variables, README, API docs | Env var management, CORS in production |
| 8 | Polish & presentation prep | Bug fixes, at least one stretch goal, deck, rehearsed demo | How to structure a technical presentation |

Common traps to watch for at each stage — jumping into code before planning, mixing business logic into your route handlers, trusting the frontend to enforce rules that should live on the server, skipping validation, and leaving documentation for the last week. If you avoid just these, you'11a1ready be ahead of most interns.


# 3.	Weekly Roadmap (12 weeks — we'll adjust if needed)

| Week | Focus | Checkpoint |
| :--- | :--- | :--- |
| 1 | Planning, brief, ERD sketch, repo setup |	Kickoff review: brief + ERD |
| 2 |	DB schema + API skeleton	| Schema review, skeleton deployed |
| 3 |	Auth: register/login	| Auth demo via Postman |
| 4 |	Roles & middleware	| Role-based access demo |
| 5 |	Listings CRUD	Provider | listing demo |
| 6 |	Booking flow, search/filter	| Full booking flow demo |
| 7 |	Midpoint review	| Full code + architecture review |
| 8	| Reviews + admin dashboard	| Reviews and moderation demo |
| 9 | Testing, error handling, logging	| Test suite + error handling walkthrough |
| 10 | Frontend integration	| UI demo |
| 11 | Frontend cont'd + deployment	| Live URL shared |
| 12 | Polish, stretch goal, presentation prep	| **Final presentation** |

One scheduled review session per week, plus async availability for blockers between sessions. Every week, send me a short update — 3 to 5 lines: what shipped, what's blocked, what's next. Keep it honest; it's for your own tracking as much as mine.

# 4.	What you're actually learning
By the end, you should be comfortable with all of these — not because you memorized them, but because you used them to ship something:

Git & GitHub workflow (branches, PRs) writing commit messages that explain why, not just what reading official documentation before searching for tutorials debugging
systematicall-y RESTAPI design relational database design-	authentication and
authorization-	error handling - logging testing fundamental-s deploymen-t code review - writing technical documentation.

# 5.	How revlews will work
Come to each session with:

-	The PR(s) you opened that week
-	Your weekly update
-	Whatever you're stuck on — but be ready to explain what you've already tried

Expect to be asked to explain your decisions, not just show that something works."It works" isn't the bar — "I understand why it works, and what happens if X changes" is.

Work gets sent back for revision if: there's no input validation, secrets are committed to Git, business rules are only enforced on the frontend, errors are swallowed silently, or you can't explain a design choice when asked. That's normal and part of the process — it's not a failure, it's how the work gets tightened.


# 6. Evaluation
You'll be scored across eight areas each milestone: problem solving, code quality, architecture, documentation, Git usage, communication, ability to learn independently,and meeting deadlines. The trend across weeks matters more than any single score — starting rough and improving steadily is a good outcome.

# 7.	Final Presentation
Around 20-30 minutes, structured like a real engineering handover:

1.	The problem and who it's for (plain language, no jargon)
2.	Architecture overview — how the pieces talk to each other, and why
3.	Database design walkthrough (your ERD)
4.	API walkthrough — a few key endpoints, request/response, validation
5.	Live demo — full user journey as client, provider, and admin (have a backup recording in case of internet issues)
6.	Deployment overview
7.	Challenges you actually faced, and how you solved them
8.	Lessons learned — pull from your weekly journal
9.	What you'd build next
10.	Q&A — expect questions like "why this over X?" or "how would this scale?"
By the end, you should be able to talk about every part of this project like it's genuinely yours — because it is.


# Milestone 0: Planning

##  Feature specs for the MVP

#### Onboarding:
The goal of this feature is to enable users to transition smoothly into our platform. It is built to make sure users onboard seamlessly without confusion.

User story: "As a user, I want to onboard seamlessly into the platform. I don't want the platform to be too complicated. I want to understand the platform in the first few minutes."

This feature must allow first-time users to grasp the flow of the platform fast. It should be comprehensive and give users a general understanding of the product.

#### Service Listings:
The goal of this feature is to make listings uploaded by the informal workers visible. It is built to give informal workers the core goal from the beginning, what they really want - VISIBILITY.

User story: "As a client, I can easily see all the provided listings offered by barbers using the platform. I can compare prices and choose which barber matches my budget."

This feature must enable clients to discover services as fast as possible.

#### Status Flow of Booking Request:
The goal of this feature is to enable users of SkillLink to verify the status of their requests FAST. It is built to reduce confusion as to where their business transaction stands.

User story: "The status flow feature allows me to understand where my transaction really stands. As a result of this, I am rest assured that my transaction will be taken care of."

This feature must show the user (CLIENT/WORKER) the status of his/her transaction at every given time.

#### Role Authentication:
The goal of this feature is to ensure secure access control and proper user permissions. It is built to differentiate between clients, providers, and admins, giving each role access to only relevant features.

User story: "As a client, I only want to see features relevant to me like browsing and booking. As a provider, I need to manage my listings and bookings. As an admin, I need oversight to moderate the platform."

This feature must implement JWT-based authentication with role-based middleware protecting routes and ensuring users can only access features appropriate to their role.

#### Admin Dashboard
The goal of this feature is to give administrators moderation and oversight capabilities. It is built to maintain platform quality by reviewing listings, managing users, and monitoring activity.

User story: "As an admin, I want to approve new provider listings before they go live to prevent spam. I also want to see platform statistics like total users and bookings so I can monitor platform health."

This feature must provide admins with tools to approve/reject listings, remove inappropriate content, suspend users, and view basic platform statistics.

#### Mock Payment Flow:
The goal of this feature is to simulate the complete payment experience without processing real money. It is built to demonstrate the full transaction journey for demos and stakeholder presentations.

User story: "As a client, I want to see how payment fits into the booking process. As a demo viewer, I want to understand the complete user journey including payment."

This feature must add a payment step to the booking flow with a realistic UI (card fields, success/failure states) that simulates payment processing using mock data.

### Out of Scope: What will NOT be built 
- Real Payment processing
- Real Time chat
- Multi Language Support

### Success metrics of these features:
- All features working end to end
- Clean codebase and commit history
- Comprehensive README for running project from scratch
- Deployed live version
- Test coverage on critical parts
- Complete API documentation

### Project Brief (In My Own words)

#### Project Overview: What and why:
SkillLink is a local services marketplace where informal workers come together to meet clients and do business. We are building SkillLink to bridge the gap between informal workers and clients. The gap has been too big for way too long and we want to close that. Approximately 93 percent of Nigeria's workforce is engaged in the informal economy. We at SkillLink want to give informal workers what they really need, VISIBILITY.

#### Project goals and success metrics:
The goal is to build a fully functional MVP that works end-to-end. Maintain a clean codebase and commit history, a README which is comprehensible enough for anyone to run the project from scratch. Keep a clean UI that is not ambiguous. Build all the MVP features in the feature list.

#### Target Audience:
The target audience for SkillLink is young adults below the age of 35 who actively participate in the informal economy: tailors, hairdressers, barbers, caterers, phone repair technicians, and small-scale traders.


## Database Entities
Wrote out a list of Database entities with their attributes

### 1. User
Represents every person interacting with the platform 

| Attribute       | Purpose                   |
| :--------------- | :------------------------- |
| user_id         | Primary Key               |
| first_name      | User's first name         |
| last_name       | User's last name          |
| email           | Login email               |
| password_hash   | Encrypted password        |
| phone_number    | Contact                   |
| role            | Client / Provider / Admin |
| profile_picture | Avatar                    |
| bio             | About the provider        |
| location        | City/State                |
| is_verified     | Provider verification     |
| created_at      | Account creation          |
| updated_at      | Last update               |

### 2. Service
The service being offered

| Attribute      | Purpose          |
| :------------- | :--------------- |
| service_id     | Primary Key      |
| provider_id    | Owner of service |
| category_id    | Category         |
| title          | Service title    |
| description    | Details          |
| price          | Cost             |
| pricing_type   | Fixed / Hourly   |
| availability   | Available?       |
| average_rating | Cached rating    |
| created_at     | Creation         |
| updated_at     | Last update      |

### 3. Category
Keeps service organized

| Attribute   | Purpose              |
| :---------- | :------------------- |
| category_id | Primary Key          |
| name        | Category name        |
| description | Category description |

### 4. Booking
Needed whenever a client books a service

| Attribute      | Purpose                                    |
| :------------- | :----------------------------------------- |
| booking_id     | Primary Key                                |
| client_id      | User booking                               |
| service_id     | Service booked                             |
| booking_date   | Date requested                             |
| scheduled_time | Time                                       |
| status         | Pending / Accepted / Completed / Cancelled |
| total_price    | Amount                                     |
| notes          | Client instructions                        |
| created_at     | Booking created                            |

### 5. Payment
Handles mocked payments

| Attribute             | Purpose                 |
| :-------------------- | :---------------------- |
| payment_id            | Primary Key             |
| booking_id            | Booking                 |
| amount                | Paid amount             |
| payment_method        | Card / Transfer         |
| payment_status        | Pending / Paid / Failed |
| transaction_reference | Fake reference          |
| paid_at               | Payment date            |


# Milestone 1: Database and API Skeleton

For this Milestone we are working on the Finalized ERD, Prisma Schema, scaffolded Express project, and do a deployed health check

## Finalized ERD (MVP)
![Finalized ERD (MVP](Pictures-Diagrams/Finalized-ERD-(MVP).png)

## Finalized ERD (For the Future)
![Finalized-ERD-(For-the-Future)](Pictures-Diagrams/Finalized-ERD-(For-the-Future).png)

## Database and API Skeleton (What I completed):

- [x] Finalized ERD
- [x] PostgreSQL configuration
- [x] Prisma configuration
- [x] Prisma schema
- [x] Database migration
- [x] Prisma Studio verification
- [x] Express + TypeScript scaffold
- [x] API health check
- [x] Local API testing
- [x] Render deployment
- [x] Live health check

### To test Run Skill Link and view it live on your end use this link
[Milestone1_Guide](Guide/Milestone1_Guide.md)

# Milestone 2: Auth, Authentication & Roles 
Here I focused on implementing user authentication and role-based authentication 

- [x] User registration
- [x] Password hashing with bcrypt
- [x] User login
- [x] JWT authentication
- [x] Protected routes
- [x] Role-based middleware
- [x] Authentication and authorization error handling
- [x] API testing with Postman

### To test Run Skill Link and view it live on your end use this link
[Milestone2_Guide](Guide/Milestone2_Guide.md)


# Milestone 3: Listings and Booking Flow

- [x] Service listing CRUD
- [x] Search and filtering 
- [x] Client booking creation 
- [x] Provider booking management 
- [x] Cliengt booking management 
- [x] Bookng status workflow
- [x] Role-based booking authorization 
- [x] Postman API testing

### To test Run Skill Link and view it live on your end use this link
[Milestone3_Guide](Guide/Milestone3_Guide.md)


# Milestone 4: Reviews & Admin

This milestone was traded off so as to build on what we already have and not anything new

# Milestone 5: Testing & Error handling

- [x] Automated API test suite
- [x] Centralized errror handling
- [x] Structured logging
- [x] Tests for authentication, protected routes, services, bookings and error responses.

### To test Run skill Link and view it live on your end use this link
[Milestone5_Guide](Guide/Milestone5_Guide.md)