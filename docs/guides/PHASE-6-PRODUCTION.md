# Phase 6 — Production Hardening & Deployment

> **Priority:** 🟡 Medium — Ensures the platform is secure, reliable, and performant for production.
> **Estimated Time:** 2 weeks
> **Prerequisites:** Phase 5 complete (all features built, monitoring in place)

---

## Objectives

- Security audit (OWASP Top 10 compliance).
- Rate limiting on all endpoints.
- Penetration testing on the judge sandbox.
- CDN setup for Pyodide WASM and static assets.
- Automated backups and disaster recovery plan.
- CI/CD pipeline (lint → test → build → migrate → deploy).
- Load testing at target scale.
- OpenTelemetry tracing across all services.

---

## Step-by-Step Guide

### Step 6.1 — Security Audit (OWASP Top 10)

Audit checklist:

| # | OWASP Category | Action |
|---|----------------|--------|
| A01 | Broken Access Control | Verify all endpoints enforce auth + role guards. Test: candidate accessing examiner routes → 403. |
| A02 | Cryptographic Failures | Verify: JWT secret ≥ 32 chars, bcrypt rounds = 12, cookies are httpOnly + secure + sameSite. |
| A03 | Injection | Verify: Prisma parameterized queries, Zod validation on all inputs, no raw SQL. |
| A04 | Insecure Design | Verify: hidden_cases never in API responses, rate limiting on auth endpoints. |
| A05 | Security Misconfiguration | Verify: no debug mode in production, Swagger disabled, CORS explicitly configured. |
| A06 | Vulnerable Components | Run `npm audit` on all packages. Update or replace vulnerable dependencies. |
| A07 | Auth Failures | Verify: account lockout after 5 failed attempts, JWT blocklist working. |
| A08 | Software Integrity | Verify: package-lock.json committed, no wildcard versions in dependencies. |
| A09 | Logging & Monitoring | Verify: all auth events logged, audit trail complete, error tracking enabled. |
| A10 | SSRF | Verify: no user-controlled URLs in server-side requests. |

- [ ] **Checkpoint:** All 10 OWASP categories reviewed and addressed.

---

### Step 6.2 — Global Rate Limiting

Implement tiered rate limiting (as defined in SCALING.md Section 10.3):

**Per-user limits (sliding window, keyed by user UUID):**

| Endpoint | Limit |
|----------|-------|
| `/judge/run` | 10 / 60s |
| `/judge/submit` | 5 / 60s |
| `/questions` | 60 / 60s |
| `/auth/login` | 5 / 300s |

**Per-IP limits (keyed by IP address):**

| Scope | Limit |
|-------|-------|
| Global | 200 / 60s |
| `/auth/*` | 10 / 300s |

Implement using Redis sliding window or install `@nestjs/throttler`:

```bash
cd server
npm install @nestjs/throttler
```

- [ ] **Checkpoint:** Rate limits enforced. 429 responses returned when exceeded.

---

### Step 6.3 — Judge Sandbox Penetration Testing

Test scenarios:

| # | Attack Vector | Expected Outcome |
|---|--------------|-----------------|
| 1 | Fork bomb (`:(){ :\|:& };:`) | PID limit (64) prevents it |
| 2 | Network access (`curl google.com`) | `network_mode: none` blocks it |
| 3 | File system write | `read_only_rootfs` prevents it |
| 4 | Memory exhaustion (allocate 1GB) | OOM killer terminates container |
| 5 | Infinite loop | TLE timeout terminates container |
| 6 | Privilege escalation (`sudo`) | `no_new_privileges` + `cap_drop: ALL` |
| 7 | Access host filesystem | Read-only mount, no host paths exposed |
| 8 | Spawn additional containers | No Docker socket access |

- [ ] **Checkpoint:** All attack vectors tested and properly blocked.

---

### Step 6.4 — CDN Setup

Configure CDN for static assets:

| Asset | CDN | Cache TTL |
|-------|-----|-----------|
| Pyodide WASM (~15MB) | Cloudflare / existing jsdelivr CDN | 7 days |
| Next.js static files | Vercel CDN (automatic) | Immutable |
| Code runner Docker images | Container registry (Docker Hub / GHCR) | N/A |

For Pyodide, ensure the CDN URL is configurable:

```javascript
// web/src/app/layout.js
<Script
  src={process.env.NEXT_PUBLIC_PYODIDE_CDN || "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js"}
  strategy="afterInteractive"
/>
```

- [ ] **Checkpoint:** Static assets served from CDN. Page load time improved.

---

### Step 6.5 — Automated Backups & Disaster Recovery

