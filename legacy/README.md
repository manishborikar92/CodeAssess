# CodeAssess — Legacy Implementation

> Original vanilla HTML/CSS/JavaScript implementation of the CodeAssess platform. This is a full-featured, browser-based coding assessment platform with a live Python runtime, auto-graded test cases, countdown timer, and real-time scoring.

**Note:** This is the legacy version. For the modern Next.js implementation, see the [`/web`](../web) directory.

---

## 📁 Project Structure

```
legacy/
│
├── index.html                    ← Main application entry point (open in browser)
│
├── assets/
│   ├── css/
│   │   └── styles.css            ← Full UI stylesheet (dark industrial theme)
│   │
│   └── js/
│       ├── questions.js          ← All 37 questions, test cases & starter code
│       ├── judge.js              ← Code execution engine (Pyodide/WebAssembly)
│       └── examEngine.js        ← Exam state, timer, scoring & session manager
│
└── README.md                     ← This file
```

---

## 🧠 Question Bank — 37 Questions

### Section A — Confirmed from Previous Papers (Q1–Q25)

| # | Title | Topic | Difficulty |
|---|-------|-------|-----------|
| 1 | Chocolate Packets — Move Zeros to End | Arrays / Two Pointer | Easy |
| 2 | Second Largest Element | Arrays / Linear Scan | Easy |
| 3 | Sort 0s, 1s and 2s — Color Flag | Arrays / Dutch National Flag | Easy |
| 4 | Missing Roll Number | Arrays / Math | Easy |
| 5 | Rotate the Regiment — Array Rotation | Arrays / Reversal Algorithm | Easy |
| 6 | Split Array with Equal Averages | Arrays / Prefix Sum | Medium |
| 7 | Hotel Guest Counter — Peak Occupancy | Arrays / Greedy / Sorting | Medium |
| 8 | Palindrome Password Check | Strings / Two Pointer | Easy |
| 9 | Anagram Detector | Strings / Frequency Map | Easy |
| 10 | First Non-Repeating Character | Strings / HashMap | Easy |
| 11 | Curtain Color Chunks — Max 'a' Count | Strings / Substring | Easy |
| 12 | Reverse the Sentence | Strings / Manipulation | Easy |
| 13 | Count Palindrome Numbers in Range | Strings / Number Conversion | Easy |
| 14 | Fibonacci Sequence — Nth Term | Math / Recursion / DP | Easy |
| 15 | Prime Number Check | Math / Number Theory | Easy |
| 16 | Factorial of a Number | Math / Iteration | Easy |
| 17 | Binary Search | Arrays / Binary Search | Easy |
| 18 | Pattern Printing — Right Triangle | Loops / Pattern | Easy |
| 19 | Linked List Reversal (Array Simulation) | Linked List / Simulation | Easy |
| 20 | Stack Push-Pop Simulation | Stack / Simulation | Easy |
| 21 | Sum of Digits | Math / Number Theory | Easy |
| 22 | Jump Game — Reach the Last Pad | Arrays / Greedy | Medium |
| 23 | Inventory Manager — Word Frequency | HashMap / Strings | Easy |
| 24 | Weekly Exercise Tracker | Arrays / Floating Point | Easy |
| 25 | All Permutations of a String | Recursion / Backtracking | Medium |

### Section B — Predicted High-Probability Topics (Q26–Q37)

| # | Title | Topic | Difficulty |
|---|-------|-------|-----------|
| 26 | Sliding Window Maximum | Arrays / Deque / Sliding Window | Medium |
| 27 | Detect Cycle in Linked List | Linked List / Floyd's Algorithm | Medium |
| 28 | Longest Common Subsequence | Dynamic Programming | Medium |
| 29 | Caesar Cipher Encryption | Strings / ASCII Arithmetic | Easy |
| 30 | Matrix Spiral Traversal | 2D Arrays / Simulation | Medium |
| 31 | Trapping Rain Water | Arrays / Two Pointer | Medium |
| 32 | Maximum Subarray Sum — Kadane's Algorithm | Arrays / Greedy / DP | Easy-Medium |
| 33 | Valid Parentheses / Balanced Brackets | Stack / String | Easy |
| 34 | GCD of Array Elements | Math / Euclidean Algorithm | Easy |
| 35 | Coin Change — Minimum Coins | Dynamic Programming | Medium |
| 36 | Bubble Sort — Descending Order | Sorting / Implementation | Easy |
| 37 | BFS — Minimum Steps in Grid | Graphs / Breadth-First Search | Medium |

---

## 🚀 How to Use

### Option 1 — Open directly (recommended)

Double-click `index.html` to open it in any modern browser.

> **Note:** Some browsers restrict WebAssembly from `file://` origins.  
> If Pyodide fails to load, use Option 2.

### Option 2 — Local HTTP server

