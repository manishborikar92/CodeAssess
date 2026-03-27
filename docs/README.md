# CodeAssess — Documentation

> Comprehensive technical documentation for the CodeAssess online assessment platform.

This directory contains detailed documentation about the system architecture, components, judge engine, and future scaling plans.

---

## 📚 Documentation Index

### [ARCHITECTURE.md](ARCHITECTURE.md)
**System Architecture & Design**

Covers:
- Current client-side architecture
- Component hierarchy and data flow
- State management with Context API + useReducer
- Data access layer abstraction
- Future full-stack architecture plans

**Read this if you want to:**
- Understand how the application is structured
- Learn about the state management approach
- See the component hierarchy
- Understand the migration path to backend services

---

### [COMPONENTS.md](COMPONENTS.md)
**Component Catalog**

Detailed reference for all React components including:
- **Exam Components**: ExamShell, Header, Sidebar, ProblemPanel, CodePanel, OutputPanel, ResultsScreen
- **UI Primitives**: Toast, Spinner, Modal
- Props, features, and usage examples for each component

**Read this if you want to:**
- Understand what each component does
- Learn about component props and features
- Find usage examples
- Contribute to or modify components

---

### [JUDGE.md](JUDGE.md)
**Online Judge — Pyodide Integration**

In-depth coverage of the code execution engine:
- Pyodide loading and initialization
- Python execution harness design
- Test case execution flow
- Output normalization
- Verdict types (AC/WA/TLE/RE)
- Scoring algorithm
- Security considerations

**Read this if you want to:**
- Understand how code execution works
- Learn about the Pyodide integration
- Modify timeout or execution behavior
- Understand security implications
- Migrate to a remote judge system

---

### [SCALING.md](SCALING.md)
**Scaling & Full-Stack Migration Blueprint**

Comprehensive 12-section guide for evolving into an enterprise platform:
1. Current State & Limitations
2. Technology Decisions (Backend, Database, Auth, Judge)
3. System Roles & Permissions
4. Complete User Journeys
5. Database Schema (Detailed)
6. API Design
7. Remote Code Execution Architecture
8. Real-Time Communication
9. Security & Anti-Cheating
10. Deployment & Infrastructure
11. Migration Phases

**Read this if you want to:**
- Plan the backend migration
- Understand technology choices (NestJS, PostgreSQL, Rust judge)
- Design the database schema
- Implement authentication and authorization
- Build a remote judge system
- Deploy to production
- Scale to thousands of concurrent users

---

### [guides/README.md](guides/README.md)
**Step-by-Step Implementation Guides**

A collection of detailed, sequential execution guides for the full-stack migration:
- `PHASE-0-FOUNDATION.md`
- `PHASE-1-AUTH.md`
- `PHASE-2-QUESTIONS.md`
- `PHASE-3-EXAMS.md`
- `PHASE-4-JUDGE.md`
- `PHASE-5-MONITORING.md`
- `PHASE-6-PRODUCTION.md`
- `AGENT-PROMPT.md` (AI coding agent instructions)

**Read this if you want to:**
- Execute the migration plan step-by-step
- Track progress through the 7 phases
- Prime an AI agent to write the implementation code

---

### [PROMPT.md](PROMPT.md)
**Migration & Expansion Objectives**

Original project requirements and migration goals from legacy to modern stack.

**Read this if you want to:**
- Understand the project's evolution
- See the original requirements
- Learn about migration objectives

---

## 📖 Additional Resources

### Preparation Guides

The `pdf/` and `docx/` directories contain TCS NQT preparation materials:
- **TCS_NQT_DSA_Preparation_Guide_2025-26** — Data structures and algorithms study guide
- **TCS_NQT_Exam_Questions_2025-26** — Previous year questions and solutions

---

## 🗺️ Documentation Map

```
docs/
│
├── README.md                                      ← You are here
│
├── ARCHITECTURE.md                                ← System design & architecture
├── COMPONENTS.md                                  ← Component catalog
├── JUDGE.md                                       ← Pyodide execution engine
├── SCALING.md                                     ← Full-stack migration blueprint
├── PROMPT.md                                      ← Migration objectives
│
├── guides/                                        ← Implementation guides
│   ├── README.md                                  ← Guide index & Phase overview
│   ├── PHASE-0-FOUNDATION.md
│   ├── PHASE-1-AUTH.md
│   ├── PHASE-2-QUESTIONS.md
│   ├── PHASE-3-EXAMS.md
│   ├── PHASE-4-JUDGE.md
│   ├── PHASE-5-MONITORING.md
│   ├── PHASE-6-PRODUCTION.md
│   └── AGENT-PROMPT.md                            ← Prompt for AI coding agents
│
├── pdf/                                           ← Preparation guides (PDF)
│   ├── TCS_NQT_DSA_Preparation_Guide_2025-26.pdf
│   └── TCS_NQT_Exam_Questions_2025-26.pdf
│
└── docx/                                          ← Preparation guides (Word)
    ├── TCS_NQT_DSA_Preparation_Guide_2025-26.docx
    └── TCS_NQT_Exam_Questions_2025-26.docx
```

---

## 🚀 Quick Links

- **[Main README](../README.md)** — Project overview and quick start
- **[Web App README](../web/README.md)** — Modern Next.js implementation
- **[Legacy README](../legacy/README.md)** — Original vanilla JS implementation

---

## 🤝 Contributing to Documentation

When contributing to documentation:

1. **Keep it current** — Update docs when code changes
2. **Be comprehensive** — Include examples and use cases
3. **Use diagrams** — Visual aids improve understanding
4. **Link between docs** — Cross-reference related sections
5. **Follow the style** — Match the existing tone and format

### Documentation Style Guide

- Use **Markdown** for all documentation
- Include **code examples** with syntax highlighting
- Use **tables** for structured data
- Add **diagrams** for complex flows (ASCII art or Mermaid)
- Keep **line length** reasonable (80-100 characters)
- Use **headers** for clear section hierarchy
- Include **links** to related documentation

---

## 📝 Documentation Maintenance

| Document | Last Updated | Maintainer |
|----------|--------------|------------|
| ARCHITECTURE.md | 2025-03 | Core Team |
| COMPONENTS.md | 2025-03 | Core Team |
| JUDGE.md | 2025-03 | Core Team |
| SCALING.md | 2026-03 | Core Team |
| PROMPT.md | 2025-03 | Core Team |
| guides/*.md | 2026-03 | Core Team |

---

*For questions or suggestions about documentation, please open an issue on GitHub.*
