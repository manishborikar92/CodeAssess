# Phase 0 — Foundation & Infrastructure Setup

> **Priority:** 🔴 Critical — Must be completed before any other phase.
> **Estimated Time:** 3–5 days
> **Prerequisites:** Node.js 18+, Docker Desktop, Git

---

## Objectives

- Set up the monorepo structure with the NestJS backend alongside the existing Next.js frontend.
- Install and configure PostgreSQL and Redis (local Docker containers for development).
- Create the Prisma ORM with the initial database schema.
- Validate that all services start cleanly before writing any business logic.

---

## Step-by-Step Guide

### Step 0.1 — Initialize the NestJS Backend

> Creates the `apps/api` directory with a production-grade NestJS scaffold.

```bash
# From the project root (c:\Users\manis\Projects\CodeAssess)
npx -y @nestjs/cli new apps/api --skip-git --package-manager npm --language TypeScript --strict
```

After scaffolding:

```bash
cd apps/api
```

**Install core dependencies:**

```bash
npm install @nestjs/platform-fastify @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt ioredis @nestjs/swagger zod zod-validation-error bullmq @nestjs/websockets socket.io @socket.io/redis-adapter
```

```bash
npm install -D @types/passport-jwt prisma
```

**Install Prisma Client:**

```bash
npm install @prisma/client
```

**Initialize Prisma:**

```bash
npx prisma init --datasource-provider postgresql
```

- [ ] **Checkpoint:** `apps/api/` exists with `src/`, `prisma/schema.prisma`, `package.json`, `tsconfig.json`.

---

### Step 0.2 — Local Docker Services (PostgreSQL + Redis)

> Create a `docker-compose.yml` at the project root for development services.

Create `docker-compose.yml` at `c:\Users\manis\Projects\CodeAssess\docker-compose.yml`:

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: codeassess-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: codeassess
      POSTGRES_PASSWORD: codeassess_dev_2026
      POSTGRES_DB: codeassess
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U codeassess"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: codeassess-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 50mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

```bash
# Start services (from project root)
docker compose up -d

# Verify both are running
docker compose ps
```

- [ ] **Checkpoint:** `docker compose ps` shows both `codeassess-db` and `codeassess-redis` as `healthy`.

---

### Step 0.3 — Configure Environment Variables

Create `apps/api/.env`:

```env
# ─── App ──────────────────────────────
NODE_ENV=development
PORT=4000

# ─── Database ─────────────────────────
DATABASE_URL=postgresql://codeassess:codeassess_dev_2026@localhost:5432/codeassess?schema=public

# ─── Redis ────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── JWT ──────────────────────────────
JWT_SECRET=dev-only-replace-in-production-minimum-32-chars!!!
JWT_ACCESS_TTL=900
JWT_REFRESH_TTL=604800

# ─── CORS ─────────────────────────────
CORS_ORIGINS=http://localhost:3000
```

Create `apps/api/.env.example` (same content, but with placeholder values — commit this to Git).

Add to `apps/api/.gitignore`:

```
.env
.env.local
```

- [ ] **Checkpoint:** `.env` file exists, `.env.example` exists, `.env` is gitignored.

---

### Step 0.4 — Prisma Schema (Full Database Schema)

Replace the contents of `apps/api/prisma/schema.prisma` with the full schema from `docs/SCALING.md` Section 5, translated to Prisma DSL:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ──────────────────────────────────────────────────

enum UserRole {
  admin
  examiner
  candidate
}

enum ExamStatus {
  draft
  published
  active
  closed
  archived
}

enum SessionStatus {
  pending
  active
  finished
  timed_out
  disqualified
}

enum QuestionDifficulty {
  easy
  medium
  hard
}

enum QuestionVisibility {
  public
  private
  exam_only
}

enum SubmissionVerdict {
  AC
  WA
  TLE
  RE
  CE
  PENDING
}

enum InvitationStatus {
  pending
  accepted
  expired
  revoked
}

enum FocusEventType {
  blur
  focus
  tab_switch
  fullscreen_exit
  paste_attempt
}

// ─── Models ─────────────────────────────────────────────────

model User {
  id            String    @id @default(uuid()) @db.Uuid
  email         String    @unique @db.VarChar(255)
  name          String    @db.VarChar(255)
  passwordHash  String?   @map("password_hash")
  avatarUrl     String?   @map("avatar_url")
  role          UserRole  @default(candidate)
  isVerified    Boolean   @default(false) @map("is_verified")
  lastLoginAt   DateTime? @map("last_login_at") @db.Timestamptz()
  deletedAt     DateTime? @map("deleted_at") @db.Timestamptz()
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz()

  questions     Question[]
  exams         Exam[]
  sessions      ExamSession[]
  submissions   Submission[]
  auditLogs     AuditLog[]

  @@index([email])
  @@index([role])
  @@map("users")
}

