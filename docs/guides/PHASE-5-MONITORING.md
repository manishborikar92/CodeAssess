# Phase 5 — Monitoring, Analytics & Proctoring

> **Priority:** 🟡 Medium — Enhances the platform with enterprise features.
> **Estimated Time:** 2–3 weeks
> **Prerequisites:** Phase 4 complete (judge engine working, WebSocket layer operational)

---

## Objectives

- Build live exam monitoring dashboard for examiners (WebSocket-driven).
- Implement proctoring features (tab switch detection, fullscreen enforcement) with server-side logging.
- Build results export (CSV/PDF) as async job.
- Add per-exam analytics (score distribution, time analysis).
- Implement leaderboard system.
- Add audit logging for critical operations.

---

## Step-by-Step Guide

### Step 5.1 — Live Exam Monitoring Dashboard

Create `web/src/app/(examiner)/exams/[id]/monitor/page.js`:

**Features:**
- List of connected candidates (real-time via WebSocket)
- Per-candidate status: not started / solving / submitted / finished
- Live score updates as candidates submit
- Proctoring alerts (tab switches, fullscreen exits, paste attempts)
- Candidate count (connected / total invited)

**WebSocket events consumed:**

```javascript
// Examiner joins the exam room
socket.emit('join', { room: `exam:${examId}` });

// Listen for events
socket.on('candidate.joined', (data) => { /* update list */ });
socket.on('candidate.submitted', (data) => { /* update scores */ });
socket.on('candidate.finished', (data) => { /* mark done */ });
socket.on('leaderboard.updated', (data) => { /* refresh ranking */ });
socket.on('proctor.alert', (data) => { /* show alert */ });
```

- [ ] **Checkpoint:** Examiner sees candidates join, submit, and finish in real-time.

---

### Step 5.2 — Proctoring: Client-Side Event Capture

Update the exam IDE (`web/src/app/exam/[sessionId]/page.jsx`) to capture and report proctoring events:

```javascript
// Tab switch detection
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    reportFocusEvent('tab_switch');
    showWarning('Tab switch detected!');
  }
});

// Fullscreen exit detection
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    reportFocusEvent('fullscreen_exit');
    showWarning('Fullscreen mode exited!');
  }
});

// Paste attempt detection (in CodeMirror)
onPaste: (event) => {
  if (examConfig.disableCopyPaste) {
    event.preventDefault();
    reportFocusEvent('paste_attempt');
    showWarning('Paste is disabled during the exam.');
  }
};
```

**Report function:**

```javascript
async function reportFocusEvent(eventType, metadata = {}) {
  await apiClient(`/sessions/${sessionId}/focus-events`, {
    method: 'POST',
    body: JSON.stringify({ eventType, metadata }),
  });
}
```

- [ ] **Checkpoint:** Focus events are logged to the `focus_events` table. Examiner sees alerts in the monitoring dashboard.

---

### Step 5.3 — Proctoring: Server-Side API

Add to the sessions module:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /sessions/:id/focus-events` | JWT (candidate) | Log a focus event |
| `GET /sessions/:id/focus-events` | JWT (examiner/admin) | Get all focus events for a session |

**Focus event processing:**
- Increment counters in `exam_sessions` (tabSwitchCount, fullscreenExitCount, pasteAttemptCount)
- Store detailed event in `focus_events` table
- Emit `proctor.alert` via WebSocket to the exam room

**Auto-disqualification rule (configurable):**
- If tabSwitchCount > threshold → auto-disqualify session
- Threshold is configurable per exam (default: 10)

- [ ] **Checkpoint:** Focus events saved, counters updated, examiner notified in real-time.

---

### Step 5.4 — Analytics Module

Create `server/src/modules/analytics/`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `GET /exams/:id/analytics` | JWT | Examiner/Admin | Full exam analytics |

**Analytics data:**

```typescript
{
  summary: {
    totalCandidates: number,
    submittedCandidates: number,
    averageScore: number,
    medianScore: number,
    highestScore: number,
    lowestScore: number,
    averageDurationMinutes: number,
  },
  scoreDistribution: {
    '0-10': number,
    '10-20': number,
    // ... buckets
    '90-100': number,
  },
  perQuestion: [
    {
      questionId: string,
      title: string,
      difficulty: string,
      averageScore: number,
      acRate: number,            // % of candidates with AC
      averageAttempts: number,
      averageTimeMins: number,
    }
  ],
  proctoring: {
    totalTabSwitches: number,
    totalFullscreenExits: number,
    totalPasteAttempts: number,
    candidatesWithAlerts: number,
  }
}
```

**PostgreSQL queries using window functions:**

```sql
-- Score distribution
SELECT
  width_bucket(total_score, 0, max_possible_score, 10) AS bucket,
  count(*) AS count
FROM exam_sessions
WHERE exam_id = $1 AND status IN ('finished', 'timed_out')
GROUP BY bucket ORDER BY bucket;

