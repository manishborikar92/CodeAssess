# Phase 2 — Question Bank & API Layer

> **Priority:** 🟠 High — Enables the transition from static JSON to database-driven questions.
> **Estimated Time:** 2–3 weeks
> **Prerequisites:** Phase 1 complete (auth working, users can sign up/login)

---

## Objectives

- Build the Questions CRUD API in NestJS with proper authorization.
- Build the examiner question management dashboard.
- Build the candidate public question browser.
- Implement practice mode (no timer, unlimited attempts, server-side judging).
- Replace `lib/api.js` with a structured API client pointing to NestJS.

---

## Step-by-Step Guide

### Step 2.1 — Questions DTOs

Create `server/src/modules/questions/dto/`:

| File | Purpose |
|------|---------|
| `create-question.dto.ts` | Zod schema: title, topic, difficulty, visibility, statement, constraints, inputFormat, outputFormat, sampleCases, hiddenCases, starterCode, hint, editorial, maxScore, timeLimitMs, memoryLimitMb, tags |
| `update-question.dto.ts` | Partial version of create DTO (all fields optional) |
| `question-response.dto.ts` | **Critical:** NEVER includes `hiddenCases`. Explicit field allowlist. |
| `question-filters.dto.ts` | Query params: page, perPage, difficulty, visibility, topic, tags, search (fuzzy title) |

**Security rule for `question-response.dto.ts`:**

```typescript
// ALWAYS use explicit field selection — never spread the entity
export function toQuestionResponse(question: any, showHidden: boolean = false) {
  return {
    id: question.id,
    title: question.title,
    slug: question.slug,
    topic: question.topic,
    difficulty: question.difficulty,
    visibility: question.visibility,
    maxScore: question.maxScore,
    timeLimitMs: question.timeLimitMs,
    memoryLimitMb: question.memoryLimitMb,
    scenario: question.scenario,
    statement: question.statement,
    constraints: question.constraints,
    inputFormat: question.inputFormat,
    outputFormat: question.outputFormat,
    hint: question.hint,
    editorial: question.editorial,
    sampleCases: question.sampleCases,
    starterCode: question.starterCode,
    solveCount: question.solveCount,
    attemptCount: question.attemptCount,
    tags: question.tags,
    createdAt: question.createdAt,
    // NEVER include hiddenCases for candidate-facing responses
    ...(showHidden ? { hiddenCases: question.hiddenCases } : {}),
  };
}
```

- [ ] **Checkpoint:** All question DTOs created. `hiddenCases` is provably never leaked.

---

### Step 2.2 — Questions Service

Create `server/src/modules/questions/questions.service.ts`:

| Method | Responsibility |
|--------|---------------|
| `create(dto, authorId)` | Auto-generate slug from title, insert question |
| `findAll(filters)` | Paginated query with difficulty, topic, tag, search filters. Uses `pg_trgm` for fuzzy search. |
| `findOne(id)` | Get by ID. Return with or without hidden cases based on caller role. |
| `findBySlug(slug)` | Get by slug for URL-friendly access. |
| `update(id, dto, userId)` | Only allow author or admin to update. |
| `softDelete(id, userId)` | Sets `deleted_at`. Only allow author or admin. |

**Slug generation:**

```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
```

**Pagination response shape:**

```typescript
{
  data: Question[],
  meta: {
    page: 1,
    perPage: 20,
    total: 150,
    totalPages: 8,
  }
}
```

- [ ] **Checkpoint:** Service methods work. Unit tests cover create, findAll (with filters), findOne, update, softDelete.

---

### Step 2.3 — Questions Controller

Create `server/src/modules/questions/questions.controller.ts`:

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/v1/questions` | GET | JWT | Any | List questions (paginated, filtered). `hiddenCases` stripped for candidates. |
| `/api/v1/questions` | POST | JWT | Examiner+ | Create question |
| `/api/v1/questions/:id` | GET | JWT | Any | Get question by ID. `hiddenCases` stripped for candidates. |
| `/api/v1/questions/:id` | PATCH | JWT | Author/Admin | Update question |
| `/api/v1/questions/:id` | DELETE | JWT | Author/Admin | Soft delete |

```typescript
@Get()
@UseGuards(JwtAuthGuard)
async findAll(@Query() filters: QuestionFiltersDto, @CurrentUser() user) {
  const questions = await this.questionsService.findAll(filters);
  return {
    data: questions.data.map(q => toQuestionResponse(q, user.role !== 'candidate')),
    meta: questions.meta,
  };
}
```

- [ ] **Checkpoint:** All CRUD endpoints functional. Candidates cannot see `hiddenCases`.

---

### Step 2.4 — Questions Unit & E2E Tests

**Unit tests** (`questions.service.spec.ts`):

| Test | Assertion |
|------|-----------|
| Create with valid data | Question created with auto-slug |
| Create with duplicate title | Conflict or unique slug generated |
| FindAll with no filters | Returns paginated results |
| FindAll with difficulty filter | Only matching questions |
| FindAll with search | Fuzzy matching on title |
| FindOne as examiner | Includes `hiddenCases` |
| FindOne as candidate | Excludes `hiddenCases` |
| Update by non-author | Throws ForbiddenException |
| SoftDelete | Sets `deleted_at`, not in further queries |

**E2E tests** (`test/questions.e2e-spec.ts`):

| Test | Flow |
|------|------|
| Examiner creates question → retrieves it → has hiddenCases | CRUD + authorization |
| Candidate lists questions → no hiddenCases | Security |
| Examiner updates own question | Ownership |
| Examiner updates another's question → 403 | Ownership enforcement |

- [ ] **Checkpoint:** All tests pass.

---

### Step 2.5 — API Client Library (Next.js)

Create `web/src/lib/api/`:

| File | Purpose |
|------|---------|
| `client.js` | Base fetch wrapper with auth cookies, error handling, base URL |
| `questions.js` | `getQuestions(filters)`, `getQuestion(id)`, `createQuestion(data)`, `updateQuestion(id, data)`, `deleteQuestion(id)` |
| `index.js` | Re-exports all API modules |

```javascript
// web/src/lib/api/client.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiClient(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',  // Send httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(json.error.code, json.error.message, json.error.details);
  }

  return json;
}
```

Add to `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

