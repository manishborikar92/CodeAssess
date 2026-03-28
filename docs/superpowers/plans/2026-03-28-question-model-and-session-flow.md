# Question Model And Session Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove question sections, normalize difficulty values, make practice timers opt-in per question, and randomize exam question selection at exam start without exposing questions beforehand.

**Architecture:** Normalize the question catalog at the data boundary, keep practice and exam logic separated in their dedicated contexts, and move random exam assignment into `ExamContext` so the UI reads a single source of truth. Add focused tests first for catalog normalization, practice timer behavior, and random exam assignment.

**Tech Stack:** Next.js App Router, React Context + useReducer, plain Node test runner, local JSON catalog, localStorage persistence.

---

### Task 1: Question Catalog Normalization

**Files:**
- Create: `web/src/lib/questionCatalog.mjs`
- Modify: `web/src/lib/api.js`
- Modify: `web/src/data/questions.json`
- Test: `web/tests/question-catalog.test.mjs`
- Modify: `web/tests/run-tests.mjs`

- [ ] Write failing tests for difficulty normalization and section removal.
- [ ] Run the new catalog test to verify it fails.
- [ ] Implement normalization helpers and wire them into `getQuestions()`.
- [ ] Rewrite `questions.json` so the stored data matches the normalized shape.
- [ ] Re-run the catalog tests and the full test runner.

### Task 2: Practice Timer Opt-In Flow

**Files:**
- Modify: `web/src/lib/practiceSession.mjs`
- Modify: `web/src/context/PracticeContext.js`
- Modify: `web/src/components/exam/PracticeWorkspaceShell.jsx`
- Modify: `web/src/components/exam/ProblemPanel.jsx`
- Modify: `web/src/components/exam/PracticeResultsScreen.jsx`
- Test: `web/tests/practice-session.test.mjs`

- [ ] Write failing tests for disabled-by-default timers, explicit enablement, and unlock reset behavior.
- [ ] Run the practice session tests to verify they fail for the expected reasons.
- [ ] Extend the timer record shape and helpers to support `isEnabled` and unlock resets.
- [ ] Update `PracticeContext` to expose timer enable and unlock actions.
- [ ] Update the practice shell and problem panel UI to render `Start Timer` and `Unlock Question`.
- [ ] Re-run the practice tests and the full test suite.

### Task 3: Random Exam Assignment At Start

**Files:**
- Modify: `web/src/lib/assessmentConfig.mjs`
- Modify: `web/src/lib/examSession.mjs`
- Modify: `web/src/context/ExamContext.js`
- Modify: `web/src/components/exam/ExamStartScreen.jsx`
- Modify: `web/src/components/exam/ExamModeShell.jsx`
- Modify: `web/src/components/exam/ExamResultsScreen.jsx`
- Test: `web/tests/assessment-config.test.mjs`
- Test: `web/tests/exam-session.test.mjs`

- [ ] Write failing tests for unbiased random subset selection, config changes, and persisted question ID handling.
- [ ] Run the targeted tests to verify they fail.
- [ ] Move exam selection to start-time assignment and persist the selected question IDs in session state.
- [ ] Hide question details on the exam start screen until the exam begins.
- [ ] Preserve backward compatibility for older persisted active sessions.
- [ ] Re-run exam-related tests and the full test suite.

### Task 4: UI And Documentation Cleanup

**Files:**
- Modify: `web/src/components/exam/QuestionSidebar.jsx`
- Modify: `web/src/components/exam/ProblemPanel.jsx`
- Modify: `web/src/components/home/HeroSection.jsx`
- Modify: `web/src/components/home/ModeSection.jsx`
- Modify: `README.md`
- Modify: `web/README.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/COMPONENTS.md`

- [ ] Remove remaining section-based UI and documentation references.
- [ ] Update difficulty labels and practice/exam copy to reflect the new behaviors.
- [ ] Run lint, tests, and a production build.