-- Per-question AC rate
SELECT
  q.id, q.title, q.difficulty,
  AVG(bs.score) AS avg_score,
  SUM(CASE WHEN bs.verdict = 'AC' THEN 1 ELSE 0 END)::float / COUNT(*) AS ac_rate
FROM questions q
JOIN exam_questions eq ON eq.question_id = q.id
LEFT JOIN best_submissions bs ON bs.question_id = q.id AND bs.session_id IN (
  SELECT id FROM exam_sessions WHERE exam_id = $1
)
WHERE eq.exam_id = $1
GROUP BY q.id, q.title, q.difficulty;
```

- [ ] **Checkpoint:** Analytics endpoint returns comprehensive data. Examiner UI displays charts and statistics.

---

### Step 5.5 — Analytics UI

Create `web/src/app/(examiner)/exams/[id]/results/page.js`:

- **Score distribution chart** (bar chart or histogram)
- **Per-question breakdown table** (sortable by AC rate, avg score)
- **Summary cards** (total candidates, average score, median, etc.)
- **Proctoring summary** (candidates with alerts, total violations)
- **Individual candidate drill-down** (click a candidate to see their submissions + focus events)

Consider using a charting library:

```bash
cd web
npm install recharts  # Lightweight React charting
```

- [ ] **Checkpoint:** Full analytics dashboard with charts, tables, and drill-down.

---

### Step 5.6 — Leaderboard System

**Live leaderboard (during exam):**
- Redis sorted set: `leaderboard:{examId}` → candidate scores
- Updated on every submission
- WebSocket broadcasts `leaderboard.updated` to exam room

```typescript
// On submission result
await redis.zadd(`leaderboard:${examId}`, candidateScore, candidateId);
const rankings = await redis.zrevrange(`leaderboard:${examId}`, 0, -1, 'WITHSCORES');
this.examGateway.emitLeaderboard(examId, rankings);
```

**Final leaderboard (after exam):**
- Computed from `exam_sessions` table
- Updates `rank` column in each session
- Displayed on results page

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `GET /exams/:id/leaderboard` | JWT | Creator/Invited/Admin | Get ranked results |

- [ ] **Checkpoint:** Live leaderboard updates in real-time. Final leaderboard shows ranks.

---

### Step 5.7 — Results Export (Async Job)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `POST /exams/:id/export` | JWT | Examiner/Admin | Start export job, return jobId |
| `GET /exports/:jobId` | JWT | Examiner/Admin | Check export status, download when ready |

**Export formats:**
- **CSV:** Candidate, Score, Rank, Per-question scores, Duration, Tab switches
- **PDF:** Formatted report with charts (using `pdfkit` or `puppeteer`)

**Implementation:**
1. Enqueue BullMQ job (type: `export`)
2. Worker generates file, uploads to S3/MinIO (or local filesystem for MVP)
3. Returns signed URL for download

For MVP, save to local filesystem and serve via Express static.

- [ ] **Checkpoint:** Export starts, job completes, file is downloadable.

---

### Step 5.8 — Audit Logging

Create an `AuditService` that logs critical operations:

```typescript
@Injectable()
export class AuditService {
  async log(params: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }) {
    await this.prisma.auditLog.create({ data: params });
  }
}
```

**Events to audit:**

| Action | Resource | Trigger |
|--------|----------|---------|
| `user.signup` | User | User registration |
| `user.login` | User | Successful login |
| `user.logout` | User | Logout |
| `question.create` | Question | Question created |
| `question.update` | Question | Question modified |
| `question.delete` | Question | Question soft-deleted |
| `exam.create` | Exam | Exam created |
| `exam.publish` | Exam | Exam published |
| `exam.close` | Exam | Exam closed |
| `session.start` | ExamSession | Candidate starts exam |
| `session.finish` | ExamSession | Candidate finishes exam |
| `submission.create` | Submission | Code submitted |
| `token.revoke` | User | Token revoked (logout/admin) |

- [ ] **Checkpoint:** Audit log table records all critical operations with timestamps and actor info.

---

## Phase 5 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 5.1 | Live exam monitoring dashboard | ⬜ |
| 5.2 | Client-side proctoring event capture | ⬜ |
| 5.3 | Server-side proctoring API | ⬜ |
| 5.4 | Analytics module (SQL queries + API) | ⬜ |
| 5.5 | Analytics UI (charts + tables) | ⬜ |
| 5.6 | Leaderboard system (live + final) | ⬜ |
| 5.7 | Results export (CSV/PDF async job) | ⬜ |
| 5.8 | Audit logging | ⬜ |

**✅ Phase 5 is complete when:** Examiners can monitor live exams, view analytics, export results, and all critical operations are audit-logged.

---

**Previous ← [Phase 4: Remote Judge Engine](PHASE-4-JUDGE.md)**
**Next → [Phase 6: Production Hardening](PHASE-6-PRODUCTION.md)**
