# CodeAssess — Online Assessment Platform

> A professional-grade technical assessment platform for coding challenges with an integrated in-browser Python judge engine. Built with Next.js 16, React 19, Zustand, and Pyodide WebAssembly.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Pyodide](https://img.shields.io/badge/Pyodide-0.27.3-306998?logo=python)](https://pyodide.org/)

---

## 🎯 Overview

CodeAssess is a modern, client-side web application designed to simulate professional coding assessments. It features 37 curated programming questions with auto-graded test cases, dual modes (practice and exam), and comprehensive session management.

The platform runs entirely in the browser using Pyodide (CPython compiled to WebAssembly) and IndexedDB for persistence, eliminating the need for backend infrastructure while providing accurate Python 3 code evaluation with session recovery.

### Key Features

- **Dual Modes** — Practice mode (unlimited time, all questions) and Exam mode (timed, random selection, integrity guards)
- **37 Curated Questions** — Comprehensive coverage of essential data structures and algorithms
- **In-Browser Python Execution** — Pyodide WebAssembly runtime (CPython 3.12)
- **Auto-Graded Test Cases** — Instant feedback with AC/WA/TLE/RE verdicts
- **Session Persistence** — Auto-save with IndexedDB recovery on page refresh
- **Real-Time Scoring** — Best submission tracking per question
- **Exam Integrity Guards** — Fullscreen enforcement, tab-switch detection, clipboard blocking
- **Results Tracking** — Completed exam history with detailed analytics
- **Professional UI** — Dark theme with IDE-style resizable panels and smooth animations

---

## 📁 Project Structure

```
CodeAssess/
│
├── README.md                          # This file
├── docs/                              # Comprehensive documentation
│   ├── ARCHITECTURE.md                # System design & component hierarchy
│   ├── COMPONENTS.md                  # Component catalog with props & features
│   ├── FOLDER-STRUCTURE.md            # Detailed folder organization
│   ├── CODING-STANDARDS.md            # Coding conventions and patterns
│   ├── JUDGE.md                       # Pyodide integration & execution details
│   ├── SCALING.md                     # Full-stack migration blueprint
│   ├── PROMPT.md                      # Migration objectives
│   ├── guides/                        # Step-by-step implementation guides
│   │   ├── README.md                  # Guide index & Phase overview
│   │   ├── PHASE-0-FOUNDATION.md      # Infrastructure setup
│   │   └── ...                        # Phases 1-6 & AI Agent Prompt
│   ├── docx/                          # Preparation guides (Word format)
│   └── pdf/                           # Preparation guides (PDF format)
│
├── legacy/                            # Original vanilla HTML/JS implementation
│   ├── index.html                     # Single-page app shell
│   ├── README.md                      # Legacy documentation
│   └── assets/
│       ├── css/styles.css             # Dark industrial theme
│       └── js/
│           ├── questions.js           # 37 hardcoded questions
│           ├── judge.js               # Pyodide execution engine
│           └── examEngine.js          # State, timer, scoring
│
└── web/                               # Modern Next.js 16 application
    ├── package.json                   # Dependencies
    ├── next.config.mjs                # Next.js configuration
    │
    └── src/
        ├── app/                       # Next.js app router
        │   ├── (marketing)/           # Public pages (SSG)
        │   │   ├── page.js            # Landing page
        │   │   ├── about/             # About page
        │   │   └── help/              # Help/FAQ page
        │   └── (workspace)/           # Protected workspace routes
        │       ├── practice/          # Practice mode
        │       ├── exam/              # Exam mode
        │       ├── join/              # Invitation token flow
        │       └── results/           # Results tracking
        │
        ├── components/
        │   ├── ui/                    # Reusable UI primitives
        │   ├── marketing/             # Landing page sections
        │   ├── workspace/             # Shared IDE components
        │   ├── practice/              # Practice-specific components
        │   ├── exam/                  # Exam-specific components
        │   └── results/               # Results display components
        │
        ├── stores/                    # Zustand vanilla stores
        │   ├── examStore.js           # Exam session state
        │   └── practiceStore.js       # Practice workspace state
        │
        ├── providers/                 # React context providers
        │   ├── ExamStoreProvider.jsx  # Exam store context
        │   └── PracticeStoreProvider.jsx
        │
        ├── hooks/
        │   ├── usePyodide.js          # Pyodide runtime management
        │   ├── useTimer.js            # Countdown timer
        │   └── useExamIntegrityGuards.js
        │
        ├── lib/
        │   ├── repositories/          # Data access layer
        │   ├── session/               # Session state logic
        │   ├── assessment/            # Question selection logic
        │   ├── execution/             # Code execution (Pyodide)
        │   ├── storage/               # IndexedDB abstraction
        │   ├── workspace/             # Workspace utilities
        │   └── use-cases/             # Business workflows
        │
        └── data/
            ├── questions.json         # 37 questions with test cases
            └── exam/blueprints.js     # Exam configurations
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd CodeAssess

# Navigate to the Next.js app
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Legacy Version

For the original vanilla JavaScript implementation:

```bash
# Navigate to legacy folder
cd legacy

# Serve with any HTTP server
python3 -m http.server 8080
# or
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🧠 Question Bank

### 37 Curated Programming Questions

The platform includes a comprehensive question bank covering essential data structures and algorithms:

**Topics Covered:**
- **Arrays** — Move Zeros, Second Largest, Dutch National Flag, Array Rotation, Sliding Window Maximum, Trapping Rain Water, Kadane's Algorithm
- **Strings** — Palindrome Check, Anagram Detection, First Non-Repeating Character, Caesar Cipher, Valid Parentheses
- **Math** — Fibonacci, Prime Check, Factorial, Sum of Digits
- **Data Structures** — Binary Search, Stack Simulation, Linked List Reversal
- **Algorithms** — Jump Game, Permutations, Frequency Counter
- **Dynamic Programming** — Longest Common Subsequence, Coin Change
- **Graphs** — BFS (Minimum Steps in Grid)
- **2D Arrays** — Matrix Spiral Traversal
- **Sorting** — Bubble Sort

**Difficulty Distribution:**
- Easy: 22 questions
- Medium: 14 questions
- Hard: 1 question

---

## 🏗️ Architecture

### Current Architecture (Client-Side)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Browser                                     │
│                                                                          │
│  ┌─────────────────┐         ┌──────────────────────────────────────┐   │
│  │  Marketing      │         │         Workspace Routes             │   │
│  │  (SSG)          │         │                                      │   │
│  │  /, /about,     │         │  ┌────────────────────────────────┐  │   │
│  │  /help          │────────>│  │  Practice (/practice)          │  │   │
│  └─────────────────┘         │  │  - PracticeStoreProvider       │  │   │
│                              │  │  - Question browser & IDE      │  │   │
│                              │  │  - Unlimited time              │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              │                                      │   │
│                              │  ┌────────────────────────────────┐  │   │
│                              │  │  Exam (/exam)                  │  │   │
│                              │  │  - ExamStoreProvider           │  │   │
│                              │  │  - Timed session (90 min)      │  │   │
│                              │  │  - Integrity guards            │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              │                                      │   │
│                              │  ┌────────────────────────────────┐  │   │
│                              │  │  Join (/join)                  │  │   │
│                              │  │  - Token validation            │  │   │
│                              │  │  - Session provisioning        │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              │                                      │   │
│                              │  ┌────────────────────────────────┐  │   │
│                              │  │  Results (/results)            │  │   │
│                              │  │  - Completed session views     │  │   │
│                              │  │  - Analytics & history         │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              └──────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    Data & Persistence Layer                    │     │
│  │                                                                │     │
│  │  ┌──────────────┐    ┌──────────────┐    ┌────────────────┐  │     │
│  │  │ Repositories │───>│  IndexedDB   │    │  Pyodide WASM  │  │     │
│  │  │  - Question  │    │  - examSessions   │  - Python exec │  │     │
│  │  │  - ExamSess  │    │  - practiceWork   │  - Judge logic │  │     │
│  │  │  - Practice  │    │                │    │                │  │     │
│  │  │  - ExamAccess│    │                │    │                │  │     │
│  │  └──────────────┘    └──────────────┘    └────────────────┘  │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │              Static Data (questions.json, blueprints)          │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
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

### State Management

**Architecture Pattern:**
- **Zustand Vanilla Stores** — Pure state logic without React dependency
- **React Context Providers** — Wrap stores for React integration
- **Repository Pattern** — Abstract persistence (IndexedDB today, API tomorrow)
- **Route-Scoped State** — Each route family owns its state tree

**Practice Store:**
```javascript
{
  questions: Question[],
  workspace: {
    draftsByQuestionId: { [id]: { code, language, updatedAt } },
    submissionsByQuestionId: { [id]: { code, score, passed, total } },
  },
  summary: { totalScore, maxScore, attemptedCount, solvedCount },
}
```

**Exam Store:**
```javascript
{
  activeSession: {
    assessment: { blueprintId, title, durationSeconds, questionIds },
    lifecycle: { status, startedAt, finishedAt },
    workspace: { draftsByQuestionId, submissionsByQuestionId },
    integrity: { violations: [{ type, timestamp }] },
    summary: { totalScore, maxScore, totalPassed, totalCases },
  },
}
```

---

## 🐍 Python Runtime

### Pyodide Integration

| Property | Value |
|----------|-------|
| Runtime | Pyodide 0.27.3 (CPython 3.12) |
| Delivery | WebAssembly via CDN (cdn.jsdelivr.net) |
| Available stdlib | Full Python standard library |
| Per-case timeout | 8 seconds |
| Execution | Browser-side, no server needed |

### Execution Flow

1. **Loading Phase**
   - Next.js loads Pyodide script via `<Script>` tag (afterInteractive)
   - `usePyodide` hook polls for `window.loadPyodide`
   - Initializes runtime (~10-15 MB WASM download, cached)
   - Installs Python execution harness (`_run_user_code`)

2. **Test Case Execution**
   - For each test case: `Promise.race([execution, 8s timeout])`
   - Redirects `sys.stdin` to test input
   - Captures `sys.stdout` for comparison
   - Handles exceptions and `SystemExit` gracefully

3. **Output Normalization**
   - Trim trailing spaces per line
   - Strip leading/trailing blank lines
   - Compare normalized actual vs expected

4. **Verdict Types**

| Verdict | Condition | Color |
|---------|-----------|-------|
| **AC** | Output matches expected | Green ✓ |
| **WA** | Output doesn't match | Red ✗ |
| **TLE** | Execution > 8 seconds | Yellow ⏱ |
| **RE** | Python exception thrown | Orange ⚠ |

### Scoring

```javascript
score = Math.round((passed / total) × question.maxScore)
```

- **Run Samples**: Runs only visible sample cases (no scoring)
- **Submit**: Runs all cases (sample + hidden), calculates score
- **Best submission**: Only recorded if `newScore >= existingScore`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Run sample test cases |
| `Ctrl/Cmd + Shift + Enter` | Submit (run all cases) |
| `Ctrl + /` | Toggle comment on selected lines |
| `Tab` | Insert 4 spaces |

---

## 🎨 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Next.js | 16.2.1 | App Router, SSR, route groups |
| **UI Library** | React | 19.2.4 | Component-based UI |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS framework |
| **Code Editor** | @uiw/react-codemirror | 4.25.9 | Python syntax highlighting |
| **Resizable Panels** | react-resizable-panels | 4.7.6 | IDE-style adjustable layout |
| **Icons** | lucide-react | 1.7.0 | Modern UI SVG icons |
| **Python Runtime** | Pyodide | 0.27.3 | WebAssembly CPython 3.12 |
| **State Management** | Zustand | 5.0.12 | Vanilla stores + React context |
| **Persistence** | IndexedDB | — | Session recovery & workspace storage |
| **Fonts** | Google Fonts | — | Sora, Space Grotesk, JetBrains Mono |

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — System design, component hierarchy, data flow, state management patterns
- **[COMPONENTS.md](docs/COMPONENTS.md)** — Component catalog with props, features, usage examples
- **[FOLDER-STRUCTURE.md](docs/FOLDER-STRUCTURE.md)** — Detailed folder organization and file conventions
- **[CODING-STANDARDS.md](docs/CODING-STANDARDS.md)** — Coding conventions, patterns, and best practices
- **[JUDGE.md](docs/JUDGE.md)** — Pyodide integration, execution harness, security considerations
- **[SCALING.md](docs/SCALING.md)** — Full-stack migration blueprint (database schema, API design, deployment)
- **[PROMPT.md](docs/PROMPT.md)** — Migration objectives and implementation requirements
- **[guides/](docs/guides/)** — Step-by-step implementation guides for full-stack migration

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

**See [SCALING.md](docs/SCALING.md) for the complete migration blueprint and `docs/guides/` for the step-by-step execution plan.**

---

## 🛠️ Customization

### Add a New Question

Edit `web/src/data/questions.json`:

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

Edit `web/src/lib/session/examSession.mjs`:

```javascript
export const EXAM_DURATION_SECONDS = 90 * 60; // Change 90 to desired minutes
```

### Adjust Per-Case Timeout

Edit `web/src/lib/execution/pyodideJudge.js`:

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

---

## 🔒 Security Considerations

### Current (In-Browser) Security

- Code runs in the user's own browser — no server attack surface
- Execution is sandboxed within the Pyodide WASM runtime
- `exec()` uses an empty namespace `{}` — no access to application state
- TLE protection via `Promise.race` prevents infinite loops from hanging the UI
- Exam integrity guards: fullscreen enforcement, tab-switch detection, clipboard blocking

### Exam Integrity Features

- **Fullscreen Requirement** — Exam pauses if candidate exits fullscreen
- **Tab Switch Detection** — Warns candidates when switching tabs
- **Clipboard Blocking** — Prevents copy/paste during exam
- **Context Menu Blocking** — Disables right-click menu
- **Violation Tracking** — Records integrity violations with timestamps
- **Auto-Termination** — Ends exam after 3 violations

### Limitations

- No memory limit enforcement (Pyodide uses browser's WASM memory)
- File system access is limited but not fully restricted
- Network requests from user code are possible (though unusual in a coding exam)
- Integrity guards can be bypassed by determined users (client-side enforcement)

### Future Remote Judge Security

When migrating to a backend judge:
- Execute in **Docker containers** with CPU/memory/network limits
- Use **seccomp** and **cgroups** for syscall filtering
- Implement **per-test-case timeouts** server-side
- Sandbox file system access with read-only mounts
- Server-side proctoring and integrity monitoring

---

## 📊 Result Interpretation

| Score Range | Interpretation |
|-------------|---------------|
| 3300–3700 | Exceptional — Strong problem-solving skills across all topics |
| 2600–3299 | Strong — Solid understanding with room for optimization |
| 1800–2599 | Moderate — Revisit greedy algorithms, DP, and string manipulation |
| Below 1800 | Needs improvement — Focus on fundamental data structures and algorithms |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Pyodide** — WebAssembly Python runtime
- **Next.js** — React framework for production
- **Tailwind CSS** — Utility-first CSS framework
- **CodeMirror** — Code editor component
- **React** — UI library
- **Zustand** — State management

---

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**A modern platform for coding assessment practice and evaluation.**
