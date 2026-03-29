# Component Catalog

## Component Organization

Components are organized by feature and responsibility:

- **ui/** - Reusable primitives (Modal, Spinner, Toast, WorkspacePageNavigation)
- **marketing/** - Landing page sections (Header, Hero, Features, Flow, Mode, Footer)
- **exam/** - Exam-specific components (ExamSessionClient, ExamStartPageClient, etc.)
- **practice/** - Practice-specific components (PracticeWorkspaceClient, PracticeQuestionBrowser, etc.)
- **results/** - Results display components (ResultsListClient, SessionResultClient)
- **workspace/** - Shared IDE components (WorkspaceChrome, panels, hooks)

## Naming Conventions

- **Client Components**: `*Client.jsx` - Interactive components with state (e.g., ExamSessionClient, PracticeWorkspaceClient)
- **Screen Components**: `*Screen.jsx` - Presentational components (e.g., ExamStartScreen, ExamResultsScreen)
- **Page Components**: `*Page.jsx` - Page-level components (e.g., PracticeProgressPage, PracticeQuestionBrowser)
- **Utility Files**: camelCase `.js` - Pure functions and utilities

## Workspace Components (Shared IDE)

### WorkspaceChrome (`components/workspace/WorkspaceChrome.jsx`)

The top-level IDE layout orchestrator using react-resizable-panels.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `header` | ReactNode | WorkspaceHeader component |
| `sidebar` | ReactNode | QuestionSidebar component |
| `problemPanel` | ReactNode | ProblemPanel component |
| `codePanel` | ReactNode | CodePanel component |
| `outputPanel` | ReactNode | OutputPanel component |
| `sidebarVisible` | boolean | Sidebar visibility state |
| `sidebarClosing` | boolean | Sidebar closing animation state |
| `onCloseSidebar` | function | Close sidebar handler |

**Layout Structure:**
- Full-screen flex container with header and resizable panels
- Sidebar: Animated overlay (420px width) with backdrop
- Horizontal split: Problem panel (50%) | Code+Output group (50%)
- Vertical split: Code panel (65%) | Output panel (35%)
- Custom resize handles with hover effects

---

### WorkspaceHeader (`components/workspace/WorkspaceHeader.jsx`)

Top bar with navigation, timer, and action buttons.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `currentQuestionLabel` | string | Label above question title |
| `currentQuestionTitle` | string | Current question title |
| `integrityCount` | number | Integrity violation count (exam only) |
| `onNextQuestion` | function | Next question handler |
| `onPreviousQuestion` | function | Previous question handler |
| `onPrimaryAction` | function | Primary action handler |
| `onShuffleQuestion` | function | Random question handler (practice only) |
| `onToggleSidebar` | function | Toggle sidebar handler |
| `primaryActionLabel` | string | Primary button label |
| `scoreLabel` | string | Score display text |
| `showShuffleButton` | boolean | Show shuffle button (practice only) |
| `timerLabel` | string | Timer display text (exam only) |
| `timerTone` | string | Timer color tone (neutral/warning/critical) |
| `canGoNext` | boolean | Enable next button |
| `canGoPrevious` | boolean | Enable previous button |
| `canShuffle` | boolean | Enable shuffle button |

**Features:**
- Logo and branding
- Problems list toggle button
- Previous/Next/Shuffle navigation
- Current question display
- Timer badge (exam mode)
- Score badge
- Integrity warnings badge (exam mode)
- Primary action button (View Progress / Finish Exam)

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

### QuestionSidebar (`components/workspace/QuestionSidebar.jsx`)

Animated overlay drawer with question list and status indicators.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `currentQuestionIndex` | number | Active question index |
| `description` | string | Sidebar description text |
| `questions` | array | Questions with status |
| `onSelectQuestion` | function | Question selection handler |
| `title` | string | Sidebar title |

**Features:**
- Questions list with difficulty badges
- Status indicators: completed (green), partial (gold), in-progress (blue), not-started (hollow)
- Active question highlight with left border accent
- Click to navigate between questions
- Scrollable list with fixed header

---

## Practice Components

### PracticeWorkspaceClient (`components/practice/PracticeWorkspaceClient.jsx`)

The practice mode IDE orchestrator.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `questionId` | number | Current question ID |

**Responsibilities:**
- Manages practice workspace state via PracticeStoreProvider
- Initializes Pyodide runtime
- Handles code editing, running, and submission
- Manages question navigation (previous, next, shuffle)
- Persists drafts and submissions to practice store
- Wires WorkspaceChrome with practice-specific props

**Features:**
- Question switching without remounting workspace
- Automatic draft saving
- Best submission tracking per question
- Progress view navigation
- Shuffle button for random question selection

---

### PracticeQuestionBrowser (`components/practice/PracticeQuestionBrowser.jsx`)

Question catalog browser with stats and table view.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `questions` | array | Full question catalog |

**Features:**
- Practice stats cards (catalog size, solved count, total score)
- Question table with status, score, and draft indicators
- Resume button for current question
- Open button for each question
- Practice rules sidebar

---

### PracticeProgressPage (`components/practice/PracticeProgressPage.jsx`)

Practice progress summary and question breakdown.

**Props:** None (reads from PracticeStoreProvider)

**Features:**
- Progress stats (solved, score, accuracy)
- Question breakdown table
- Resume button for current question
- Links to practice catalog and results

---

### PracticeRouteViewport (`components/practice/PracticeRouteViewport.jsx`)

Route resolver that determines which practice view to render.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Fallback content for non-question routes |

**Responsibilities:**
- Resolves route segment to view type (index, progress, question)
- Renders PracticeWorkspaceClient for question routes
- Renders children for other routes

---

## Exam Components

### ExamSessionClient (`components/exam/ExamSessionClient.jsx`)

The exam mode IDE orchestrator with integrity guards.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `sessionId` | string | Exam session ID |

**Responsibilities:**
- Manages exam session state via ExamStoreProvider
- Initializes Pyodide runtime
- Handles code editing, running, and submission
- Manages question navigation (previous, next)
- Tracks timer and integrity violations
- Enforces fullscreen and clipboard restrictions
- Persists drafts and submissions to exam store
- Wires WorkspaceChrome with exam-specific props

**Features:**
- Shared countdown timer across all questions
- Integrity violation tracking and warnings
- Fullscreen enforcement with resume overlay
- Clipboard and context menu blocking
- Tab switch detection
- Auto-finish on time limit or integrity limit
- Session persistence and recovery

---

### ExamStartPageClient (`components/exam/ExamStartPageClient.jsx`)

Exam lobby with start/resume functionality.

**Props:** None (reads from ExamStoreProvider)

**Features:**
- Resume active session banner
- Exam configuration display
- Rules acceptance checkbox
- Fullscreen entry on start
- Navigation to exam session

---

### ExamStartScreen (`components/exam/ExamStartScreen.jsx`)

Exam lobby presentational component.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `config` | object | Exam configuration |
| `isStarting` | boolean | Starting state |
| `onAcceptRulesChange` | function | Rules checkbox handler |
| `onStart` | function | Start exam handler |
| `rulesAccepted` | boolean | Rules acceptance state |

**Features:**
- Exam stats cards (duration, questions, violation limit)
- Question assignment explanation
- Integrity rules list
- Candidate checklist
- Rules acceptance checkbox
- Start button

---

### ExamResultsScreen (`components/exam/ExamResultsScreen.jsx`)

Exam results summary and question breakdown.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onReset` | function | Reset/new exam handler |
| `onResetLabel` | string | Reset button label |
| `questions` | array | Exam questions |
| `session` | object | Completed session |
| `totalDurationSeconds` | number | Exam duration |

**Features:**
- Exam summary with finish reason
- Final score display
- Stats cards (duration, integrity warnings, accuracy, submissions)
- Session metadata (started, finished, integrity notes)
- Question breakdown table
- Action buttons (new exam, practice, home)

---

### ExamIntegrityOverlay (`components/exam/ExamIntegrityOverlay.jsx`)

Fullscreen resume overlay for integrity enforcement.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `actionLabel` | string | Action button label |
| `description` | string | Overlay description |
| `isOpen` | boolean | Overlay visibility |
| `onAction` | function | Action button handler |
| `title` | string | Overlay title |
| `warningCount` | number | Current warning count |
| `warningLimit` | number | Maximum warnings allowed |

---

### JoinTokenForm (`components/exam/JoinTokenForm.jsx`)

Token input form for invitation-based exam access.

**Props:** None

**Features:**
- Token textarea input
- Character count display
- Validation and join button
- Demo token button
- Join flow explanation sidebar

---

### JoinTokenResolver (`components/exam/JoinTokenResolver.jsx`)

Token validation and session creation.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `token` | string | Invitation token |

**Responsibilities:**
- Validates token via examAccessRepository
- Creates exam session on success
- Redirects to /exam/[sessionId]
- Shows error state on failure

---

## Results Components

### ResultsListClient (`components/results/ResultsListClient.jsx`)

Completed exam sessions list.

**Props:** None

**Features:**
- Results stats (completed count, average, best score)
- Completed sessions table
- Session metadata display
- Links to individual result views

---

### SessionResultClient (`components/results/SessionResultClient.jsx`)

Individual exam result view.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `sessionId` | string | Session ID |

**Responsibilities:**
- Loads session from examSessionRepository
- Redirects active sessions to /exam/[sessionId]
- Shows error state for missing sessions
- Renders ExamResultsScreen for completed sessions

---


## Global Pages

### LoadingPage (`app/loading.js`)

Global loading state displayed during page transitions.

**Features:**
- Centered spinner with loading message
- Minimal design matching application theme
- Automatically shown by Next.js during navigation

---

### NotFoundPage (`app/not-found.js`)

404 error page for invalid routes.

**Features:**
- Clear 404 error message
- Common routes explanation cards
- Navigation links to main sections (Home, Practice, Exam, Results)
- Consistent layout matching workspace pages

---

### ErrorPage (`app/error.js`)

Global error boundary for unexpected errors.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `error` | Error | Error object with message |
| `reset` | function | Retry function provided by Next.js |

**Features:**
- User-friendly error message
- Error details display (message)
- Retry button to attempt recovery
- Navigation links to main sections
- Recovery options sidebar
- Consistent layout matching workspace pages

---

## UI Primitives