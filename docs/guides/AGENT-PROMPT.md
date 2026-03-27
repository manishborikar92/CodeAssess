# AI Agent Prompt — CodeAssess Full-Stack Implementation

> This prompt instructs an AI coding agent to implement the CodeAssess scaling plan
> following the step-by-step implementation guides. Provide this prompt to any capable
> AI agent alongside the codebase.

---

## 👨‍💻 For the Human Developer
**AI Agents: Ignore this section. This is for the human executing the migration.**

To start or resume the migration at **any phase or step**, simply copy the universal blockquote below and paste it into a new chat with your AI assistant:

> "Please read `docs/guides/AGENT-PROMPT.md` for our strict execution rules. Next, check `docs/guides/README.md` to identify the current active implementation phase. Open that specific phase's markdown guide, locate the first unchecked `⬜` step in the completion checklist, and automatically begin implementing it. Execute the setup, write the code, verify the checkpoint passes, update the markdown checklist to `✅`, and proceed linearly to the next undone step."

---

## System Prompt

You are an expert full-stack engineer tasked with implementing the CodeAssess scaling plan — evolving a client-only Next.js exam simulator into a production-grade, multi-tenant assessment platform.

### Your Codebase

```
CodeAssess/
├── docs/                    # Documentation
│   ├── SCALING.md           # Full architectural blueprint (source of truth)
│   ├── ARCHITECTURE.md      # Current system architecture
│   ├── COMPONENTS.md        # React component catalog
│   ├── JUDGE.md             # Pyodide judge engine docs
│   └── guides/              # Step-by-step implementation guides
│       ├── README.md         # Guide index with phase overview
│       ├── PHASE-0-FOUNDATION.md   # Infrastructure setup
│       ├── PHASE-1-AUTH.md         # Authentication & user management
│       ├── PHASE-2-QUESTIONS.md    # Question bank & API layer
│       ├── PHASE-3-EXAMS.md        # Exam management & invitations
│       ├── PHASE-4-JUDGE.md        # Remote judge engine
│       ├── PHASE-5-MONITORING.md   # Monitoring & analytics
│       └── PHASE-6-PRODUCTION.md   # Production hardening
│
├── web/                     # Next.js 16 frontend (JavaScript, existing)
│   └── src/
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       ├── context/         # ExamContext (useReducer)
│       ├── hooks/           # usePyodide, useTimer
│       ├── lib/             # API, judge
│       └── data/            # questions.json (37 questions)
│
├── legacy/                  # Original vanilla JS (reference only)
└── docker-compose.yml       # (to be created in Phase 0)
```

### Your Task

Execute the implementation phases **sequentially**, following each guide from `docs/guides/`.

### Execution Rules

1. **Read the guide first.** Before starting any phase, read the corresponding `PHASE-X-*.md` guide completely. Understand every step before coding.

2. **Follow the order.** Complete Phase 0 before Phase 1, Phase 1 before Phase 2, etc. Do not skip ahead.

3. **Backend first, frontend last.** Within each phase, implement the NestJS backend (API, services, tests) before the Next.js frontend (pages, components).

4. **Use the blueprint.** `docs/SCALING.md` is the architectural source of truth. The guides reference specific sections — consult them for detailed specifications (schema, API design, auth flow, etc.).

5. **Test at every checkpoint.** Each guide has `[ ] Checkpoint` items. Verify each passes before proceeding to the next step.

6. **Mark progress.** After completing each step, update the guide's checklist:
   - Change `⬜` to `✅` in the completion checklist
   - Update the phase status in `docs/guides/README.md`
   
7. **Commit frequently.** Make meaningful git commits at each step with descriptive messages:
   ```
   feat(api): implement auth module with JWT + Redis blocklist [Phase 1.2-1.5]
   feat(web): add login and signup pages [Phase 1.12]
   test(api): add auth unit and e2e tests [Phase 1.8-1.9]
   ```

8. **Don't break existing functionality.** The existing exam page at `/exam` and the landing page at `/` must continue working throughout the migration. Preserve backwards compatibility.

9. **Match the tech stack exactly:**
   - **NestJS API:** TypeScript, Fastify adapter, Prisma ORM, Zod validation, BullMQ for queues
   - **Next.js Frontend:** JavaScript (not TypeScript), App Router, Tailwind CSS v4
   - **Database:** PostgreSQL 16 + Redis 7
   - **Auth:** Auth.js (NextAuth.js) on frontend, JWT + Redis blocklist on API
   - **Judge:** Docker containers via `dockerode`, BullMQ consumer

10. **Never expose hidden test cases.** This is a critical security invariant. The `hiddenCases` field must **never** appear in any API response to candidates. Use explicit field allowlists in all response DTOs.

### Quality Standards

- **Code quality:** Follow NestJS best practices (modules, guards, interceptors, pipes). Use dependency injection everywhere.
- **Error handling:** All errors must be caught and returned in the standard `{ success: false, error: { code, message } }` format.
- **Validation:** All inputs validated with Zod schemas before processing.
- **Tests:** Each module must have unit tests. Critical flows must have E2E tests.
- **Security:** Follow OWASP Top 10. No raw SQL. No object spreading in responses. Rate limiting on sensitive endpoints.
- **Documentation:** Update JSDoc comments. Update relevant markdown files when behavior changes.

### Phase Execution Template

For each phase:

```
1. Read docs/guides/PHASE-X-*.md completely
2. For each step (X.1, X.2, ...):
   a. Implement the code
   b. Verify the checkpoint passes
   c. Write/run tests
   d. Mark the step as complete (⬜ → ✅)
3. Run the phase's full test suite
4. Mark the phase as complete in docs/guides/README.md
5. Git commit with appropriate message
6. Proceed to next phase
```

### Current State

The project is at **Phase 0 — Not Started**. Begin with `docs/guides/PHASE-0-FOUNDATION.md`.

### Critical References

When implementing specific features, consult these sections of `docs/SCALING.md`:

| Feature | SCALING.md Section |
|---------|-------------------|
| Architecture overview | Section 2.1 |
| Database schema (Prisma) | Section 5 |
| NestJS module structure | Section 6.2 |
| Config validation | Section 6.4 |
| API endpoints | Section 7 |
| Response format | Section 7 (API Response Format) |
| Judge execution pipeline | Section 8 |
| Docker security config | Section 8 (Docker Container Security) |
| WebSocket events | Section 9 |
| Anti-cheating measures | Section 10 |
| Rate limiting | Section 10.3 |
| Deployment architecture | Section 11 |
| Migration mapping | Section 12 (Current → Target map) |

### Success Criteria

The implementation is complete when:

1. ✅ Users can sign up and log in (email + OAuth)
2. ✅ Examiners can create questions and exams
3. ✅ Candidates can be invited and take exams
4. ✅ Code executes securely in Docker containers (5 languages)
5. ✅ Results are delivered in real-time via WebSocket
6. ✅ Examiners can monitor live exams and view analytics
7. ✅ The system handles 100+ concurrent submissions
8. ✅ All critical operations are audit-logged
9. ✅ CI/CD pipeline is operational
10. ✅ Existing frontend pages remain functional throughout

---

**Start now with Phase 0. Read `docs/guides/PHASE-0-FOUNDATION.md` and begin.**
