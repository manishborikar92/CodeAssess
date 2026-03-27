# CodeAssess — Online Assessment Platform

> A professional-grade technical assessment platform for coding challenges with an integrated in-browser Python judge engine. Built with Next.js 16, React 19, and Pyodide WebAssembly.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Pyodide](https://img.shields.io/badge/Pyodide-0.27.3-306998?logo=python)](https://pyodide.org/)

---

## 🎯 Overview

CodeAssess is a modern, client-heavy web application designed to simulate professional coding assessments. Originally built for TCS NQT exam preparation, it features 37 curated programming questions with auto-graded test cases, real-time scoring, and a 90-minute countdown timer.

The platform runs entirely in the browser using Pyodide (CPython compiled to WebAssembly), eliminating the need for backend infrastructure while providing accurate Python 3 code evaluation.

### Key Features

- **37 Curated Questions** — 25 confirmed from previous TCS NQT papers + 12 high-probability predictions
- **In-Browser Python Execution** — Pyodide WebAssembly runtime (CPython 3.12)
- **Auto-Graded Test Cases** — Instant feedback with AC/WA/TLE/RE verdicts
- **Session Persistence** — Auto-save with localStorage recovery on page refresh
- **Real-Time Scoring** — Best submission tracking per question
- **Professional UI** — Dark theme with responsive layout, code editor, and results dashboard

---

## 📁 Project Structure

```
tcs-nqt-exam/
│
├── README.md                          # This file
├── docs/                              # Comprehensive documentation
│   ├── ARCHITECTURE.md                # System design & component hierarchy
│   ├── COMPONENTS.md                  # Component catalog with props & features
│   ├── JUDGE.md                       # Pyodide integration & execution details
│   ├── SCALING.md                     # Full-stack migration blueprint
│   ├── PROMPT.md                      # Migration objectives
│   ├── docx/                          # TCS NQT preparation guides (Word)
│   └── pdf/                           # TCS NQT preparation guides (PDF)
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
        ├── app/
        │   ├── layout.js              # Root layout (fonts, Pyodide script)
        │   ├── page.js                # Landing page (SSR)
        │   └── exam/page.js           # Exam IDE (CSR)
        │
        ├── components/
        │   ├── exam/                  # Exam UI components
        │   └── ui/                    # Reusable UI primitives
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

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tcs-nqt-exam

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

### Section A — Confirmed from Previous Papers (Q1–Q25)

Topics include:
- Arrays (Move Zeros, Second Largest, Dutch National Flag, Array Rotation)
- Strings (Palindrome Check, Anagram Detection, First Non-Repeating Character)
- Math (Fibonacci, Prime Check, Factorial, Sum of Digits)
- Data Structures (Binary Search, Stack Simulation, Linked List Reversal)
- Algorithms (Jump Game, Permutations, Frequency Counter)

### Section B — Predicted High-Probability Topics (Q26–Q37)

Topics include:
- Advanced Arrays (Sliding Window Maximum, Trapping Rain Water, Kadane's Algorithm)
- Dynamic Programming (Longest Common Subsequence, Coin Change)
- Graphs (BFS — Minimum Steps in Grid)
- Strings (Caesar Cipher, Valid Parentheses)
- 2D Arrays (Matrix Spiral Traversal)
- Sorting (Bubble Sort)

**Difficulty Distribution:**
- Easy: 22 questions
- Medium: 14 questions
- Hard: 1 question

---

## 🏗️ Architecture

### Current Architecture (Client-Side)

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

### State Management

**State Shape:**
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

**Key Actions:**
- `LOAD_QUESTIONS` — Populate questions array
- `START_EXAM` — Set active, record startTime
- `FINISH_EXAM` — Set finished
- `SET_QUESTION` — Update currentQuestionIndex
- `SAVE_DRAFT` — Persist code string
- `RECORD_SUBMISSION` — Store best submission
- `RESTORE_SESSION` — Load from localStorage
- `CLEAR_SESSION` — Reset all state

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
| **Frontend Framework** | Next.js | 16.2.1 | App Router, SSR, API routes |
| **UI Library** | React | 19.2.4 | Component-based UI |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS framework |
| **Code Editor** | @uiw/react-codemirror | 4.25.9 | Python syntax highlighting |
| **Python Runtime** | Pyodide | 0.27.3 | WebAssembly CPython 3.12 |
| **State Management** | React Context + useReducer | — | Exam state, drafts, submissions |
| **Fonts** | Google Fonts | — | Sora, Space Grotesk, JetBrains Mono |
| **Persistence** | localStorage | — | Session recovery |

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — System design, component hierarchy, data flow
- **[COMPONENTS.md](docs/COMPONENTS.md)** — Component catalog with props, features, usage
- **[JUDGE.md](docs/JUDGE.md)** — Pyodide integration, execution harness, security considerations
- **[SCALING.md](docs/SCALING.md)** — Full-stack migration blueprint (database schema, API design, deployment)
- **[PROMPT.md](docs/PROMPT.md)** — Migration objectives and implementation requirements

---

## 🔮 Future Roadmap

### Phase 1: Current State (Client-Only) ✅
- Pyodide in-browser execution
- localStorage persistence
- 37 curated questions
- Single-user experience

### Phase 2: Backend API (Planned)
- **Frontend**: Next.js 16 (unchanged)
- **API**: NestJS (Node.js) for business logic
- **Database**: PostgreSQL + Redis
- **Judge**: Docker containers for multi-language support
- **Auth**: NextAuth.js + JWT with Redis blocklist

### Phase 3: Enterprise Features (Future)
- Multi-tenant support (examiners create exams, candidates take them)
- Role-based access control (Admin, Examiner, Candidate)
- Real-time monitoring & proctoring
- Analytics dashboards
- Kubernetes auto-scaling for judge workers
- Multi-language support (Python, C++, Java, JavaScript, Go)

See [SCALING.md](docs/SCALING.md) for the complete migration blueprint.

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

Edit `web/src/context/ExamContext.js`:

```javascript
const initialState = {
  // ...
  totalDuration: 90 * 60, // Change 90 to desired minutes
};
```

### Adjust Per-Case Timeout

Edit `web/src/hooks/usePyodide.js`:

```javascript
const runTestCase = async (code, input, expected, timeout = 8000) => {
  // Change 8000 to desired milliseconds
```

---

## 🔒 Security Considerations

### Current (In-Browser) Security

- Code runs in the user's own browser — no server attack surface
- Execution is sandboxed within the Pyodide WASM runtime
- `exec()` uses an empty namespace `{}` — no access to application state
- TLE protection via `Promise.race` prevents infinite loops from hanging the UI

### Limitations

- No memory limit enforcement (Pyodide uses browser's WASM memory)
- File system access is limited but not fully restricted
- Network requests from user code are possible (though unusual in a coding exam)

### Future Remote Judge Security

When migrating to a backend judge:
- Execute in **Docker containers** with CPU/memory/network limits
- Use **seccomp** and **cgroups** for syscall filtering
- Implement **per-test-case timeouts** server-side
- Sandbox file system access with read-only mounts

---

## 📊 Result Interpretation

| Score Range | Interpretation |
|-------------|---------------|
| 3300–3700 | Exceptional — TCS Ninja / Digital / Prime eligible |
| 2600–3299 | Strong — High chance of clearing NQT cutoff |
| 1800–2599 | Moderate — Revisit greedy, DP, and string topics |
| Below 1800 | Needs improvement — Focus on Section A fundamentals |

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

- **TCS NQT** — Question bank sourced from previous-year papers
- **Pyodide** — WebAssembly Python runtime
- **Next.js** — React framework for production
- **Tailwind CSS** — Utility-first CSS framework
- **CodeMirror** — Code editor component

---

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built for TCS NQT 2025–26 preparation. All questions sourced from confirmed previous-year papers and high-probability predictions.**
