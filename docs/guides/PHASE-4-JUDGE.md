# Phase 4 — Remote Judge Engine

> **Priority:** 🟠 High — Enables secure, multi-language code execution.
> **Estimated Time:** 3–4 weeks
> **Prerequisites:** Phase 3 complete (exams + sessions working, submissions API functional)

---

## Objectives

- Build the submissions API and judge module in NestJS.
- Set up BullMQ job queue with Redis.
- Build Docker runner images for each supported language.
- Implement sandboxed code execution with resource limits.
- Add WebSocket layer for real-time judge results.
- Implement hybrid mode (Pyodide fallback for practice).
- Load test for 100+ concurrent submissions.

---

## Step-by-Step Guide

### Step 4.1 — Submissions Module

Create `apps/api/src/modules/submissions/`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `POST /submissions` | JWT | Candidate | Submit code (creates submission + enqueues judge job) |
| `GET /submissions/:id` | JWT | Owner/Examiner/Admin | Get submission result |
| `GET /submissions/history` | JWT | Any | Own submission history (paginated) |

**Submission flow:**

```
1. Validate: code size < 50KB, session active, language allowed, rate limit OK
2. Create submission row (verdict: PENDING)
3. Enqueue BullMQ job with { submissionId, code, language, questionId, testCases }
4. Return { submissionId, status: 'PENDING' }
5. Client subscribes to WebSocket or polls for result
```

- [ ] **Checkpoint:** Submission created, job enqueued, submission record shows PENDING.

---

### Step 4.2 — Judge Module (BullMQ Producer)

Create `apps/api/src/modules/judge/`:

| File | Purpose |
|------|---------|
| `judge.module.ts` | Module registration + BullMQ queue setup |
| `judge.controller.ts` | `POST /judge/run` (samples), `POST /judge/submit` (full) |
| `judge.service.ts` | Enqueues jobs to BullMQ, handles result callbacks |
| `judge.processor.ts` | BullMQ consumer — processes judge jobs |
| `dto/run-code.dto.ts` | Zod schema: code, language, questionId, sessionId (optional) |
| `dto/judge-result.dto.ts` | Result shape: verdict, score, passed, total, testResults[] |

**BullMQ setup:**

```typescript
// judge.module.ts
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'judge',
      defaultJobOptions: {
        attempts: 1,
        timeout: 120000,      // 2 minutes max
        removeOnComplete: 100, // Keep last 100 completed
        removeOnFail: 50,
      },
    }),
  ],
})
```

**Job types:**

| Type | Priority | Test Cases | Scoring |
|------|----------|------------|---------|
| `run` | HIGH (1) | Sample cases only | No score |
| `submit` | NORMAL (5) | All cases (sample + hidden) | Scored |

- [ ] **Checkpoint:** Jobs are enqueued in BullMQ. Redis shows the queue.

---

### Step 4.3 — Docker Runner Images

Create `apps/judge/images/` directory with Dockerfiles for each language:

| Language | Directory | Base Image | Notes |
|----------|-----------|------------|-------|
| Python 3.11 | `python/` | `python:3.11-alpine` | Add `solution.py` entrypoint |
| C++ 17 | `cpp/` | `gcc:13-bookworm` | Two-stage: compile → run |
| Java 17 | `java/` | `eclipse-temurin:17-alpine` | Compile → run |
| JavaScript (Node 20) | `javascript/` | `node:20-alpine` | Direct execution |
| Go 1.22 | `go/` | `golang:1.22-alpine` | Compile → run |

**Build all images:**

```bash
# From apps/judge/images/
docker build -t codeassess/runner-python:3.11 ./python
docker build -t codeassess/runner-cpp:17 ./cpp
docker build -t codeassess/runner-java:17 ./java
docker build -t codeassess/runner-js:20 ./javascript
docker build -t codeassess/runner-go:1.22 ./go
```

**Each image must:**
- Have a `WORKDIR /code` directory
- Accept code files mounted at `/code/`
- Read stdin from piped input
- Write stdout for output comparison
- Exit with code 0 on success