```bash
# Navigate to legacy directory
cd legacy

# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

Then navigate to `http://localhost:8080` in your browser.

### Browser requirements

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Chromium | 90+ |
| Firefox | 88+ |
| Safari | 15+ |
| Edge | 90+ |

---

## 🔧 Architecture & File Descriptions

### `index.html`

The single-page application shell. Contains:
- **Startup screen** — exam info, begin button
- **Header** — live timer, total score, question counter
- **Sidebar** — navigable question list with status indicators
- **Problem panel** — scenario, statement, constraints, sample I/O, hints
- **Code panel** — CodeMirror editor with Python syntax highlighting
- **Output panel** — test results, console output, custom input runner
- **Results screen** — final score breakdown table
- **Inline main controller** — wires all UI events, delegates to engine modules

### `assets/js/questions.js`

Defines the `QUESTIONS` array — an array of 37 question objects.

Each question object has:

```javascript
{
  id:           Number,          // 1–37
  title:        String,
  section:      'A' | 'B',
  topic:        String,
  difficulty:   'Easy' | 'Medium' | 'Hard',
  maxScore:     Number,          // always 100
  scenario:     String,          // real-world story
  statement:    String,          // formal problem statement
  constraints:  String[],        // constraint list
  inputFormat:  String,
  outputFormat: String,
  sampleCases:  Array<{ input, output, explanation? }>,  // visible to candidate
  hiddenCases:  Array<{ input, output }>,                 // used only on Submit
  hint:         String,
  starterCode:  String,          // pre-filled Python 3 template
}
```

### `assets/js/judge.js`

Executes Python code in the browser using **Pyodide** (CPython compiled to WebAssembly).

Key functions:

| Function | Description |
|----------|-------------|
| `Judge.loadPyodide()` | Downloads and initialises the Pyodide runtime (~10 MB, cached after first load) |
| `Judge.runSampleCases(code, question, onProgress)` | Runs only the visible sample cases |
| `Judge.runAllCases(code, question, onProgress)` | Runs all sample + hidden cases (used on Submit) |
| `Judge.runTestCase(code, input, expected, timeoutMs)` | Runs a single case, returns `{ passed, status, actual, expected, error }` |

**Execution harness** (injected into Pyodide once):
- Replaces `sys.stdin` with `StringIO(test_input)` so `input()` reads from the test case
- Captures `sys.stdout` to compare with expected output
- Catches `Exception` and `SystemExit`; returns a structured result
- Each test case has an **8-second timeout** (`Promise.race` with `setTimeout`)

**Verdict codes:**

| Code | Meaning |
|------|---------|
| `AC` | Accepted — output matches expected |
| `WA` | Wrong Answer — output doesn't match |
| `TLE` | Time Limit Exceeded — took > 8 seconds |
| `RE` | Runtime Error — Python exception thrown |

### `assets/js/examEngine.js`

Manages all exam state and lifecycle.

| Method / Property | Description |
|-------------------|-------------|
| `startExam()` | Sets `startTime`, begins countdown |
| `resumeExam()` | Resumes from `localStorage` if session exists |
| `finishExam()` | Stops timer, marks exam done |
| `clearSession()` | Resets state, clears `localStorage` |
| `setQuestion(idx)` | Changes current question index |
| `saveDraft(qId, code)` | Auto-saves editor content |
| `getDraft(qId, fallback)` | Retrieves saved draft or starter code |
| `recordSubmission(qId, code, judgeResult)` | Stores best submission per question |
| `getTotalScore()` | Sum of best scores across all submissions |
| `getSummary()` | Full breakdown for results screen |
| `formatTime(seconds)` | `mm:ss` or `h:mm:ss` string |
| `onTick` | Setter for per-second timer callback |
| `onTimeUp` | Setter for time-expiry callback |

**Persistence:** Session state is serialised to `localStorage` under the key `tcs_nqt_session` every second, so refreshing the page doesn't lose progress.

### `assets/css/styles.css`

Industrial-precision dark theme with:
- **Palette:** deep navy background, electric blue accents, cyan highlights
- **Typography:** Sora (headings), JetBrains Mono (code/numbers)
- **Components:** sidebar, code panel, output tabs, test result rows, results screen
- **Animations:** spinner, pulse, blink (timer warning), fade-in
- **Responsive:** two-column layout collapses on narrower viewports

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Run sample test cases |
| `Ctrl/Cmd + Shift + Enter` | Submit (run all cases) |
| `Ctrl + /` | Toggle comment on selected lines |
| `Tab` | Insert 4 spaces |

---

## 🏆 Scoring System

- Each question is worth **100 points** → maximum total = **3700 points**
- Score per question = `round((cases_passed / total_cases) × 100)`
- Hidden test cases are only evaluated on **Submit** (not on "Run Samples")
- The **best submission** per question is retained
- Sample cases: 2 visible per question
- Hidden cases: 4–6 per question (edge cases, large inputs, boundary values)

