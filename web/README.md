# CodeAssess — Modern Next.js Implementation

> A professional-grade, scalable online coding assessment platform built with **Next.js 16**, **React 19**, **Zustand**, **Tailwind CSS v4**, and an in-browser **Pyodide** (WebAssembly Python) judge engine.

This is the modern implementation of CodeAssess with dual modes (practice and exam), comprehensive session management, and exam integrity guards. For the original vanilla JavaScript version, see the [`/legacy`](../legacy) directory.

## 🚀 Quick Start

### Development

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting & Testing

```bash
# Run ESLint
npm run lint

# Run tests
npm run test
```

## 🎨 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Next.js | 16.2.1 | App Router, SSR, route groups |
| **UI Library** | React | 19.2.4 | Component-based UI |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS framework |
| **Code Editor** | @uiw/react-codemirror | 4.25.9 | Python syntax highlighting |
| **Resizing Engine** | react-resizable-panels | 4.7.6 | IDE-style adjustable layout |
| **Icons** | lucide-react | 1.7.0 | Modern UI SVG icons |
| **Python Runtime** | Pyodide | 0.27.3 | WebAssembly CPython 3.12 |
| **State Management** | Zustand | 5.0.12 | Vanilla stores + React context |
| **Persistence** | IndexedDB | — | Session recovery & workspace storage |
| **Fonts** | Google Fonts | — | Sora, Space Grotesk, JetBrains Mono |

## 🏗️ Architecture

### Directory Structure

```
web/
├── package.json                   # Dependencies
├── next.config.mjs                # Next.js configuration
├── postcss.config.mjs             # PostCSS configuration
├── jsconfig.json                  # JavaScript path aliases (@/* → src/*)
├── eslint.config.mjs              # ESLint configuration
│
└── src/
    ├── app/                       # Next.js app router
    │   ├── (marketing)/           # Public pages (SSG)
    │   │   ├── page.js            # Landing page
    │   │   ├── about/             # About page
    │   │   └── help/              # Help/FAQ page
    │   │
    │   ├── (workspace)/           # Protected workspace routes
    │   │   ├── practice/          # Practice mode
    │   │   │   ├── page.js        # Question browser
    │   │   │   ├── [id]/          # Practice IDE
    │   │   │   └── progress/      # Progress summary
    │   │   │
    │   │   ├── exam/              # Exam mode
    │   │   │   ├── page.js        # Exam lobby
    │   │   │   └── [sessionId]/   # Active exam session
    │   │   │
    │   │   ├── join/              # Invitation token flow
    │   │   │   ├── page.js        # Token input
    │   │   │   └── [token]/       # Token resolver
    │   │   │
    │   │   └── results/           # Results tracking
    │   │       ├── page.js        # Results list
    │   │       └── [sessionId]/   # Individual result
    │   │
    │   ├── layout.js              # Root layout (fonts, metadata)
    │   ├── loading.js             # Global loading state
    │   ├── not-found.js           # 404 page
    │   ├── error.js               # Error boundary
    │   └── globals.css            # Global Tailwind styles
    │
    ├── components/
    │   ├── ui/                    # Reusable primitives
    │   ├── marketing/             # Landing page sections
    │   ├── workspace/             # Shared IDE components
    │   ├── practice/              # Practice-specific components
    │   ├── exam/                  # Exam-specific components
    │   └── results/               # Results display components
    │
    ├── stores/                    # Zustand vanilla stores
    │   ├── examStore.js           # Exam session state
    │   ├── practiceStore.js       # Practice workspace state
    │   └── internal/              # Store utilities
    │
    ├── providers/                 # React context providers
    │   ├── ExamStoreProvider.jsx  # Exam store context
    │   └── PracticeStoreProvider.jsx
    │
    ├── hooks/                     # Custom React hooks
    │   ├── usePyodide.js          # Pyodide runtime management
    │   ├── useTimer.js            # Countdown timer
    │   └── useExamIntegrityGuards.js
    │
    ├── lib/                       # Business logic & utilities
    │   ├── repositories/          # Data access layer
    │   ├── session/               # Session state logic
    │   ├── assessment/            # Question selection logic
    │   ├── execution/             # Code execution (Pyodide)
    │   ├── storage/               # IndexedDB abstraction
    │   ├── workspace/             # Workspace utilities
    │   └── use-cases/             # Business workflows
    │
    └── data/                      # Static data
        ├── questions.json         # 37 questions with test cases
        └── exam/blueprints.js     # Exam configurations
```

