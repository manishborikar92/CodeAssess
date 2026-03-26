# Component Catalog

## Exam Components

### ExamShell (`components/exam/ExamShell.jsx`)

The top-level orchestrator that manages the entire exam experience.

**Responsibilities:**
- Loads questions from API layer
- Initializes Pyodide runtime
- Manages current code state
- Handles Run/Submit/Reset flows
- Wires child components together

**Internal State:**
| State | Type | Purpose |
|-------|------|---------|
| `code` | string | Current editor content |
| `results` | object | Latest judge results |
| `resultMode` | 'run'/'submit' | Whether results are from Run or Submit |
| `isRunning` | boolean | Code is currently executing |
| `showResults` | boolean | Results overlay visible |
| `showEndModal` | boolean | End exam confirmation visible |
| `showResetModal` | boolean | Reset code confirmation visible |
| `pyodideLoading` | boolean | Pyodide is loading |

---

### Header (`components/exam/Header.jsx`)

Top bar with exam controls and live metrics.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onFinishExam` | function | Called when End Exam is clicked |
| `onViewResults` | function | Called when Results button is clicked |
| `pyodideReady` | boolean | Whether Pyodide is loaded |

**Features:**
- Live countdown timer with warning (< 15min) and critical (< 5min) states
- Current score / max score display
- Question counter (Q x / total)
- Pyodide readiness indicator (green/yellow dot)

---

### Sidebar (`components/exam/Sidebar.jsx`)

Scrollable question list with status indicators.

**Props:** None (reads from ExamContext)

**Features:**
- Questions grouped by section with section headers
- Per-question difficulty badge (E/M/H)
- Status dots: hollow (not attempted), gold (partial), green (AC)
- Active question highlight with left border accent
- Click to navigate between questions

---

### ProblemPanel (`components/exam/ProblemPanel.jsx`)

Full problem description display.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `question` | object | Question data object |

**Sections rendered:**
- Section/Topic/Difficulty badges
- Title with question number
- Score and time limit info
- Problem Scenario (blue-bordered card)
- Problem Statement
- Constraints list
- Input/Output format blocks
- Sample test cases (side-by-side grid)
- Hint/Approach box

---

### CodePanel (`components/exam/CodePanel.jsx`)

Code editor with action buttons.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `question` | object | Current question |
| `code` | string | Current code content |
| `onCodeChange` | function | Called on every edit |
| `onRun` | function | Run Samples handler |
| `onSubmit` | function | Submit handler |
| `onReset` | function | Reset Code handler |
| `isRunning` | boolean | Whether code is executing |
| `runningMode` | 'run'/'submit' | Which action is running |
| `pyodideReady` | boolean | Whether Pyodide is loaded |

**Features:**
- React CodeMirror 6 with Python language mode
- One Dark theme
- Auto-bracket matching and closing
- Keyboard shortcuts: Ctrl+Enter (Run), Ctrl+Shift+Enter (Submit), Ctrl+S (prevent save)
- Loading spinners on buttons during execution

---

### OutputPanel (`components/exam/OutputPanel.jsx`)

Tabbed output display with three tabs.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `results` | object | Judge results |
| `mode` | 'run'/'submit' | Whether results are from Run or Submit |
| `question` | object | Current question (for score display) |
| `onRunCustom` | function | Custom input execution handler |
| `isRunning` | boolean | Whether code is executing |

**Tabs:**
1. **Test Results**: Summary bar + per-case verdict cards (AC/WA/TLE/RE)
2. **Console**: stdout/stderr output display
3. **Custom Input**: Textarea + Run button + output

---

### ResultsScreen (`components/exam/ResultsScreen.jsx`)

Full-screen exam results overlay.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onClose` | function | Close overlay handler |

**Features:**
- Animated score ring
- Stats grid: Attempted, Time Taken, Accuracy
- Per-question breakdown table with status colors
- Back to Exam button

---

## UI Primitives

### Toast (`components/ui/Toast.jsx`)

Stacking notification system.

**Usage:**
```javascript
import { showToast } from "@/components/ui/Toast";
showToast("Message", "success", 3000); // type: 'success' | 'error' | 'default'
```

### Spinner (`components/ui/Spinner.jsx`)

Animated loading indicator.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | 'sm'/'md'/'lg' | 'md' | Spinner size |
| `className` | string | '' | Additional classes |

### Modal (`components/ui/Modal.jsx`)

Confirmation dialog.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Show/hide modal |
| `title` | string | Dialog title |
| `message` | string | Dialog message |
| `onConfirm` | function | Confirm action |
| `onCancel` | function | Cancel action |
| `confirmText` | string | Confirm button text |
| `cancelText` | string | Cancel button text |
| `variant` | 'danger'/'default' | Button color scheme |
