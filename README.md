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