### Component Hierarchy

```
RootLayout (fonts, metadata)
│
├── MarketingLayout (Header + Footer)
│   ├── HomePage (Hero, Modes, Features, Flow)
│   ├── AboutPage
│   └── HelpPage
│
└── WorkspaceLayout (Pyodide script)
    ├── PracticeLayout (PracticeStoreProvider)
    │   ├── PracticeQuestionBrowser
    │   ├── PracticeWorkspaceClient (IDE)
    │   └── PracticeProgressPage
    │
    ├── ExamLayout (ExamStoreProvider)
    │   ├── ExamStartPageClient (lobby)
    │   ├── ExamSessionClient (IDE)
    │   └── ExamResultsScreen
    │
    ├── JoinLayout
    │   ├── JoinTokenForm
    │   └── JoinTokenResolver
    │
    └── ResultsLayout
        ├── ResultsListClient
        └── SessionResultClient
```

### Shared IDE Components (WorkspaceChrome)

Both practice and exam modes use the same IDE layout:

```
WorkspaceChrome
├── WorkspaceHeader (navigation, timer, score, actions)
├── QuestionSidebar (animated overlay drawer)
├── ProblemPanel (problem description, test cases)
├── CodePanel (React CodeMirror editor)
└── OutputPanel (test results, console, custom input)
```

## ✨ Key Features

### Practice Mode
- **Unlimited Time** — Practice at your own pace without time pressure
- **All 37 Questions** — Access the complete question catalog
- **Progress Tracking** — Track solved questions, scores, and drafts
- **Auto-Save** — Drafts and submissions saved automatically to IndexedDB
- **Question Navigation** — Previous, next, and random shuffle buttons
- **Progress Dashboard** — View detailed progress summary and question breakdown

### Exam Mode
- **Timed Sessions** — 90-minute countdown timer with warning states
- **Random Question Selection** — 2 questions randomly selected at start
- **Integrity Guards** — Fullscreen enforcement, tab-switch detection, clipboard blocking
- **Violation Tracking** — Records integrity violations with auto-termination after 3 warnings
- **Session Recovery** — Resume active sessions after page refresh
- **Immutable Results** — Completed sessions become read-only snapshots

### Code Execution
- **In-Browser Python** — Pyodide WebAssembly runtime (CPython 3.12)
- **Auto-Graded Test Cases** — Instant feedback with AC/WA/TLE/RE verdicts
- **Run Samples** — Test with visible sample cases
- **Submit All** — Run all test cases (visible + hidden) for scoring
- **Custom Input** — Debug with your own test cases
- **Timeout Protection** — 8-second per-case timeout prevents infinite loops

### User Experience
- **Professional UI** — Dark industrial theme with precision aesthetics
- **IDE-Style Layout** — Resizable panels (problem, code, output)
- **Animated Sidebar** — Smooth slide-in drawer with question list
- **Keyboard Shortcuts** — `Ctrl+Enter` (Run), `Ctrl+Shift+Enter` (Submit)
- **Toast Notifications** — Real-time feedback for actions
- **Loading States** — Pyodide initialization overlay
- **Error Handling** — Global error boundary with retry functionality

## 📚 Documentation

For comprehensive documentation, see:

- **[Main README](../README.md)** — Project overview and quick start
- **[Architecture](../docs/ARCHITECTURE.md)** — System design and component hierarchy
- **[Judge Engine](../docs/JUDGE.md)** — Pyodide integration and execution model
- **[Components](../docs/COMPONENTS.md)** — Component catalog with props and features
- **[Scaling](../docs/SCALING.md)** — Full-stack migration blueprint
- **[Implementation Guides](../docs/guides/README.md)** — Step-by-step execution plan

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Run sample test cases |
| `Ctrl/Cmd + Shift + Enter` | Submit (run all cases) |
| `Ctrl + /` | Toggle comment on selected lines |
| `Tab` | Insert 4 spaces |

