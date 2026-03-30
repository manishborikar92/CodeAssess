# Online Judge — Pyodide Integration

## Overview

The online judge executes Python code entirely in the browser using [Pyodide](https://pyodide.org/) — a WebAssembly port of CPython. This eliminates the need for a backend execution server while providing accurate Python 3 code evaluation.

## How It Works

### 1. Loading Phase

```
App Mount → Next.js Script component loads Pyodide CDN (afterInteractive)
         → usePyodide hook polls for window.loadPyodide
         → Initializes Pyodide runtime (~10-15 MB WASM download, cached)
         → Installs Python execution harness (_run_user_code)
         → Sets isReady = true
         → Removes loading overlay
```

The Pyodide runtime is a **singleton** — loaded once and reused across all question navigation and code executions. The loading happens in the root layout via Next.js Script component:

```jsx
// app/layout.js
<Script
  src="https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js"
  strategy="afterInteractive"
/>
```

### 2. Execution Harness

A Python function `_run_user_code(code, stdin_text)` is installed once during initialization:

```python
def _run_user_code(code, stdin_text):
    """Execute user code with given stdin, capture stdout/stderr."""
    # Redirect stdin/stdout/stderr
    sys.stdin  = io.StringIO(stdin_text)
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()

    try:
        exec(compile(code, '<candidate>', 'exec'), {})
        return _ExecResult(stdout=..., stderr=...)
    except SystemExit:
        # Graceful exit — capture output
    except Exception:
        # Capture traceback (last 3 lines)
    finally:
        # Restore original streams
```

Key design decisions:
- Uses `exec()` with a fresh `{}` namespace for isolation
- Handles `SystemExit` gracefully (from `sys.exit()` calls)
- Trims tracebacks to last 3 lines for readability
- Restores `sys.stdin/stdout/stderr` in `finally` block

### 3. Test Case Execution

For each test case:

```
runTestCase(code, input, expected, timeout=8000ms)
  ├── Set globals: _user_code, _user_stdin
  ├── Promise.race([
  │     pyodide.runPythonAsync("_run_user_code(...)"),
  │     setTimeout(reject, 8000ms)  // TLE detection
  │   ])
  ├── Normalize output (trim trailing spaces, strip blank lines)
  └── Compare normalized actual vs expected → AC/WA/TLE/RE
```

**Progress Callbacks:**

The execution functions support optional progress callbacks for real-time UI updates:

```javascript
await runAllCases(code, question, (current, total, result) => {
  // Update UI with current test case result
  console.log(`Test ${current}/${total}: ${result.status}`);
});
```

### 4. Output Normalization

```javascript
function normalise(raw) {
  return raw
    .split("\n")           // Split into lines
    .map(l => l.trimEnd()) // Remove trailing whitespace per line
    .join("\n")            // Rejoin
    .trim();               // Remove leading/trailing blank lines
}
```

This ensures whitespace-insensitive comparison while respecting meaningful line structure.

### 5. Verdict Types

| Verdict | Condition | UX |
|---------|-----------|-----|
| **AC** | Normalized output matches expected | Green ✓ |
| **WA** | Output doesn't match | Red, shows expected vs actual |
| **TLE** | Execution exceeds 8 seconds | Yellow, timeout message |
| **RE** | Python exception thrown | Orange, traceback snippet |

### 6. Scoring

```javascript
score = Math.round((passed / total) * question.maxScore)
```

- **Run Samples**: Runs only visible sample cases (no scoring, for testing)
- **Submit**: Runs all cases (sample + hidden), calculates score
- **Best submission**: Only recorded if `newScore >= existingScore`

**Submission Tracking:**

Both practice and exam modes track the best submission per question:

```javascript
// In practiceStore or examStore
async recordSubmission(questionId, code, result) {
  const submissions = upsertBestSubmission(
    currentSubmissions,
    { questionId, code, result }
  );
  
  // Update store and persist to IndexedDB
  await repository.save({ ...session, submissions });
}
```

The `upsertBestSubmission` function ensures only the highest-scoring submission is kept.

## React Integration

### usePyodide Hook

Located in `hooks/usePyodide.js`, this hook manages the Pyodide runtime lifecycle:

```javascript
const {
  isReady,       // boolean: Pyodide loaded and harness installed
  isLoading,     // boolean: currently loading
  error,         // string | null: error message
  initialize,    // () => Promise: trigger Pyodide load
  runSampleCases,// (code, question, onProgress) => Promise<Result>
  runAllCases,   // (code, question, onProgress) => Promise<Result>
  runCustomInput,// (code, input) => Promise<SingleResult>
} = usePyodide();
```

**Key Features:**
- Singleton pattern prevents double-loading in React StrictMode
- Async initialization with loading state tracking
- Progress callbacks for real-time test case feedback
- Error handling with user-friendly messages

### Preventing Double Initialization

Uses `useRef` to prevent React StrictMode from double-loading:

```javascript
const initStarted = useRef(false);
const initialize = useCallback(async () => {
  if (initStarted.current) return;
  initStarted.current = true;
  
  setIsLoading(true);
  try {
    await Judge.loadPyodide();
    setIsReady(true);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}, []);
```

### Integration with Workspace Components

Both practice and exam modes use the same execution flow:

```javascript
// In PracticeWorkspaceClient or ExamSessionClient
const pyodide = usePyodide();

const { handleRun, handleSubmit } = useWorkspaceExecution({
  code,
  currentQuestion,
  pyodide,
  setResults,
  setResultMode,
  onSuccessfulSubmission: (result) => {
    // Save to store (practice or exam)
    storeApi.getState().recordSubmission(questionId, code, result);
  },
});
```

### Pyodide Loading Overlay

A loading overlay is displayed during Pyodide initialization:

```jsx
{isPyodideLoading && <PyodideLoadingOverlay />}
```

This prevents user interaction until the runtime is ready, ensuring a smooth experience.

## Security Considerations

### Current (In-Browser) Security

- Code runs in the user's own browser — no server attack surface
- Execution is sandboxed within the Pyodide WASM runtime
- `exec()` uses an empty namespace `{}` — no access to application state
- TLE protection via `Promise.race` prevents infinite loops from hanging the UI
- Exam mode adds integrity guards (fullscreen, tab-switch detection, clipboard blocking)

### Exam Integrity Features

While the judge itself is client-side, exam mode adds several integrity measures:

- **Fullscreen Enforcement** — Exam pauses if candidate exits fullscreen
- **Tab Switch Detection** — Warns candidates when switching tabs
- **Clipboard Blocking** — Prevents copy/paste during exam
- **Context Menu Blocking** — Disables right-click menu
- **Violation Tracking** — Records integrity violations with timestamps
- **Auto-Termination** — Ends exam after 3 violations

These are implemented in `hooks/useExamIntegrityGuards.js` and enforced by `ExamSessionClient`.

### Limitations

- No memory limit enforcement (Pyodide uses browser's WASM memory)
- File system access is limited but not fully restricted
- Network requests from user code are possible (though unusual in a coding exam)
- Integrity guards can be bypassed by determined users (client-side enforcement)
- No server-side validation of submissions

### Future Remote Judge Security

When migrating to a backend judge:
- Execute in **Docker containers** with CPU/memory/network limits
- Use **seccomp** and **cgroups** for syscall filtering
- Implement **per-test-case timeouts** server-side
- Sandbox file system access with read-only mounts
- Server-side proctoring and integrity monitoring
- Cryptographic signing of submissions
- Rate limiting and abuse prevention
