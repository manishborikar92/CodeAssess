# Online Judge — Pyodide Integration

## Overview

The online judge executes Python code entirely in the browser using [Pyodide](https://pyodide.org/) — a WebAssembly port of CPython. This eliminates the need for a backend execution server while providing accurate Python 3 code evaluation.

## How It Works

### 1. Loading Phase

```
App Mount → next/script loads Pyodide CDN (afterInteractive)
         → usePyodide hook polls for window.loadPyodide
         → Initializes Pyodide runtime (~10-15 MB WASM download)
         → Installs Python execution harness (_run_user_code)
         → Sets isReady = true
```

The Pyodide runtime is a **singleton** — loaded once and reused across all question navigation and code executions.

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

- **Run Samples**: Runs only visible sample cases (no scoring)
- **Submit**: Runs all cases (sample + hidden), calculates score
- **Best submission**: Only recorded if `newScore >= existingScore`

## React Integration

### usePyodide Hook

```javascript
const {
  isReady,       // boolean: Pyodide loaded and harness installed
  isLoading,     // boolean: currently loading
  error,         // string | null: error message
  initialize,    // () => Promise: trigger Pyodide load
  runSampleCases,// (code, question) => Promise<Result>
  runAllCases,   // (code, question) => Promise<Result>
  runCustomInput,// (code, input) => Promise<SingleResult>
} = usePyodide();
```

### Preventing Double Initialization

Uses `useRef` to prevent React StrictMode from double-loading:

```javascript
const initStarted = useRef(false);
const initialize = useCallback(async () => {
  if (initStarted.current) return;
  initStarted.current = true;
  // ... load Pyodide
}, []);
```

## Security Considerations

### Current (In-Browser) Security

- Code runs in the user's own browser — no server attack surface
- Execution is sandboxed within the Pyodide WASM runtime
-  `exec()` uses an empty namespace `{}` — no access to application state
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