model Question {
  id            String               @id @default(uuid()) @db.Uuid
  authorId      String?              @map("author_id") @db.Uuid
  title         String               @db.VarChar(255)
  slug          String               @unique @db.VarChar(255)
  topic         String               @db.VarChar(100)
  difficulty    QuestionDifficulty
  visibility    QuestionVisibility   @default(public)
  maxScore      Int                  @default(100) @map("max_score")
  timeLimitMs   Int                  @default(8000) @map("time_limit_ms")
  memoryLimitMb Int                  @default(256) @map("memory_limit_mb")

  scenario      String?              @db.Text
  statement     String               @db.Text
  constraints   Json                 @default("[]")
  inputFormat   String               @map("input_format") @db.Text
  outputFormat  String               @map("output_format") @db.Text
  hint          String?              @db.Text
  editorial     String?              @db.Text

  sampleCases   Json                 @default("[]") @map("sample_cases")
  hiddenCases   Json                 @default("[]") @map("hidden_cases")
  starterCode   Json                 @default("{}") @map("starter_code")

  solveCount    Int                  @default(0) @map("solve_count")
  attemptCount  Int                  @default(0) @map("attempt_count")
  tags          String[]             @default([])

  deletedAt     DateTime?            @map("deleted_at") @db.Timestamptz()
  createdAt     DateTime             @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt     DateTime             @updatedAt @map("updated_at") @db.Timestamptz()

  author        User?                @relation(fields: [authorId], references: [id], onDelete: SetNull)
  examQuestions ExamQuestion[]
  submissions   Submission[]
  codeDrafts    CodeDraft[]

  @@index([authorId])
  @@index([difficulty])
  @@index([visibility])
  @@index([slug])
  @@map("questions")
}

model Exam {
  id                 String     @id @default(uuid()) @db.Uuid
  creatorId          String     @map("creator_id") @db.Uuid
  title              String     @db.VarChar(255)
  description        String?    @db.Text
  status             ExamStatus @default(draft)

  durationMinutes    Int        @map("duration_minutes")
  startWindow        DateTime?  @map("start_window") @db.Timestamptz()
  endWindow          DateTime?  @map("end_window") @db.Timestamptz()
  lateJoinMinutes    Int        @default(0) @map("late_join_minutes")

  shuffleQuestions   Boolean    @default(false) @map("shuffle_questions")
  shuffleTestCases   Boolean    @default(false) @map("shuffle_test_cases")
  showScores         Boolean    @default(true) @map("show_scores")
  showLeaderboard    Boolean    @default(false) @map("show_leaderboard")
  allowPracticeAfter Boolean    @default(true) @map("allow_practice_after")
  passcode           String?    @db.VarChar(50)

  requireFullscreen  Boolean    @default(true) @map("require_fullscreen")
  detectTabSwitch    Boolean    @default(true) @map("detect_tab_switch")
  disableCopyPaste   Boolean    @default(false) @map("disable_copy_paste")

  allowedLanguages   String[]   @default(["python"]) @map("allowed_languages")

  deletedAt          DateTime?  @map("deleted_at") @db.Timestamptz()
  createdAt          DateTime   @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt          DateTime   @updatedAt @map("updated_at") @db.Timestamptz()

  creator            User       @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  examQuestions      ExamQuestion[]
  invitations        ExamInvitation[]
  sessions           ExamSession[]

  @@index([creatorId])
  @@index([status])
  @@map("exams")
}

model ExamQuestion {
  examId     String  @map("exam_id") @db.Uuid
  questionId String  @map("question_id") @db.Uuid
  sortOrder  Int     @default(0) @map("sort_order")
  section    String? @db.VarChar(10)
  maxScore   Int?    @map("max_score")

  exam       Exam     @relation(fields: [examId], references: [id], onDelete: Cascade)
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@id([examId, questionId])
  @@index([examId, sortOrder])
  @@map("exam_questions")
}

model ExamInvitation {
  id         String           @id @default(uuid()) @db.Uuid
  examId     String           @map("exam_id") @db.Uuid
  email      String           @db.VarChar(255)
  token      String           @unique @db.VarChar(64)
  status     InvitationStatus @default(pending)
  invitedAt  DateTime         @default(now()) @map("invited_at") @db.Timestamptz()
  acceptedAt DateTime?        @map("accepted_at") @db.Timestamptz()
  expiresAt  DateTime?        @map("expires_at") @db.Timestamptz()

  exam       Exam             @relation(fields: [examId], references: [id], onDelete: Cascade)

  @@unique([examId, email])
  @@index([token])
  @@index([email])
  @@map("exam_invitations")
}

