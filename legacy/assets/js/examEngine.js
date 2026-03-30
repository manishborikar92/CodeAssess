// ─────────────────────────────────────────────────────────────────────────────
//  examEngine.js  —  Exam state, timer, scoring, and session management
// ─────────────────────────────────────────────────────────────────────────────

const ExamEngine = (() => {

  // ── Constants ──────────────────────────────────────────────────────────────
  const TOTAL_SECONDS = 90 * 60;   // 90 minutes in seconds
  const STORAGE_KEY   = 'exam_session';

  // ── Session state ──────────────────────────────────────────────────────────
  let state = {
    started:      false,
    startTime:    null,
    elapsed:      0,           // seconds elapsed
    currentQ:     0,           // 0-based index into QUESTIONS
    submissions:  {},          // questionId → { code, score, results, submittedAt }
    drafts:       {},          // questionId → code (auto-saved)
    examFinished: false,
  };

  let timerInterval = null;
  let onTickCb      = null;   // called every second with { remaining, elapsed }
  let onTimeUpCb    = null;

  // ── Persistence ────────────────────────────────────────────────────────────
  function save() {
    try {
      const serialisable = {
        ...state,
        startTime: state.startTime ? state.startTime.toISOString() : null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable));
    } catch (_) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      state = {
        ...state,
        ...saved,
        startTime: saved.startTime ? new Date(saved.startTime) : null,
      };
      return true;
    } catch (_) {
      return false;
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    state = {
      started:      false,
      startTime:    null,
      elapsed:      0,
      currentQ:     0,
      submissions:  {},
      drafts:       {},
      examFinished: false,
    };
  }

  // ── Timer ──────────────────────────────────────────────────────────────────
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!state.started || state.examFinished) return;
      state.elapsed = Math.floor((Date.now() - state.startTime.getTime()) / 1000);
      const remaining = TOTAL_SECONDS - state.elapsed;
      if (onTickCb) onTickCb({ remaining: Math.max(0, remaining), elapsed: state.elapsed });
      if (remaining <= 0) {
        finishExam();
        if (onTimeUpCb) onTimeUpCb();
      }
      save();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function formatTime(seconds) {
    const s = Math.max(0, seconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
  }

  // ── Session lifecycle ──────────────────────────────────────────────────────
  function startExam() {
    state.started   = true;
    state.startTime = new Date();
    state.elapsed   = 0;
    save();
    startTimer();
  }

  function resumeExam() {
    if (!state.started || !state.startTime) return false;
    const elapsed = Math.floor((Date.now() - new Date(state.startTime).getTime()) / 1000);
    if (elapsed >= TOTAL_SECONDS) {
      finishExam();
      return false;
    }
    state.elapsed = elapsed;
    startTimer();
    return true;
  }

  function finishExam() {
    state.examFinished = true;
    stopTimer();
    save();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function setQuestion(idx) {
    state.currentQ = Math.max(0, Math.min(QUESTIONS.length - 1, idx));
    save();
  }

  function getCurrentQuestion() {
    return QUESTIONS[state.currentQ];
  }

  function getQuestion(idx) {
    return QUESTIONS[idx];
  }

  // ── Code draft management ──────────────────────────────────────────────────
  function saveDraft(questionId, code) {
    state.drafts[questionId] = code;
    save();
  }

  function getDraft(questionId, fallbackStarter) {
    return state.drafts[questionId] !== undefined
      ? state.drafts[questionId]
      : (fallbackStarter || '');
  }

  // ── Submission recording ───────────────────────────────────────────────────
  function recordSubmission(questionId, code, judgeResult) {
    const existing = state.submissions[questionId];
    // Keep best submission
    if (!existing || judgeResult.score >= existing.score) {
      state.submissions[questionId] = {
        code,
        score:       judgeResult.score,
        passed:      judgeResult.passed,
        total:       judgeResult.total,
        results:     judgeResult.results,
        submittedAt: new Date().toISOString(),
      };
    }
    save();
  }

  // ── Scoring & stats ────────────────────────────────────────────────────────
  function getTotalScore() {
    return Object.values(state.submissions)
      .reduce((sum, s) => sum + (s.score || 0), 0);
  }

  function getMaxPossibleScore() {
    return QUESTIONS.reduce((sum, q) => sum + q.maxScore, 0);
  }

  function getSubmissionStatus(questionId) {
    const sub = state.submissions[questionId];
    if (!sub) return null;
    return {
      score:  sub.score,
      passed: sub.passed,
      total:  sub.total,
    };
  }

  function getSummary() {
    const attempted = Object.keys(state.submissions).length;
    const totalScore = getTotalScore();
    const maxScore = getMaxPossibleScore();
    const breakdown = QUESTIONS.map(q => ({
      id:        q.id,
      title:     q.title,
      section:   q.section,
      score:     state.submissions[q.id] ? state.submissions[q.id].score : 0,
      maxScore:  q.maxScore,
      attempted: !!state.submissions[q.id],
      status:    getSubmissionStatus(q.id),
    }));
    return { attempted, totalScore, maxScore, elapsed: state.elapsed, breakdown };
  }

  // ── Time utility ───────────────────────────────────────────────────────────
  function getRemainingSeconds() {
    return Math.max(0, TOTAL_SECONDS - state.elapsed);
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    // Lifecycle
    startExam, resumeExam, finishExam, clearSession,
    load, save,
    // Timer
    formatTime, getRemainingSeconds,
    set onTick(fn)   { onTickCb   = fn; },
    set onTimeUp(fn) { onTimeUpCb = fn; },
    // Navigation
    setQuestion, getCurrentQuestion, getQuestion,
    get currentQ()   { return state.currentQ; },
    get examFinished() { return state.examFinished; },
    get started()    { return state.started; },
    // Code
    saveDraft, getDraft,
    // Submission
    recordSubmission, getSubmissionStatus,
    // Stats
    getTotalScore, getMaxPossibleScore, getSummary,
    TOTAL_SECONDS, QUESTIONS,
  };
})();