**PostgreSQL backups:**
- Daily automated backups (using managed DB service's built-in backup)
- Or manual: `pg_dump` cronjob → S3

```bash
# Backup script (for self-hosted PostgreSQL)
pg_dump -U codeassess -h localhost codeassess | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
# Upload to S3
aws s3 cp backup_*.sql.gz s3://codeassess-backups/postgres/
```

**Redis backup:**
- Redis RDB snapshots (automatic for managed Redis)
- Non-critical data (sessions, cache) can be reconstructed

**Recovery plan:**
1. Restore PostgreSQL from latest backup
2. Redis data regenerates automatically (cache, sessions)
3. Re-deploy all services
4. Run `prisma migrate deploy` to ensure schema is current
5. Verify health endpoints

- [ ] **Checkpoint:** Backup strategy documented and automated. Recovery tested.

---

### Step 6.6 — CI/CD Pipeline

Create GitHub Actions workflow at `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd web && npm ci && npm run lint
      - run: cd server && npm ci && npm run lint

  test-api:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: codeassess_test
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd server && npm ci
      - run: cd server && npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/codeassess_test
      - run: cd server && npm run test
      - run: cd server && npm run test:e2e

  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd web && npm ci && npm run build

  deploy:
    needs: [lint, test-api, build-web]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Deploy steps depend on hosting provider
      # Vercel for web, Railway/ECS for API
```

- [ ] **Checkpoint:** CI pipeline runs on every PR. Deployment triggers on main branch merge.

---

### Step 6.7 — Load Testing

Use `k6` or `autocannon` to test at target scale:

**Test scenarios:**

| Scenario | Target | Duration |
|----------|--------|----------|
| Concurrent logins | 100 users | 1 minute |
| Question browsing | 500 concurrent | 5 minutes |
| Concurrent submissions | 100 submissions | 1 minute |
| Mixed workload | 500 users (browse + submit) | 10 minutes |

**Success criteria:**
- P99 response time < 500ms for API endpoints
- P99 response time < 2s for judge submissions
- Zero 5xx errors
- Zero data corruption

```bash
# Install k6
winget install k6

# Run load test
k6 run --vus 100 --duration 60s loadtest.js
```

- [ ] **Checkpoint:** Load tests pass success criteria at MVP scale (100 concurrent users).

---

### Step 6.8 — OpenTelemetry Tracing

Add distributed tracing across NestJS + judge worker:

```bash
cd server
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http
```

Create `server/src/tracing.ts`:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'codeassess-api',
});

sdk.start();
```

**Import before anything else in `main.ts`:**

```typescript
import './tracing';
// ... rest of bootstrap
```

For visualization, use Grafana + Tempo or Jaeger (Docker):

```yaml
# Add to docker-compose.yml
jaeger:
  image: jaegertracing/all-in-one:latest
  ports:
    - "16686:16686"  # Jaeger UI
    - "4318:4318"    # OTLP HTTP
```

- [ ] **Checkpoint:** Traces visible in Jaeger/Grafana. Request traces span NestJS → Redis → PostgreSQL.

---

### Step 6.9 — Error Tracking (Sentry)

```bash
cd server && npm install @sentry/node
cd web && npm install @sentry/nextjs
```

Configure Sentry for both NestJS and Next.js to capture unhandled exceptions and performance data.

- [ ] **Checkpoint:** Errors appear in Sentry dashboard. Source maps uploaded for meaningful stack traces.

---

## Phase 6 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 6.1 | Security audit (OWASP Top 10) | ⬜ |
| 6.2 | Rate limiting on all endpoints | ⬜ |
| 6.3 | Judge sandbox penetration testing | ⬜ |
| 6.4 | CDN setup for static assets | ⬜ |
| 6.5 | Automated backups + disaster recovery plan | ⬜ |
| 6.6 | CI/CD pipeline (GitHub Actions) | ⬜ |
| 6.7 | Load testing at MVP scale | ⬜ |
| 6.8 | OpenTelemetry distributed tracing | ⬜ |
| 6.9 | Error tracking (Sentry) | ⬜ |

**✅ Phase 6 is complete when:** The platform passes security audit, handles load at target scale, has automated CI/CD, backups, and observability in place. Ready for production launch.

---

**Previous ← [Phase 5: Monitoring & Analytics](PHASE-5-MONITORING.md)**

---

## 🎉 Implementation Complete

All 7 phases (0–6) cover the full scaling journey from a client-only exam simulator to a production-grade, multi-tenant assessment platform. Total estimated timeline: **14–19 weeks**.