model ExamSession {
  id                    String        @id @default(uuid()) @db.Uuid
  examId                String        @map("exam_id") @db.Uuid
  candidateId           String        @map("candidate_id") @db.Uuid
  status                SessionStatus @default(pending)

  startedAt             DateTime?     @map("started_at") @db.Timestamptz()
  finishedAt            DateTime?     @map("finished_at") @db.Timestamptz()
  durationUsed          Int?          @map("duration_used")

  tabSwitchCount        Int           @default(0) @map("tab_switch_count")
  fullscreenExitCount   Int           @default(0) @map("fullscreen_exit_count")
  pasteAttemptCount     Int           @default(0) @map("paste_attempt_count")
  ipAddress             String?       @map("ip_address")
  userAgent             String?       @map("user_agent") @db.Text

  totalScore            Int           @default(0) @map("total_score")
  rank                  Int?

  createdAt             DateTime      @default(now()) @map("created_at") @db.Timestamptz()

  exam                  Exam          @relation(fields: [examId], references: [id], onDelete: Cascade)
  candidate             User          @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  submissions           Submission[]
  focusEvents           FocusEvent[]
  codeDrafts            CodeDraft[]

  @@unique([examId, candidateId])
  @@index([examId])
  @@index([candidateId])
  @@index([status])
  @@map("exam_sessions")
}

model FocusEvent {
  id         BigInt         @id @default(autoincrement())
  sessionId  String         @map("session_id") @db.Uuid
  eventType  FocusEventType @map("event_type")
  occurredAt DateTime       @default(now()) @map("occurred_at") @db.Timestamptz()
  metadata   Json?

  session    ExamSession    @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([sessionId, eventType])
  @@map("focus_events")
}

