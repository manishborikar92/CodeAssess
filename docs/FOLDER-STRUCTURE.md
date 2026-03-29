# CodeAssess — Final Folder Structure

**Project:** CodeAssess (Next.js 16, JavaScript)  
**Date:** March 29, 2026  
**Status:** Approved

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `← EXISTS` | File/folder already exists — kept as-is |
| `← MOVED` | Existing file relocated to this path |
| `NEW` | New file to be created |

---

## Full Structure

```
web/
├── public/
│   ├── logo.svg                               ← EXISTS
│   └── og/                                    NEW
│       ├── home.png                           NEW  (1200×630 — landing page)
│       ├── practice.png                       NEW  (1200×630 — practice workspace)
│       └── default.png                        NEW  (1200×630 — fallback)
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (marketing)/                       NEW  — Public pages, SSG, no auth required
│   │   │   ├── layout.jsx                     NEW  — Nav + footer shell
│   │   │   └── page.jsx                       ← MOVED  (was: app/page.js)
│   │   │
│   │   ├── (workspace)/                       NEW  — All active-session routes
│   │   │   │                                        layout.jsx is auth-check only —
│   │   │   │                                        no header, sidebar, or shell UI.
│   │   │   │                                        Each page renders its own full UI.
│   │   │   ├── layout.jsx                     NEW  — Bare auth guard, zero chrome
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── page.jsx                   NEW  — Question browser / selector
│   │   │   │   └── [id]/
│   │   │   │       ├── page.jsx               ← MOVED  (was: app/practice/page.js)
│   │   │   │       ├── loading.jsx            NEW
│   │   │   │       └── error.jsx              NEW
│   │   │   │
│   │   │   ├── exam/
│   │   │   │   └── [sessionId]/
│   │   │   │       ├── page.jsx               ← MOVED  (was: app/exam/page.js)
│   │   │   │       ├── loading.jsx            NEW
│   │   │   │       └── error.jsx              NEW
│   │   │   │
│   │   │   ├── join/
│   │   │   │   └── [token]/
│   │   │   │       └── page.jsx               NEW  — Invitation flow → lobby → exam start
│   │   │   │
│   │   │   └── results/
│   │   │       └── [sessionId]/
│   │   │           └── page.jsx               NEW  — Post-exam results view
│   │   │
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.js               NEW  — Auth.js handler (Google, GitHub, Credentials)
│   │   │
│   │   ├── layout.jsx                         ← EXISTS  — Root layout (fonts, metadata, providers)
│   │   ├── globals.css                        ← EXISTS
│   │   ├── manifest.json                      ← EXISTS
│   │   ├── favicon.ico                        ← EXISTS
│   │   ├── apple-icon.png                     ← EXISTS
│   │   ├── icon0.svg                          ← EXISTS
│   │   ├── icon1.png                          ← EXISTS
│   │   ├── not-found.jsx                      NEW  — Global 404 page
│   │   ├── error.jsx                          NEW  — Global error boundary
│   │   ├── robots.js                          NEW  — Dynamic robots.txt
│   │   └── sitemap.js                         NEW  — Dynamic sitemap.xml
│   │
│   ├── components/
│   │   ├── ui/                                ← EXISTS  — Reusable primitives
│   │   │   ├── Modal.jsx                      ← EXISTS
│   │   │   ├── Spinner.jsx                    ← EXISTS
│   │   │   └── Toast.jsx                      ← EXISTS
│   │   │
│   │   ├── exam/                              ← EXISTS  — IDE panel components
│   │   │   ├── ExamShell.jsx                  ← EXISTS  — Grid layout orchestrator
│   │   │   ├── Header.jsx                     ← EXISTS  — Timer, score, controls
│   │   │   ├── Sidebar.jsx                    ← EXISTS  — Question navigator
│   │   │   ├── ProblemPanel.jsx               ← EXISTS  — Problem description
│   │   │   ├── CodePanel.jsx                  ← EXISTS  — CodeMirror 6 editor
│   │   │   ├── OutputPanel.jsx                ← EXISTS  — Test results / console
│   │   │   └── ResultsScreen.jsx              ← EXISTS  — Post-exam results
│   │   │
│   │   ├── home/                              ← EXISTS  — Landing page sections
│   │   │   ├── HeroSection.jsx                ← EXISTS
│   │   │   ├── FeatureSection.jsx             ← EXISTS
│   │   │   ├── FlowSection.jsx                ← EXISTS
│   │   │   ├── ModeSection.jsx                ← EXISTS
│   │   │   ├── Navigation.jsx                 ← EXISTS
│   │   │   └── Footer.jsx                     ← EXISTS
│   │   │
│   │   └── shared/                            NEW  — Cross-concern providers
│   │       ├── AuthProvider.jsx               NEW  — Auth.js SessionProvider wrapper
│   │       └── QueryProvider.jsx              NEW  — TanStack Query setup
│   │
│   ├── hooks/                                 ← EXISTS  — All hooks in one flat directory
│   │   ├── usePyodide.js                      ← EXISTS  — Pyodide WASM lifecycle
│   │   ├── useTimer.js                        ← EXISTS  — Countdown timer
│   │   ├── useExamIntegrityGuards.js          ← EXISTS  — Fullscreen / tab-switch detection
│   │   ├── useSubmission.js                   NEW  — Polls / listens for judge results
│   │   ├── useAutoSave.js                     NEW  — Debounced draft save
│   │   └── useWebSocket.js                    NEW  — WebSocket wrapper for live results
│   │
│   ├── lib/
│   │   ├── api/                               NEW  — Structured API client (wraps fetch → NestJS)
│   │   │   ├── client.js                      NEW  — Base fetch with auth headers
│   │   │   ├── questions.js                   NEW  — Questions API calls
│   │   │   ├── exams.js                       NEW  — Exams API calls
│   │   │   ├── submissions.js                 NEW  — Submissions API calls
│   │   │   └── index.js                       NEW  — Re-exports
│   │   │
│   │   ├── auth/                              NEW  — Auth.js integration helpers
│   │   │   ├── auth.config.js                 NEW  — Providers + callbacks config
│   │   │   └── session.js                     NEW  — getServerSession helper
│   │   │
│   │   ├── judge/                             NEW  — Judge module
│   │   │   └── pyodide.js                     ← MOVED  (was: lib/judge.js)
│   │   │
│   │   └── utils/                             NEW  — Pure utility functions
│   │       ├── navigation.js                  ← MOVED  (was: lib/workspaceNavigation.mjs)
│   │       └── time.js                        NEW  — Time formatting helpers
│   │
│   ├── store/                                 NEW  — Zustand global state (CSR only)
│   │   ├── examStore.js                       NEW  — Active exam state (replaces ExamContext.js)
│   │   └── editorStore.js                     NEW  — Per-question language / code state
│   │
│   ├── types/                                 NEW  — Shared JSDoc @typedef definitions
│   │   ├── question.types.js                  NEW
│   │   ├── submission.types.js                NEW
│   │   ├── session.types.js                   NEW
│   │   └── index.js                           NEW  — Re-exports all typedefs
│   │
│   └── data/                                  ← EXISTS  — Static data (temporary)
│       └── questions.json                     ← EXISTS  — 37 questions (→ PostgreSQL in Phase 2)
│
├── proxy.js                                   NEW  — Next.js 16 request proxy
│                                                     Replaces middleware.js. Node.js runtime
│                                                     (not edge). Handles auth route protection
│                                                     and role-based redirects.
├── next.config.mjs                            ← EXISTS
├── jsconfig.json                              ← EXISTS
├── eslint.config.mjs                          ← EXISTS
├── postcss.config.mjs                         ← EXISTS
└── package.json                               ← EXISTS
```

