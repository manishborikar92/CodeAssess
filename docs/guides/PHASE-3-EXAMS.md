# Phase 3 — Exam Management & Invitations

> **Priority:** 🟠 High — Core platform functionality for multi-tenant assessments.
> **Estimated Time:** 3–4 weeks
> **Prerequisites:** Phase 2 complete (questions API working, examiner dashboard built)

---

## Objectives

- Build exam CRUD API with full configuration options.
- Build the invitation system (email + unique tokens).
- Build the exam creation wizard for examiners.
- Build the exam join flow (token → auth → lobby → start).
- Implement exam session lifecycle (pending → active → finished/timed_out).
- Implement auto-save code drafts.

---

## Step-by-Step Guide

### Step 3.1 — Exams DTOs

Create `server/src/modules/exams/dto/`:

| File | Fields |
|------|--------|
| `create-exam.dto.ts` | title, description, durationMinutes, startWindow, endWindow, lateJoinMinutes, shuffleQuestions, shuffleTestCases, showScores, showLeaderboard, allowPracticeAfter, passcode, requireFullscreen, detectTabSwitch, disableCopyPaste, allowedLanguages, questionIds (array of UUID + sortOrder) |
| `update-exam.dto.ts` | Partial of create (only if exam is `draft` status) |
| `exam-response.dto.ts` | Full exam details (with question count, invitation count for examiner) |

- [ ] **Checkpoint:** All exam DTOs created with Zod schemas.

---

### Step 3.2 — Exams Service

Create `server/src/modules/exams/exams.service.ts`:

| Method | Responsibility |
|--------|---------------|
| `create(dto, creatorId)` | Create exam + exam_questions junction rows |
| `findAll(userId, role)` | Examiner: own exams. Candidate: invited exams. Admin: all exams. |
| `findOne(id)` | Get exam with questions (ordered by sortOrder) |
| `update(id, dto, userId)` | Only if status is `draft` and user is creator/admin |
| `softDelete(id, userId)` | Only creator/admin |
| `publish(id, userId)` | Transition draft → published (locks questions) |
| `close(id, userId)` | Transition active → closed (manually end exam) |
| `getLeaderboard(id)` | Ranked sessions by totalScore (from ExamSession) |
| `getAnalytics(id)` | Score distribution, avg time, per-question stats |

**Exam status transitions:**

```
draft → published → active → closed → archived
         │                     ▲
         └─────────────────────┘ (auto-activate when startWindow reached)
```

- [ ] **Checkpoint:** Exam service methods work. Unit tests cover creation, status transitions, and access control.

---

### Step 3.3 — Exams Controller

Create `server/src/modules/exams/exams.controller.ts`:

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/exams` | GET | JWT | Any | List own exams (examiner) / invited exams (candidate) |
| `/exams` | POST | JWT | Examiner+ | Create exam with questions |
| `/exams/:id` | GET | JWT | Creator/Invited/Admin | Get exam details |
| `/exams/:id` | PATCH | JWT | Creator/Admin | Update (draft only) |
| `/exams/:id` | DELETE | JWT | Creator/Admin | Soft delete |
| `/exams/:id/publish` | POST | JWT | Creator/Admin | Publish exam |
| `/exams/:id/close` | POST | JWT | Creator/Admin | Close exam |
| `/exams/:id/leaderboard` | GET | JWT | Creator/Invited/Admin | Get ranked results |
| `/exams/:id/analytics` | GET | JWT | Creator/Admin | Get statistics |

- [ ] **Checkpoint:** All exam endpoints functional. Status transitions enforced.

---

### Step 3.4 — Invitations Module

Create `server/src/modules/invitations/`:

| Method / Endpoint | Responsibility |
|-------------------|---------------|
| `POST /exams/:id/invite` | Accept array of emails, generate unique tokens, create invitation rows |
| `GET /exams/:id/invitations` | List all invitations for an exam with statuses |
| `DELETE /exams/:id/invitations/:invId` | Revoke an invitation |

**Token generation:**

```typescript
import { randomBytes } from 'crypto';

function generateInviteToken(): string {
  return randomBytes(32).toString('hex'); // 64 chars
}
```

**Email dispatch (stub for now):**
- Create an `EmailService` with a `sendInvitation(email, examTitle, joinUrl)` method.
- For MVP, log to console. In production, integrate with Resend or AWS SES (Phase 6).

**Invitation URL format:** `https://codeassess.io/join/{token}`

- [ ] **Checkpoint:** Invitations created with unique tokens. Invitation list returned with statuses.

---

### Step 3.5 — Sessions Module

Create `server/src/modules/sessions/`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/sessions/join/:token` | POST | JWT (candidate) | Validate token, verify invite, create session (pending) |
| `/sessions/:id/start` | POST | JWT (candidate) | Set status=active, record startedAt |
| `/sessions/:id/finish` | POST | JWT (candidate) | Set status=finished, record finishedAt, compute durationUsed |
| `/sessions/:id` | GET | JWT | Get session details + question progress |
| `/sessions/:id/results` | GET | JWT | Detailed results (only post-exam) |

**Session lifecycle:**

```
Token validated → pending → start clicked → active → timer expires OR candidate ends → finished
                                                                                     → timed_out (auto)
