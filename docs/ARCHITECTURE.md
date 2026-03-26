# System Architecture

## Overview

CodeAssess is a client-heavy application where the landing page is server-rendered (Next.js SSR) and the exam IDE is a fully client-side React application. The judge engine runs entirely in the browser via Pyodide WebAssembly.

## Current Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                                                              │
│  ┌──────────────┐    ┌──────────────────────────────────┐    │
│  │  Landing     │    │         Exam IDE                 │    │
│  │  Page (SSR)  │───>│  ┌────────────────────────────┐  │    │
│  │  /           │    │  │     ExamContext            │  │    │
│  └──────────────┘    │  │  (useReducer + Context)    │  │    │
│                      │  │  ┌─────┐ ┌──────┐ ┌──────┐ │  │    │
│                      │  │  │State│ │Drafts│ │Submit│ │  │    │
│                      │  │  └──┬──┘ └───┬──┘ └───┬──┘ │  │    │
│                      │  └─────┼────────┼────────┼────┘  │    │
│                      │        │        │        │       │    │
│                      │  ┌─────▼────────▼────────▼────┐  │    │
│                      │  │     localStorage           │  │    │
│                      │  │     (session persistence)  │  │    │
│                      │  └────────────────────────────┘  │    │
│                      │                                  │    │
│                      │  ┌────────────────────────────┐  │    │
│                      │  │  Pyodide (WASM Python)     │  │    │
│                      │  │  - Code execution          │  │    │
│                      │  │  - TLE detection           │  │    │
│                      │  │  - Output normalization    │  │    │
│                      │  └────────────────────────────┘  │    │
│                      └──────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐      │
│  │              questions.json (static data)          │      │
│  └────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

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
            ├── Header
            │   └── Timer (via useTimer hook)
            ├── Sidebar
            │   └── Question items (with status dots)
            ├── ProblemPanel
            │   └── Problem description, test cases
            ├── CodePanel
            │   └── React CodeMirror editor
            ├── OutputPanel
            │   ├── Test Results tab
            │   ├── Console tab
            │   └── Custom Input tab
            ├── ResultsScreen (overlay)
            ├── Modal (End Exam, Reset Code)
            └── Toast (notifications)
```

## State Management

### State Shape

```javascript
{
  status: 'idle' | 'active' | 'finished',
  startTime: ISO string | null,
  currentQuestionIndex: number,
  questions: Question[],
  submissions: { [questionId]: Submission },
  drafts: { [questionId]: string },
  totalDuration: number (seconds),
}
```

### Data Flow

```
User Action → dispatch(action) → examReducer → new state
                                      ↓
                              auto-persist (debounced)
                                      ↓
                               localStorage
```

### Action Catalog

| Action | Trigger | Effect |
|--------|---------|--------|
| `LOAD_QUESTIONS` | App mount | Populate questions array |
| `START_EXAM` | User clicks "Begin Exam" | Set active, record startTime |
| `FINISH_EXAM` | Timer expires / user ends | Set finished |
| `SET_QUESTION` | Sidebar click | Update currentQuestionIndex |
| `SAVE_DRAFT` | Code editor change | Persist code string |
| `RECORD_SUBMISSION` | Submit completes | Store best submission |
| `RESTORE_SESSION` | Page reload | Load from localStorage |
| `CLEAR_SESSION` | New exam start | Reset all state |

## Data Access Layer

All data operations are abstracted through `lib/api.js`:

```javascript
// Currently: local JSON + localStorage
getQuestions()           // → questions.json import
getExamConfig()          // → derived from questions
submitSolution(...)      // → no-op (future: POST)
loadSession()            // → localStorage.getItem
saveSession(state)       // → localStorage.setItem
clearSession()           // → localStorage.removeItem
```

This abstraction enables seamless backend migration by swapping implementations.

## Future Full-Stack Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────>│   Next.js    │────>│  Database    │
│   (React)    │     │   API Routes │     │  (Postgres)  │
│              │     │              │     │              │
│  CodeMirror  │     │  /api/       │     │  questions   │
│  Pyodide*    │     │  questions   │     │  users       │
│              │     │  submissions │     │  submissions │
│              │     │  sessions    │     │  sessions    │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                    ┌───────▼───────┐
                    │  Remote Judge │
                    │  (Docker/K8s) │
                    │  - Sandboxed  │
                    │  - Multi-lang │
                    └───────────────┘

* Pyodide can be retained as fallback / offline mode
```