model Submission {
  id              String            @id @default(uuid()) @db.Uuid
  sessionId       String?           @map("session_id") @db.Uuid
  questionId      String            @map("question_id") @db.Uuid
  candidateId     String            @map("candidate_id") @db.Uuid

  code            String            @db.Text
  language        String            @default("python") @db.VarChar(20)

  verdict         SubmissionVerdict @default(PENDING)
  score           Int               @default(0)
  passed          Int               @default(0)
  total           Int               @default(0)
  maxExecutionMs  Int?              @map("max_execution_ms")
  maxMemoryKb     Int?              @map("max_memory_kb")
  testResults     Json?             @map("test_results")

  isPractice      Boolean           @default(false) @map("is_practice")
  submittedAt     DateTime          @default(now()) @map("submitted_at") @db.Timestamptz()

  session         ExamSession?      @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  question        Question          @relation(fields: [questionId], references: [id], onDelete: Cascade)
  candidate       User              @relation(fields: [candidateId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([questionId])
  @@index([candidateId])
  @@index([verdict])
  @@map("submissions")
}

model CodeDraft {
  sessionId  String   @map("session_id") @db.Uuid
  questionId String   @map("question_id") @db.Uuid
  code       String   @db.Text
  language   String   @default("python") @db.VarChar(20)
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamptz()

  session    ExamSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  question   Question    @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@id([sessionId, questionId])
  @@map("code_drafts")
}

model AuditLog {
  id           BigInt   @id @default(autoincrement())
  userId       String?  @map("user_id") @db.Uuid
  action       String   @db.VarChar(100)
  resourceType String?  @map("resource_type") @db.VarChar(50)
  resourceId   String?  @map("resource_id") @db.Uuid
  metadata     Json?
  ipAddress    String?  @map("ip_address")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz()

  user         User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_log")
}
```

**Run the initial migration:**

```bash
cd apps/api
npx prisma migrate dev --name init
```

- [ ] **Checkpoint:** Migration created, Prisma Client generated, tables exist in PostgreSQL. Verify with:

```bash
npx prisma studio
# Opens browser UI showing all tables
```

---

### Step 0.5 — NestJS Bootstrap with Fastify

Replace `apps/api/src/main.ts` with the production-grade bootstrap from `docs/SCALING.md` Section 6.2.

Key configuration:
- Fastify adapter (not Express)
- Global exception filter
- Global validation pipe (Zod)
- Global response transform interceptor
- API prefix: `/api/v1`
- Swagger (dev only)
- CORS for `http://localhost:3000`
- Graceful shutdown hooks

- [ ] **Checkpoint:** `npm run start:dev` starts the NestJS server on port 4000, and `GET http://localhost:4000/api/v1` responds.

---

### Step 0.6 — Prisma & Redis Service Modules

Create global modules for Prisma and Redis that can be imported by any feature module:

1. **`src/database/prisma.service.ts`** — Singleton PrismaClient with `onModuleInit` and `onModuleDestroy` lifecycle hooks.
2. **`src/database/prisma.module.ts`** — Global module so every feature module has access.
3. **`src/redis/redis.service.ts`** — `ioredis` client wrapper with connection lifecycle.
4. **`src/redis/redis.module.ts`** — Global module.

- [ ] **Checkpoint:** Import both modules in `AppModule`. Server starts without errors. `GET /api/v1/health/ready` returns `{ status: 'ready', db: 'up', cache: 'up' }`.

---

### Step 0.7 — Health Check Module

Create the health check endpoints as documented in `docs/SCALING.md` Section 6.2:

- `GET /api/v1/health` → Liveness (always returns `{ status: 'ok' }`)
- `GET /api/v1/health/ready` → Readiness (pings PostgreSQL and Redis)

- [ ] **Checkpoint:** Both endpoints respond correctly. Use `curl` or Postman to verify.

---

### Step 0.8 — Configuration Validation (Zod)

Create `src/config/config.validation.ts` with the Zod schema from `docs/SCALING.md` Section 6.4.

Wire it into `@nestjs/config` so that if any required env var is missing, the server **fails to start** with a descriptive error.

- [ ] **Checkpoint:** Temporarily remove `DATABASE_URL` from `.env` → server refuses to start with a clear Zod error. Restore it → server starts normally.

---

### Step 0.9 — Common Infrastructure (Guards, Filters, Interceptors, Pipes)

Create the `src/common/` directory with all cross-cutting concerns:

| File | Purpose |
|------|---------|
| `filters/http-exception.filter.ts` | Uniform `{ success: false, error: { code, message, details } }` shape |
| `interceptors/response-transform.interceptor.ts` | Wraps all responses in `{ success: true, data, meta }` |
| `interceptors/logging.interceptor.ts` | Logs request method, URL, duration |
| `pipes/zod-validation.pipe.ts` | Validates incoming DTOs with Zod schemas |
| `middleware/request-id.middleware.ts` | Injects `X-Request-ID` header |
| `decorators/current-user.decorator.ts` | `@CurrentUser()` param decorator |
| `decorators/roles.decorator.ts` | `@Roles('examiner')` metadata decorator |
| `guards/jwt-auth.guard.ts` | Stub (full implementation in Phase 1) |
| `guards/roles.guard.ts` | Stub (full implementation in Phase 1) |

- [ ] **Checkpoint:** Server starts with all globals registered. A `GET /api/v1/health` response is wrapped in the standard envelope: `{ "success": true, "data": { "status": "ok", ... } }`.

---

### Step 0.10 — Seed Script

Create `apps/api/prisma/seed.ts` that migrates the existing 37 questions from `web/src/data/questions.json` into PostgreSQL:

- Reads the JSON file
- Maps fields to the Prisma `Question` model
- Generates slugs from titles
- Sets `visibility: 'public'`
- Inserts using `prisma.question.createMany()`

Add to `apps/api/package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Run:

```bash
npx prisma db seed
```

- [ ] **Checkpoint:** `npx prisma studio` → Questions table shows 37 rows. All fields populated correctly.

---

## Phase 0 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 0.1 | NestJS project scaffolded at `apps/api/` | ⬜ |
| 0.2 | PostgreSQL + Redis running via Docker Compose | ⬜ |
| 0.3 | `.env` + `.env.example` configured | ⬜ |
| 0.4 | Prisma schema with all 12 models, initial migration applied | ⬜ |
| 0.5 | NestJS bootstrapped with Fastify adapter | ⬜ |
| 0.6 | Prisma + Redis global modules created | ⬜ |
| 0.7 | Health check endpoints responding | ⬜ |
| 0.8 | Config validation with Zod (fail-fast) | ⬜ |
| 0.9 | Common infrastructure (filters, interceptors, pipes, decorators) | ⬜ |
| 0.10 | Seed script imports 37 questions into PostgreSQL | ⬜ |

**✅ Phase 0 is complete when:** `npm run start:dev` starts NestJS on port 4000, health endpoints pass, and 37 questions are seeded in PostgreSQL.

---

**Next → [Phase 1: Authentication & User Management](PHASE-1-AUTH.md)**