- [ ] **Checkpoint:** All 5 images built. Test each with a simple "Hello World" program.

---

### Step 4.4 — Judge Processor (BullMQ Consumer)

Create `apps/api/src/modules/judge/judge.processor.ts`:

This is the core execution engine. For the MVP, it runs in the same NestJS process using `dockerode` (Node.js Docker SDK).

```bash
npm install dockerode
npm install -D @types/dockerode
```

**Execution per test case:**

```typescript
async function executeTestCase(
  code: string,
  language: string,
  input: string,
  expected: string,
  timeLimitMs: number,
  memoryLimitMb: number,
): Promise<TestCaseResult> {
  // 1. Write code to temp file
  // 2. Create Docker container with security config
  // 3. Pipe stdin (input)
  // 4. Capture stdout + stderr
  // 5. Wait with timeout
  // 6. Compare normalized output
  // 7. Destroy container
  // 8. Return verdict (AC/WA/TLE/RE/CE)
}
```

**Container security config (from SCALING.md Section 8):**

```typescript
const containerConfig = {
  Image: imageForLanguage(language),
  Cmd: commandForLanguage(language),
  HostConfig: {
    Memory: memoryLimitMb * 1024 * 1024,
    MemorySwap: memoryLimitMb * 1024 * 1024, // No swap
    CpuPeriod: 100000,
    CpuQuota: 50000,      // 50% of one core
    PidsLimit: 64,
    NetworkMode: 'none',
    ReadonlyRootfs: true,
    SecurityOpt: ['no-new-privileges'],
    CapDrop: ['ALL'],
    Binds: [`${tempDir}:/code:ro`],
  },
  User: '65534:65534',    // nobody
};
```

**After all test cases:**

```typescript
// Aggregate results
const verdict = allPassed ? 'AC' : hasCompileError ? 'CE' : hasTLE ? 'TLE' : hasRE ? 'RE' : 'WA';
const score = Math.round((passed / total) * maxScore);

// Save to database
await prisma.submission.update({
  where: { id: submissionId },
  data: { verdict, score, passed, total, testResults, maxExecutionMs, maxMemoryKb },
});

// Update session score
if (sessionId) {
  await updateSessionScore(sessionId);
}

// Publish result via WebSocket
await publishJudgeResult(submissionId, sessionId, result);
```

- [ ] **Checkpoint:** Full judge pipeline works: submit code → queue → Docker execution → results saved → WebSocket notification.

---

### Step 4.5 — WebSocket Gateway

Create `apps/api/src/websockets/`:

| File | Purpose |
|------|---------|
| `websocket.module.ts` | Module with Socket.IO and Redis adapter |
| `exam.gateway.ts` | `exam:{examId}` room — examiner monitoring |
| `session.gateway.ts` | `session:{sessionId}` room — judge results for candidate |

**Events emitted by the judge:**

```typescript
// To the candidate's session room
this.server.to(`session:${sessionId}`).emit('judge.completed', {
  submissionId,
  verdict,
  score,
  passed,
  total,
  testResults,
});

// To the examiner's exam room
this.server.to(`exam:${examId}`).emit('candidate.submitted', {
  candidateId,
  questionId,
  verdict,
  score,
});
```

**Redis adapter (for multi-instance scaling):**

