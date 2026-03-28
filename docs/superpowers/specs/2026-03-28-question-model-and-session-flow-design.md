# Question Model And Session Flow Design

**Summary**

This change removes `section` from the question model, standardizes difficulty values to `easy`, `medium`, and `hard`, changes practice timers to an opt-in per-question workflow, and moves exam question assignment to a random-at-start flow.

## Goals

- Keep the question data shape consistent across practice, exam, summaries, and landing content.
- Preserve practice as a flexible workspace while making timed attempts explicit and reversible per question.
- Ensure exam questions are assigned fairly, without replacement, and are not visible before the exam begins.

## Design

### Question Catalog

- The app will treat the normalized question shape as the only public shape used by the UI and contexts.
- `section` is removed from the normalized shape.
- `difficulty` is normalized into lowercase `easy`, `medium`, or `hard`.
- Legacy catalog values such as `Easy`, `Medium`, or `Easy-Medium` are mapped at load time, and the source JSON is rewritten to match the normalized shape.

### Practice Timer Model

- Each question timer is disabled by default.
- Selecting a practice question does not start its timer.
- A question timer starts only when the candidate explicitly enables it for that question.
- Once enabled, the timer behaves like the existing per-question timer: it runs while the question is active and pauses when switching away.
- When time expires, the question becomes locked for editing and judging.
- Unlocking a question clears the expired timer state and returns it to the default untimed state while preserving the draft and submissions.

### Exam Question Assignment

- The exam provider loads the full eligible question pool plus exam config on bootstrap.
- No exam questions are assigned or displayed while the session is in `ready`.
- When the candidate starts the exam, the provider selects `EXAM_QUESTION_COUNT` unique questions using unbiased sampling without replacement and stores only the selected question IDs in session state.
- The assigned question order is persisted in session state so reloads, completion, and review screens are stable.
- For migration safety, old persisted active sessions without question IDs fall back to the previously fixed exam subset.

## UI Changes

- Practice problem details surface a `Start Timer` action when the current question timer is disabled.
- Practice shows an `Unlock Question` action when a timed question has expired.
- Practice headers and summaries describe timer state without implying that every question starts timed.
- Exam start mode no longer reveals titles or topics before the exam begins.
- Question sidebars and result screens use difficulty and topic only, with no section grouping.

## Validation

- Add coverage for difficulty normalization and question-shape cleanup.
- Add coverage for opt-in timer enablement, pause/resume behavior, and unlock reset behavior.
- Add coverage for deterministic random question selection without duplicates.
- Re-run tests, lint, and production build after the refactor.