---

## 🔄 Migration from Legacy

This platform was migrated from a legacy single-page HTML/CSS/JS application. Key improvements:

| Aspect | Legacy | Modern |
|--------|--------|--------|
| **Framework** | Vanilla HTML/JS | Next.js 16 + React 19 |
| **Styling** | Vanilla CSS | Tailwind CSS 4 |
| **Code Editor** | CodeMirror 5 (CDN) | React CodeMirror 6 (npm) |
| **State Management** | IIFE with closures | Zustand + React Context |
| **Components** | Inline `<script>` | Modular React components |
| **Dialogs** | `confirm()` / `alert()` | Custom styled Modal components |
| **Data Layer** | Hardcoded in JS | Repository pattern with IndexedDB |
| **Persistence** | localStorage | IndexedDB with structured schema |
| **Modes** | Exam only | Practice + Exam + Results |
| **Type Safety** | None | TypeScript-ready structure |

See the [`/legacy`](../legacy) directory for the original implementation.

---

## 🛠️ Customization

### Add a New Question

Edit `src/data/questions.json`:

```json
{
  "id": 38,
  "title": "Your Question Title",
  "section": "B",
  "topic": "Topic Name",
  "difficulty": "Easy",
  "maxScore": 100,
  "scenario": "Story context here.",
  "statement": "Formal problem statement.",
  "constraints": ["1 ≤ N ≤ 1000"],
  "inputFormat": "Line 1: N",
  "outputFormat": "Print the answer.",
  "sampleCases": [
    { "input": "5", "output": "25", "explanation": "5² = 25." }
  ],
  "hiddenCases": [
    { "input": "1", "output": "1" },
    { "input": "10", "output": "100" }
  ],
  "hint": "Multiply n by itself.",
  "starterCode": "def solve():\n    n = int(input())\n    # Write here\nsolve()"
}
```

### Change Exam Duration

Edit `src/lib/session/examSession.mjs`:

```javascript
export const EXAM_DURATION_SECONDS = 90 * 60; // Change 90 to desired minutes
```

### Adjust Per-Case Timeout

Edit `src/lib/execution/pyodideJudge.js`:

```javascript
export async function runTestCase(
  code,
  input,
  expectedOutput,
  timeoutMs = 8000 // Change 8000 to desired milliseconds
) {
  // ...
}
```

### Modify Integrity Policy

Edit `src/data/exam/blueprints.js`:

```javascript
integrityPolicy: {
  requireFullscreen: true,      // Enforce fullscreen mode
  detectTabSwitch: true,        // Detect tab switches
  blockClipboard: true,         // Block copy/paste
  blockContextMenu: true,       // Block right-click
  warnBeforeUnload: true,       // Warn before leaving page
  maxViolations: 3,             // Max violations before termination
}
```

---

## 🔮 Future Roadmap (Scaling Blueprint)

The project is currently embarking on a full-stack migration to a production-grade assessment platform.

### Phase 0: Foundation
- NestJS backend scaffold + Docker (PostgreSQL, Redis) + Prisma schema

### Phase 1: Authentication & User Management
- NextAuth.js + JWT auth with Redis blocklist + Role-Based Access Control

### Phase 2: Question Bank & Practice Mode
- Question CRUD API + DB-driven Practice Mode + Examiner Dashboard

### Phase 3: Exam Management
- Exam CRUD + Invitations + Session lifecycles + Auto-save drafts

### Phase 4: Remote Judge Engine
- Docker-based sandboxed judge for 5 languages + BullMQ + WebSockets

### Phase 5: Monitoring & Analytics
- Live exam dashboard + Proctoring events + Analytics + Leaderboards

### Phase 6: Production Hardening
- Rate limiting + Security Audit + CI/CD + Load Testing + Tracing

**See [SCALING.md](../docs/SCALING.md) for the complete migration blueprint and `docs/guides/` for the step-by-step execution plan.**

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

*Built for TCS NQT 2025–26 preparation. All questions sourced from confirmed previous-year papers and high-probability predictions.*
