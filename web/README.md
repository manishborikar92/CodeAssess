# CodeAssess — Modern Next.js Implementation

> A professional-grade, scalable online coding assessment platform built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and an in-browser **Pyodide** (WebAssembly Python) judge engine.

This is the modern implementation of CodeAssess. For the original vanilla JavaScript version, see the [`/legacy`](../legacy) directory.

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

### Linting

```bash
npm run lint
```

## 🎨 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Next.js | 16.2.1 | App Router, SSR, API routes |
| **UI Library** | React | 19.2.4 | Component-based UI |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS framework |
| **Code Editor** | @uiw/react-codemirror | 4.25.9 | Python syntax highlighting |
| **Resizing Engine** | react-resizable-panels | 4.7.6 | IDE-style adjustable layout |
| **Icons** | lucide-react | 1.7.0 | Modern UI SVG icons |
| **Python Runtime** | Pyodide | 0.27.3 | WebAssembly CPython 3.12 |
| **State Management** | React Context + useReducer | — | Exam state, drafts, submissions |
| **Fonts** | Google Fonts | — | Sora, Space Grotesk, JetBrains Mono |
| **Persistence** | localStorage | — | Session recovery |

## 🏗️ Architecture

### Directory Structure

```
web/
├── package.json                   # Dependencies
├── next.config.mjs                # Next.js configuration
├── postcss.config.mjs             # PostCSS configuration
├── jsconfig.json                  # JavaScript path aliases
├── eslint.config.mjs              # ESLint configuration
│
└── src/
    ├── app/
    │   ├── layout.js              # Root layout (fonts, Pyodide script)
    │   ├── page.js                # Landing page (SSR)
    │   ├── globals.css            # Global Tailwind styles
    │   └── exam/
    │       └── page.js            # Exam page (CSR)
    │
    ├── components/
    │   ├── exam/
    │   │   ├── ExamShell.jsx      # Main orchestrator
    │   │   ├── Header.jsx         # Top bar with timer
    │   │   ├── Sidebar.jsx        # Question list
    │   │   ├── ProblemPanel.jsx   # Problem description
    │   │   ├── CodePanel.jsx      # Code editor
    │   │   ├── OutputPanel.jsx    # Results & console
    │   │   └── ResultsScreen.jsx  # Final results
    │   │
    │   └── ui/
    │       ├── Modal.jsx          # Confirmation dialog
    │       ├── Toast.jsx          # Notifications
    │       └── Spinner.jsx        # Loading indicator
    │
    ├── context/
    │   └── ExamContext.js         # State management (useReducer + Context)
    │
    ├── hooks/
    │   ├── usePyodide.js          # Pyodide runtime management
    │   └── useTimer.js            # Countdown timer
    │
    ├── lib/
    │   ├── api.js                 # Data access abstraction layer
    │   └── judge.js               # Pyodide execution wrapper
    │
    └── data/
        └── questions.json         # 37 questions with test cases
```

### Component Hierarchy

```
RootLayout
├── LandingPage (Server Component)
│   ├── Hero section
│   ├── Stats grid
│   └── Feature cards
│
└── ExamPage (Client Component)
    └── ExamProvider (Context)
        └── ExamShell (orchestrator)
            ├── Header (timer, score, question counter)
            ├── Sidebar (question list with status dots)
            ├── ProblemPanel (problem description, test cases)
            ├── CodePanel (React CodeMirror editor)
            ├── OutputPanel (test results, console, custom input)
            ├── ResultsScreen (final score breakdown)
            ├── Modal (End Exam, Reset Code)
            └── Toast (notifications)
```

## ✨ Key Features

- **37 Curated Questions** — 25 confirmed from previous TCS NQT papers + 12 high-probability predictions
- **In-Browser Python Execution** — Pyodide WebAssembly runtime (CPython 3.12)
- **Auto-Graded Test Cases** — Instant feedback with AC/WA/TLE/RE verdicts
- **Session Persistence** — Auto-save with localStorage recovery on page refresh
- **Real-Time Scoring** — Best submission tracking per question
- **90-Minute Timer** — Countdown with warning states (< 15min, < 5min)
- **Custom Input Testing** — Debug with your own test cases
- **Keyboard Shortcuts** — `Ctrl+Enter` (Run), `Ctrl+Shift+Enter` (Submit)
- **Professional UI** — Dark theme with fully adjustable, resizable split panels (IDE-style)
- **Resizable Panels** — Drag-to-resize horizontal and vertical dividers with smooth transitions
- **Animated Sidebar Drawer** — Slides in from left with backdrop, 420px width, smooth animations
- **Question Navigation** — Toggle sidebar overlay with header button or click backdrop to close

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
| **State Management** | IIFE with closures | useReducer + Context API |
| **Components** | Inline `<script>` | Modular React components |
| **Dialogs** | `confirm()` / `alert()` | Custom styled Modal components |
| **Data Layer** | Hardcoded in JS | Externalized JSON with API abstraction |
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

Edit `src/context/ExamContext.js`:

```javascript
const initialState = {
  // ...
  totalDuration: 90 * 60, // Change 90 to desired minutes
};
```

### Adjust Per-Case Timeout

Edit `src/hooks/usePyodide.js`:

```javascript
const runTestCase = async (code, input, expected, timeout = 8000) => {
  // Change 8000 to desired milliseconds
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
