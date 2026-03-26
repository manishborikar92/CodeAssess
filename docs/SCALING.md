# Scaling & Backend Migration

## Current Limitations

The platform currently runs entirely in the browser:
- **No authentication** — anyone can access the exam
- **No persistent storage** — sessions exist only in localStorage
- **Single language** — Python only (via Pyodide)
- **Client-side judge** — test cases and solutions are visible in browser DevTools
- **No analytics** — no tracking of user performance across sessions

## Phase 1: API Routes (Next.js Backend)

### Add Next.js API Routes

```
src/app/api/
├── questions/
│   └── route.js          # GET: Fetch questions (without hidden cases)
├── submissions/
│   └── route.js          # POST: Submit code + results
├── sessions/
│   ├── route.js          # POST: Create session, GET: List sessions
│   └── [id]/route.js     # GET/PUT: Single session
└── auth/
    └── [...nextauth]/
        └── route.js      # Authentication endpoints
```

### Swap API Layer

The existing `lib/api.js` abstraction makes this a drop-in replacement:

```javascript
// Before (local)
export async function getQuestions() {
  return import('@/data/questions.json').then(m => m.default);
}

// After (API)
export async function getQuestions() {
  const res = await fetch('/api/questions');
  return res.json();
}
```

## Phase 2: Database

### Schema Design

```sql
-- Users
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  name       VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id           SERIAL PRIMARY KEY,
  exam_id      UUID REFERENCES exams(id),
  title        VARCHAR(255) NOT NULL,
  section      VARCHAR(10),
  topic        VARCHAR(100),
  difficulty   VARCHAR(20),
  max_score    INT NOT NULL,
  scenario     TEXT,
  statement    TEXT NOT NULL,
  constraints  JSONB,
  input_format TEXT,
  output_format TEXT,
  sample_cases JSONB NOT NULL,
  hidden_cases JSONB NOT NULL,    -- Never sent to client
  hint         TEXT,
  starter_code TEXT,
  sort_order   INT
);

-- Sessions
CREATE TABLE sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  exam_id      UUID REFERENCES exams(id),
  status       VARCHAR(20) DEFAULT 'active',
  started_at   TIMESTAMP NOT NULL,
  finished_at  TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES sessions(id),
  question_id  INT REFERENCES questions(id),
  code         TEXT NOT NULL,
  score        INT NOT NULL,
  passed       INT NOT NULL,
  total        INT NOT NULL,
  verdict      JSONB,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

### Key Design Decisions

- **`hidden_cases` never leaves the server** — API strips them before sending
- **Best submission per question** enforced at the application layer
- **JSONB** for flexible structured data (constraints, test cases, verdicts)
- **UUID primary keys** for distributed systems readiness

## Phase 3: Remote Code Execution

### Architecture

```
Client                  API Server              Judge Worker
  │                        │                        │
  │ POST /api/judge/run    │                        │
  │───────────────────────▶│                        │
  │                        │ Enqueue job            │
  │                        │───────────────────────▶│
  │                        │                        │ Docker container
  │                        │                        │ - Run code
  │                        │                        │ - Capture output
  │                        │     Results            │ - Apply limits
  │                        │◀───────────────────────│
  │    Results             │                        │
  │◀───────────────────────│                        │
```

### Judge Worker Specification

```yaml
container:
  image: python:3.11-slim
  resources:
    cpu: "0.5"
    memory: "256Mi"
  timeout: 10s
  network: none
  readonly_rootfs: true
  seccomp: default

execution:
  per_test_timeout: 5s
  total_timeout: 60s
  max_output_size: 1MB
```

### Multi-Language Support

```javascript
// Future judge.js
export async function runTestCase(code, input, expected, language) {
  const res = await fetch('/api/judge/execute', {
    method: 'POST',
    body: JSON.stringify({ code, input, expected, language, timeout: 8000 }),
  });
  return res.json();
}
```

Supported languages: Python, Java, C++, JavaScript, Go

### Hybrid Mode

Keep Pyodide as a **fallback** for:
- Offline usage
- Development/testing
- Instant feedback (no network latency)
- Environments where backend is unavailable

```javascript
export async function runTestCase(code, input, expected, timeout) {
  if (config.useRemoteJudge) {
    return remoteExecute(code, input, expected, timeout);
  }
  return pyodideExecute(code, input, expected, timeout);
}
```

## Phase 4: Production Hardening

### Performance
- **CDN caching** for Pyodide WASM bundles
- **Lazy loading** of questions (fetch on demand)
- **WebSocket** for real-time judge results
- **Service Worker** for offline support

### Security
- **Authentication** via NextAuth.js (OAuth / Credentials)
- **Rate limiting** on judge API
- **CSRF protection** on all mutations
- **Input sanitization** for code submissions
- **Encrypted sessions**

### Monitoring
- **Error tracking** (Sentry)
- **Performance monitoring** (Web Vitals)
- **Judge metrics** (execution time, memory, queue depth)
- **User analytics** (question completion rates, time per question)

### Scaling
- **Horizontal scaling** of judge workers (Kubernetes)
- **Queue-based** execution (Redis / RabbitMQ)
- **Read replicas** for question data
- **CDN** for static assets
