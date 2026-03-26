// ─────────────────────────────────────────────────────────────────────────────
//  judge.js  —  Code execution engine using Pyodide (WebAssembly Python)
// ─────────────────────────────────────────────────────────────────────────────

const Judge = (() => {
  let pyodide = null;
  let pyodideLoading = null;
  let isReady = false;

  // ── Pyodide bootstrap ──────────────────────────────────────────────────────
  async function loadPyodide() {
    if (pyodide) return pyodide;
    if (pyodideLoading) return pyodideLoading;

    pyodideLoading = (async () => {
      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/",
      });

      // Install the execution harness once
      await pyodide.runPythonAsync(`
import sys
import io
import traceback

class _ExecResult:
    def __init__(self, stdout='', stderr='', error=None):
        self.stdout = stdout
        self.stderr = stderr
        self.error = error

def _run_user_code(code, stdin_text):
    """Execute user code with given stdin, capture stdout/stderr."""
    old_stdin  = sys.stdin
    old_stdout = sys.stdout
    old_stderr = sys.stderr

    sys.stdin  = io.StringIO(stdin_text)
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()

    try:
        exec(compile(code, '<candidate>', 'exec'), {})
        out = sys.stdout.getvalue()
        err = sys.stderr.getvalue()
        return _ExecResult(stdout=out, stderr=err)
    except SystemExit:
        out = sys.stdout.getvalue()
        err = sys.stderr.getvalue()
        return _ExecResult(stdout=out, stderr=err)
    except Exception:
        out  = sys.stdout.getvalue()
        err  = sys.stderr.getvalue()
        tb   = traceback.format_exc()
        return _ExecResult(stdout=out, stderr=err, error=tb)
    finally:
        sys.stdin  = old_stdin
        sys.stdout = old_stdout
        sys.stderr = old_stderr
`);
      isReady = true;
      return pyodide;
    })();

    return pyodideLoading;
  }

  // ── Normalise expected/actual output for comparison ────────────────────────
  function normalise(raw) {
    return raw
      .split('\n')
      .map(l => l.trimEnd())   // strip trailing spaces per line
      .join('\n')
      .trim();                 // strip leading/trailing blank lines
  }

  // ── Run a single test case ─────────────────────────────────────────────────
  async function runTestCase(code, input, expectedOutput, timeoutMs = 8000) {
    const py = await loadPyodide();

    // Escape code and input for safe transfer to Python
    py.globals.set('_user_code',  code);
    py.globals.set('_user_stdin', input);

    const resultPromise = py.runPythonAsync(`_run_user_code(_user_code, _user_stdin)`);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Time Limit Exceeded')), timeoutMs)
    );

    let result;
    try {
      result = await Promise.race([resultPromise, timeoutPromise]);
    } catch (e) {
      return {
        passed:   false,
        status:   e.message === 'Time Limit Exceeded' ? 'TLE' : 'RE',
        actual:   '',
        expected: expectedOutput,
        error:    e.message,
      };
    }

    const actualOut   = result.stdout;
    const errorOut    = result.stderr + (result.error || '');
    const hasError    = !!result.error;

    if (hasError) {
      return {
        passed:   false,
        status:   'RE',
        actual:   actualOut,
        expected: expectedOutput,
        error:    result.error.split('\n').slice(-3).join('\n'),  // last 3 lines
      };
    }

    const normActual   = normalise(actualOut);
    const normExpected = normalise(expectedOutput);
    const passed       = normActual === normExpected;

    return {
      passed,
      status:   passed ? 'AC' : 'WA',
      actual:   actualOut,
      expected: expectedOutput,
      error:    null,
    };
  }

  // ── Run all test cases for a question ─────────────────────────────────────
  async function runAllCases(code, question, onProgress) {
    const allCases = [
      ...question.sampleCases.map((c, i) => ({ ...c, label: `Sample ${i + 1}`, isSample: true  })),
      ...question.hiddenCases.map((c, i) => ({ ...c, label: `Hidden ${i + 1}`, isSample: false })),
    ];

    const results = [];
    let passed = 0;

    for (let i = 0; i < allCases.length; i++) {
      const tc = allCases[i];
      const r  = await runTestCase(code, tc.input, tc.output);
      r.label    = tc.label;
      r.isSample = tc.isSample;
      r.input    = tc.input;
      if (r.passed) passed++;
      results.push(r);
      if (onProgress) onProgress(i + 1, allCases.length, r);
    }

    return {
      results,
      passed,
      total:  allCases.length,
      score:  Math.round((passed / allCases.length) * question.maxScore),
    };
  }

  // ── Run only the visible sample cases ─────────────────────────────────────
  async function runSampleCases(code, question, onProgress) {
    const results = [];
    let passed = 0;

    for (let i = 0; i < question.sampleCases.length; i++) {
      const tc = question.sampleCases[i];
      const r  = await runTestCase(code, tc.input, tc.output);
      r.label    = `Sample ${i + 1}`;
      r.isSample = true;
      r.input    = tc.input;
      if (r.passed) passed++;
      results.push(r);
      if (onProgress) onProgress(i + 1, question.sampleCases.length, r);
    }

    return { results, passed, total: question.sampleCases.length };
  }

  return { loadPyodide, runAllCases, runSampleCases, get isReady() { return isReady; } };
})();