```

**Auto-expire logic:**
- A BullMQ delayed job is created when a session starts
- Delay = exam.durationMinutes * 60 * 1000
- When the job fires, it sets the session to `timed_out` if still `active`

- [ ] **Checkpoint:** Full session lifecycle works. Sessions auto-expire.

---

### Step 3.6 — Code Drafts Module

Create `server/src/modules/drafts/`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `PUT /drafts/:sessionId/:questionId` | JWT (candidate) | Upsert code draft |
| `GET /drafts/:sessionId/:questionId` | JWT (candidate) | Retrieve saved draft |

**Key behavior:**
- Drafts are upserted (insert or update on conflict) using Prisma's `upsert`
- Client auto-saves every 30 seconds (debounced)
- Only the session owner can read/write their drafts

- [ ] **Checkpoint:** Drafts save and restore correctly. Only session owner can access.

---

### Step 3.7 — Exam Tests

**Unit tests:**

| Test | Assertion |
|------|-----------|
| Create exam with questions | Exam + junction rows created |
| Publish exam | Status transitions correctly |
| Update published exam | Rejected (403) |
| Close exam | Status transitions correctly |
| Invite candidates | Invitations created with tokens |
| Join with valid token | Session created (pending) |
| Join with expired token | Rejected (400) |
| Start session | Status becomes active, startedAt set |
| Auto-expire session | Status becomes timed_out after duration |

**E2E tests:**

| Test | Flow |
|------|------|
| Examiner creates exam → publishes → invites → candidate joins → starts → finishes | Full lifecycle |
| Candidate joins with wrong token → 400 | Token validation |
| Candidate tries to start already-started session → 400 | State machine |

- [ ] **Checkpoint:** All exam/session tests pass.

---

### Step 3.8 — Examiner UI: Create Exam Wizard

Create `web/src/app/(examiner)/exams/new/page.js`:

Multi-step wizard:

| Step | Content |
|------|---------|
| 1. Basic Info | Title, description, duration, start/end window |
| 2. Questions | Select from question bank (search, filter), set order and optional score overrides |
| 3. Configuration | Proctoring settings, scoring options, allowed languages |
| 4. Access Control | Invite by email (bulk), optional passcode |
| 5. Review & Create | Summary of all settings, create button |

**Design:**
- Step indicator (progress bar)
- Previous/Next navigation
- Form state preserved between steps (Zustand store or local state)
- Validation per step before advancing

- [ ] **Checkpoint:** Examiner can create exams through the wizard, selecting questions and configuring all options.

---

### Step 3.9 — Examiner UI: Exam List & Overview

Create:

| Route | Page | Features |
|-------|------|----------|
| `/exams` | Exam list | Status badges (draft/published/active/closed), candidate count, create button |
| `/exams/[id]` | Exam overview | Full details, question list, invitation management, publish/close buttons |

- [ ] **Checkpoint:** Examiner sees all their exams with status. Overview page shows full details.

---

### Step 3.10 — Candidate UI: Exam Join Flow

Create `web/src/app/join/[token]/page.js`:

**Join flow:**

```
1. Click invite link → /join/{token}
2. If not authenticated → redirect to /login, then back to /join/{token}
3. Validate token → show exam details (title, duration, rules)
4. Enter passcode (if required)
5. System check (browser compatibility, fullscreen capability)
6. "Start Exam" button → POST /sessions/:id/start
7. Redirect to /exam/[sessionId]
```

**Lobby page design:**
- Exam title and description
- Duration display
- Rules list (derived from proctoring config)
- System check results (green checkmarks)
- Countdown to exam start (if startWindow hasn't started yet)
- "Start Exam" button (disabled until all checks pass)

- [ ] **Checkpoint:** Candidates can join exams via invitation link, see the lobby, and start the exam.

---

### Step 3.11 — Exam IDE Updates (Session-Aware)

Update the existing exam IDE at `web/src/app/exam/[sessionId]/page.jsx`:

1. Fetch session data from API (`GET /sessions/:id`)
2. Fetch exam questions from API (ordered by sortOrder)
3. Load code drafts from API on mount
4. Auto-save drafts every 30 seconds to API
5. Timer synced with server-side startedAt + durationMinutes
6. "Submit" sends to API (not just Pyodide)
7. "End Exam" calls `POST /sessions/:id/finish`

**Important:** Keep Pyodide for "Run Samples" (instant feedback). Server-side judge for "Submit" (scored).

- [ ] **Checkpoint:** Exam IDE works with server-side sessions. Drafts auto-save. Timer is server-synced.

---

### Step 3.12 — Candidate: Post-Exam Results

Create `web/src/app/(candidate)/results/[sessionId]/page.js`:

- Fetch session results from API (`GET /sessions/:id/results`)
- Show total score, rank, per-question breakdown
- Show verdict per question (AC/WA/TLE/RE)
- Show time spent per question
- Reuse existing `ResultsScreen` component (adapted for API data)

- [ ] **Checkpoint:** Post-exam results page renders correctly with API data.

---

## Phase 3 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 3.1 | Exam DTOs | ⬜ |
| 3.2 | Exams service (CRUD + status transitions) | ⬜ |
| 3.3 | Exams controller | ⬜ |
| 3.4 | Invitations module (create, list, revoke) | ⬜ |
| 3.5 | Sessions module (join, start, finish, auto-expire) | ⬜ |
| 3.6 | Code drafts module (auto-save + retrieve) | ⬜ |
| 3.7 | Exam unit + E2E tests | ⬜ |
| 3.8 | Examiner UI: Create exam wizard | ⬜ |
| 3.9 | Examiner UI: Exam list + overview | ⬜ |
| 3.10 | Candidate UI: Exam join flow + lobby | ⬜ |
| 3.11 | Exam IDE updated for server sessions | ⬜ |
| 3.12 | Post-exam results page | ⬜ |

**✅ Phase 3 is complete when:** Examiners can create exams, invite candidates, and monitor status. Candidates can join via invite link, take the exam with auto-saved drafts, and view results.

---

**Previous ← [Phase 2: Question Bank](PHASE-2-QUESTIONS.md)**
**Next → [Phase 4: Remote Judge Engine](PHASE-4-JUDGE.md)**