---

## Route Group Summary

| Group | URL Pattern | Layout | Auth |
|-------|-------------|--------|------|
| `(marketing)` | `/`, `/pricing` | Nav + footer | None |
| `(workspace)` | `/practice`, `/practice/[id]`, `/exam/[sessionId]`, `/join/[token]`, `/results/[sessionId]` | Auth check only — no chrome | Required (any role) |

> **Note:** `(auth)` and `(examiner)` route groups are planned for future phases (Phase 1 and Phase 3 respectively) and are not part of the current implementation scope.

---

## Files Removed / Superseded

| Old Path | Reason |
|----------|--------|
| `app/page.js` | Moved to `app/(marketing)/page.jsx` |
| `app/exam/page.js` | Moved to `app/(workspace)/exam/[sessionId]/page.jsx` |
| `app/practice/page.js` | Moved to `app/(workspace)/practice/[id]/page.jsx` |
| `lib/judge.js` | Moved to `lib/judge/pyodide.js` |
| `lib/workspaceNavigation.mjs` | Moved to `lib/utils/navigation.js` |
| `lib/api.js` | Replaced by `lib/api/` directory (structured API client) |
| `context/ExamContext.js` | Replaced by `store/examStore.js` (Zustand) |
| `lib/assessmentConfig.mjs` | Merged into `lib/api/exams.js` |
| `lib/submissionState.mjs` | Merged into `store/examStore.js` |
| `lib/examSession.mjs` | Merged into `store/examStore.js` |
| `lib/practiceSession.mjs` | Merged into `store/editorStore.js` |
| `lib/questionCatalog.mjs` | Replaced by `lib/api/questions.js` |

---

*End of Document*
