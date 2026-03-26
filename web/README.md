# CodeAssess — Online Assessment Platform

A professional-grade, generic, and scalable online coding assessment platform built with **Next.js 16**, **Tailwind CSS v4**, and an in-browser **Pyodide** (WebAssembly Python) judge engine.

## Quick Start

```bash
cd web
npm install
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | SSR landing, CSR exam IDE |
| Styling | Tailwind CSS v4 | Utility-first dark theme |
| Code Editor | React CodeMirror 6 | Python syntax highlighting |
| Judge Engine | Pyodide 0.27.3 (WASM) | In-browser Python execution |
| State | useReducer + Context | Complex exam state management |
| Persistence | localStorage | Session resume on page reload |

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.js             # Landing page (server component)
│   └── exam/page.js        # Exam IDE (client component)
├── components/
│   ├── exam/               # Exam-specific components
│   │   ├── ExamShell.jsx   # Main exam orchestrator
│   │   ├── Header.jsx      # Timer, score, controls
│   │   ├── Sidebar.jsx     # Question list
│   │   ├── ProblemPanel.jsx # Problem description
│   │   ├── CodePanel.jsx   # Code editor + actions
│   │   ├── OutputPanel.jsx # Test results, console
│   │   └── ResultsScreen.jsx # Exam results overlay
│   └── ui/                 # Reusable UI primitives
│       ├── Toast.jsx       # Notification system
│       ├── Spinner.jsx     # Loading indicator
│       └── Modal.jsx       # Confirmation dialogs
├── context/
│   └── ExamContext.js      # Central exam state (useReducer)
├── hooks/
│   ├── usePyodide.js       # Pyodide WASM lifecycle
│   └── useTimer.js         # Countdown timer
├── lib/
│   ├── api.js              # Data access abstraction layer
│   └── judge.js            # Pyodide execution engine
└── data/
    └── questions.json      # 37 coding challenges
```

## Key Features

- **37 coding challenges** across multiple DSA topics
- **In-browser Python execution** via Pyodide WebAssembly
- **Real exam simulation** with countdown timer and session persistence
- **Instant feedback** with AC/WA/TLE/RE verdicts
- **Custom input testing** for debugging
- **Keyboard shortcuts**: `Ctrl+Enter` (Run), `Ctrl+Shift+Enter` (Submit)
- **Auto-save** code drafts on every keystroke
- **Best submission tracking** across multiple attempts

## Documentation

- [Architecture](../docs/ARCHITECTURE.md) — System design and component hierarchy
- [Judge Engine](../docs/JUDGE.md) — Pyodide integration and execution model
- [Components](../docs/COMPONENTS.md) — Component catalog with props
- [Scaling](../docs/SCALING.md) — Future backend migration path

## Migration from Legacy

This platform was migrated from a legacy single-page HTML/CSS/JS application. Key changes:

- **CodeMirror 5 CDN** → React CodeMirror 6 (npm package)
- **Vanilla CSS** → Tailwind CSS v4 with custom design tokens
- **IIFE modules** → ES modules with React hooks
- **localStorage IIFE** → useReducer + Context with auto-persistence
- **Inline `<script>`** → Modular React components
- **`confirm()` dialogs** → Custom styled Modal components
- **Hardcoded questions** → Externalized JSON with API abstraction