---

## 🐍 Python Runtime Details

| Property | Value |
|----------|-------|
| Runtime | Pyodide 0.27.3 (CPython 3.12) |
| Delivery | WebAssembly via CDN (`cdn.jsdelivr.net`) |
| Available stdlib | Full Python standard library |
| Available packages | Base Pyodide packages (no pip install needed for standard solutions) |
| I/O method | `sys.stdin` replaced with `StringIO`; stdout captured |
| Per-case timeout | 8 seconds |

Standard library modules that work out of the box:
`sys`, `io`, `math`, `collections`, `itertools`, `functools`, `heapq`, `bisect`, `re`, `string`, `copy`

---

## 🔄 Test Case Design

Each question has:
- **2 visible sample cases** — exactly matching the TCS NQT paper
- **4–6 hidden cases** — including:
  - Edge cases (minimum N, all-same elements, empty/single values)
  - Large-range boundary values
  - Cases designed to catch common implementation mistakes

---

## 🏗️ External Dependencies

All loaded via CDN — no local installation required.

| Library | Version | Purpose |
|---------|---------|---------|
| CodeMirror | 5.65.17 | Code editor with Python syntax highlighting |
| Pyodide | 0.27.3 | WebAssembly Python runtime |
| Google Fonts | – | Sora + JetBrains Mono typefaces |

---

## 📝 Candidate Instructions (Exam Rules)

1. The **90-minute timer** begins immediately when you click "Begin Exam".
2. You may attempt questions in **any order** — use the sidebar to navigate.
3. Write your solution **inside the pre-defined function structure** (starter code).
4. Click **▷ Run Samples** to test against the 2 visible sample cases.
5. Click **✓ Submit** to evaluate against all hidden test cases and record your score.
6. You may **re-submit** as many times as you wish — the best score is kept.
7. Click **End Exam** (or wait for the timer) to see your full results.

---

## 🛠️ Customisation Guide

### Add a new question

Append an object to the `QUESTIONS` array in `assets/js/questions.js`:

```javascript
{
  id:          38,
  title:       "Your Question Title",
  section:     'B',
  topic:       "Topic Name",
  difficulty:  "Easy",
  maxScore:    100,
  scenario:    "Story context here.",
  statement:   "Formal problem statement.",
  constraints: ["1 ≤ N ≤ 1000"],
  inputFormat: "Line 1: N",
  outputFormat: "Print the answer.",
  sampleCases: [
    { input: "5", output: "25", explanation: "5² = 25." }
  ],
  hiddenCases: [
    { input: "1",  output: "1" },
    { input: "10", output: "100" },
  ],
  hint: "Multiply n by itself.",
  starterCode: `def solve():\n    n = int(input())\n    # Write here\nsolve()`
}
```

### Change the exam duration

In `assets/js/examEngine.js`, modify:

```javascript
const TOTAL_SECONDS = 90 * 60;   // change 90 to desired minutes
```

### Adjust per-case timeout

In `assets/js/judge.js`, modify `runTestCase`:

```javascript
async function runTestCase(code, input, expectedOutput, timeoutMs = 8000) {
  // change 8000 to desired milliseconds
```

---

## 📊 Result Interpretation

| Score Range | Interpretation |
|-------------|---------------|
| 3300–3700 | Exceptional — TCS Ninja / Digital / Prime eligible |
| 2600–3299 | Strong — High chance of clearing NQT cutoff |
| 1800–2599 | Moderate — Revisit greedy, DP, and string topics |
| Below 1800 | Needs improvement — Focus on Section A fundamentals |

---

## 🔄 Migration to Modern Stack

This legacy implementation has been migrated to a modern Next.js application. Key improvements in the new version:

- **React 19 + Next.js 16** — Component-based architecture with App Router
- **Tailwind CSS 4** — Utility-first styling with custom design tokens
- **React CodeMirror 6** — Modern code editor with better performance
- **Context API + useReducer** — Structured state management
- **Modular architecture** — Easier to test, maintain, and extend

See the [`/web`](../web) directory for the modern implementation.

---

## 📚 Documentation

For comprehensive documentation, see:

- **[Main README](../README.md)** — Project overview and quick start
- **[Architecture](../docs/ARCHITECTURE.md)** — System design and component hierarchy
- **[Judge Engine](../docs/JUDGE.md)** — Pyodide integration details
- **[Components](../docs/COMPONENTS.md)** — Component catalog
- **[Scaling](../docs/SCALING.md)** — Full-stack migration blueprint

---

*Built for TCS NQT 2025–26 preparation. All questions sourced from confirmed previous-year papers and high-probability predictions.*