```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

- [ ] **Checkpoint:** WebSocket connections work. Judge results are pushed to the client in real-time.

---

### Step 4.6 — Client-Side WebSocket Integration

Create `web/src/lib/hooks/useWebSocket.js`:

```javascript
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(sessionId) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    socket.emit('join', { room: `session:${sessionId}` });

    socket.on('judge.completed', (result) => {
      // Update UI with judge result
    });

    socketRef.current = socket;
    return () => socket.disconnect();
  }, [sessionId]);

  return socketRef;
}
```

Install Socket.IO client in the web app:

```bash
cd web
npm install socket.io-client
```

- [ ] **Checkpoint:** Client receives real-time judge results via WebSocket.

---

### Step 4.7 — Hybrid Mode (Pyodide Fallback)

Update `web/src/lib/judge/pyodide.js` to implement the hybrid execution strategy:

```javascript
export async function executeSubmission(code, question, language, config) {
  // Practice mode or Python with instant feedback → Pyodide (client-side)
  if (config.isPractice && language === 'python') {
    return pyodideExecute(code, question);
  }

  // Exam mode → Remote judge (secure, hidden cases on server)
  const response = await apiClient('/judge/submit', {
    method: 'POST',
    body: JSON.stringify({
      questionId: question.id,
      sessionId: config.sessionId,
      code,
      language,
    }),
  });

  // Wait for WebSocket result or poll
  return waitForResult(response.data.submissionId, config.sessionId);
}
```

**Decision matrix:**

| Context | Language | Engine | Reason |
|---------|----------|--------|--------|
| Practice mode | Python | Pyodide | Instant feedback, no server cost |
| Practice mode | Other | Remote judge | Pyodide only supports Python |
| Exam mode | Any | Remote judge | Hidden test cases must stay server-side |

- [ ] **Checkpoint:** Practice mode uses Pyodide for Python. Exam mode always uses remote judge.

---

### Step 4.8 — Rate Limiting

Implement per-user rate limiting on judge endpoints using Redis:

```typescript
// Sliding window rate limiter
async function checkRateLimit(userId: string, endpoint: string): Promise<boolean> {
  const key = `ratelimit:${endpoint}:${userId}`;
  const limit = RATE_LIMITS[endpoint];
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, limit.windowSeconds);
  return current <= limit.maxRequests;
}
```

| Endpoint | Limit |
|----------|-------|
| `/judge/run` | 10 per 60 seconds |
| `/judge/submit` | 5 per 60 seconds |
| `/submissions` | 10 per 60 seconds |

- [ ] **Checkpoint:** Rate limiting works. Exceeding the limit returns 429.

---

### Step 4.9 — Judge Tests

**Unit tests:**

| Test | Assertion |
|------|-----------|
| Python AC | Correct output → verdict AC |
| Python WA | Wrong output → verdict WA |
| Python TLE | Infinite loop → verdict TLE |
| Python RE | Exception → verdict RE |
| C++ CE | Invalid syntax → verdict CE |
| Score calculation | `Math.round((passed/total) * maxScore)` |
| Container cleanup | Container destroyed after execution |

**Integration tests:**

| Test | Flow |
|------|------|
| Submit → queue → execute → result saved | Full pipeline |
| WebSocket receives result | Real-time notification |
| Rate limit exceeded | 429 returned |
| Multiple concurrent submissions | All execute successfully |

**Load test (using `autocannon` or `k6`):**

```bash
# Install load testing tool
npm install -g autocannon

# Run 100 concurrent submissions
autocannon -c 100 -d 30 -m POST \
  -H "Content-Type: application/json" \
  -b '{"code":"print(1)","language":"python","questionId":"..."}' \
  http://localhost:4000/api/v1/judge/submit
```

- [ ] **Checkpoint:** All tests pass. System handles 100+ concurrent submissions.

---

## Phase 4 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 4.1 | Submissions module (create, get, history) | ⬜ |
| 4.2 | Judge module with BullMQ producer | ⬜ |
| 4.3 | Docker runner images (5 languages) | ⬜ |
| 4.4 | Judge processor (Docker execution + scoring) | ⬜ |
| 4.5 | WebSocket gateway (exam + session rooms) | ⬜ |
| 4.6 | Client-side WebSocket integration | ⬜ |
| 4.7 | Hybrid mode (Pyodide fallback) | ⬜ |
| 4.8 | Rate limiting on judge endpoints | ⬜ |
| 4.9 | Judge unit + integration + load tests | ⬜ |

**✅ Phase 4 is complete when:** Code can be submitted in 5 languages, executed securely in Docker containers, results delivered via WebSocket, and the system handles 100+ concurrent submissions.

---

**Previous ← [Phase 3: Exam Management](PHASE-3-EXAMS.md)**
**Next → [Phase 5: Monitoring & Analytics](PHASE-5-MONITORING.md)**