- [ ] **Checkpoint:** API client can fetch questions from NestJS backend. Replace usage of `lib/api.js` with new structured client.

---

### Step 2.6 — Examiner Dashboard: Question Management

Create the examiner question management pages:

| Route | Page | Features |
|-------|------|----------|
| `/questions` | `web/src/app/(examiner)/questions/page.js` | Paginated question table, search, difficulty filter, create button |
| `/questions/new` | `web/src/app/(examiner)/questions/new/page.js` | Create question form (multi-step or single page) |
| `/questions/[id]` | `web/src/app/(examiner)/questions/[id]/page.js` | View question with all details (including hidden cases for examiner) |
| `/questions/[id]/edit` | `web/src/app/(examiner)/questions/[id]/edit/page.js` | Edit question form (pre-populated) |

**Question form fields:**
- Title, Topic, Difficulty, Visibility
- Scenario, Statement, Constraints (list editor)
- Input/Output format
- Sample cases (dynamic add/remove, with input/output/explanation)
- Hidden cases (dynamic add/remove, with input/output)
- Starter code per language (JSON editor or structured form)
- Hint, Editorial
- Tags (multi-select)

**Design:**
- Dark theme matching existing app
- Responsive layout
- Form validation with error messages
- Success/error toasts

- [ ] **Checkpoint:** Examiner can create, view, edit, and delete questions through the dashboard UI.

---

### Step 2.7 — Examiner Layout & Sidebar

Create `web/src/app/(examiner)/layout.js`:

- Sidebar with navigation: Dashboard, Questions, Exams (Phase 3)
- Top bar with user info and sign-out
- Auth guard (check session, redirect to login if not authenticated)
- Role guard (check role is examiner, redirect to home if not)

- [ ] **Checkpoint:** Examiner layout renders with sidebar, navigation works.

---

### Step 2.8 — Candidate: Public Question Browser

Create `web/src/app/(candidate)/practice/page.js`:

- Paginated question list with difficulty badges and topic tags
- Search bar (fuzzy search on title)
- Filter by difficulty (Easy / Medium / Hard)
- Filter by topic
- Click to open practice IDE

Questions are fetched from the API (`GET /api/v1/questions?visibility=public`).

- [ ] **Checkpoint:** Candidates can browse public questions, search, and filter.

---

### Step 2.9 — Practice Mode Implementation

Create `web/src/app/(candidate)/practice/[id]/page.jsx`:

This reuses the existing exam IDE components but with modifications:
- **No timer** — practice mode has no time limit
- **Unlimited attempts** — candidates can submit as many times as they want
- **Pyodide for instant feedback** — runs sample cases client-side for quick testing
- **Server-side submission** — `POST /api/v1/submissions` with `isPractice: true`
- **Show editorial after first AC** — unlock hints/editorial after solving

Data flow:
1. Fetch question from API (via `getQuestion(id)`)
2. User writes code in existing `CodePanel`
3. "Run Samples" → Pyodide (client-side, instant)
4. "Submit" → API (`POST /api/v1/judge/submit`)
5. Results displayed in `OutputPanel`

- [ ] **Checkpoint:** Practice mode works end-to-end. Questions come from PostgreSQL, not `questions.json`.

---

### Step 2.10 — Deprecate Static Data Layer

1. Update `web/src/lib/api.js` to call the NestJS API instead of importing `questions.json`
2. Mark `web/src/data/questions.json` as deprecated (keep for reference, not used in app)
3. Update `ExamContext.js` to fetch questions from API on `LOAD_QUESTIONS` action

**Important:** The existing exam page (`/exam`) should continue working by fetching questions from the API instead of the static JSON file.

- [ ] **Checkpoint:** No component imports from `data/questions.json`. All question data comes from the API.

---

## Phase 2 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 2.1 | Question DTOs with Zod schemas | ⬜ |
| 2.2 | Questions service (CRUD + pagination + filters) | ⬜ |
| 2.3 | Questions controller with role-based hidden case stripping | ⬜ |
| 2.4 | Questions unit + E2E tests | ⬜ |
| 2.5 | Structured API client (`lib/api/`) | ⬜ |
| 2.6 | Examiner question management dashboard | ⬜ |
| 2.7 | Examiner layout + sidebar | ⬜ |
| 2.8 | Candidate public question browser | ⬜ |
| 2.9 | Practice mode (API-driven) | ⬜ |
| 2.10 | Static data layer deprecated | ⬜ |

**✅ Phase 2 is complete when:** Questions are fully managed through the API. Examiners have a management dashboard. Candidates can browse and practice. No static JSON is used for question data.

---

**Previous ← [Phase 1: Authentication](PHASE-1-AUTH.md)**
**Next → [Phase 3: Exam Management & Invitations](PHASE-3-EXAMS.md)**
