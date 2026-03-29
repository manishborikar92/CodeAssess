# CodeAssess — Folder Structure

**Project:** CodeAssess (Next.js 15, JavaScript)  
**Date:** March 29, 2026  
**Status:** Current Implementation

---

## Overview

CodeAssess follows a feature-based organization with clear separation between:
- **Marketing pages** (SSG with Header/Footer)
- **Workspace routes** (client-heavy with route-scoped stores)
- **Shared components** (reusable UI and IDE components)
- **Data layer** (repositories, stores, domain logic)

---

## Full Structure

```
web/
├── public/
│   ├── logo.svg
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
│
├── src/
│   │
│   ├── app/                                   # Next.js app router
│   │   │
│   │   ├── (marketing)/                       # Public pages (SSG)
│   │   │   ├── layout.js                      # Header + Footer wrapper
│   │   │   ├── page.js                        # Landing page
│   │   │   ├── about/
│   │   │   │   └── page.js                    # About page
│   │   │   └── help/
│   │   │       └── page.js                    # Help/FAQ page
│   │   │
│   │   ├── (workspace)/                       # Protected workspace routes
│   │   │   ├── layout.js                      # Pyodide script loader
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── layout.js                  # PracticeStoreProvider
│   │   │   │   ├── page.js                    # Question browser
│   │   │   │   ├── progress/
│   │   │   │   │   └── page.js                # Progress summary
│   │   │   │   └── [id]/
│   │   │   │       └── page.js                # Practice IDE for question
│   │   │   │
│   │   │   ├── exam/
│   │   │   │   ├── layout.js                  # ExamStoreProvider
│   │   │   │   ├── page.js                    # Exam lobby
│   │   │   │   └── [sessionId]/
│   │   │   │       └── page.js                # Active exam session
│   │   │   │
│   │   │   ├── join/
│   │   │   │   ├── page.js                    # Token input form
│   │   │   │   └── [token]/
│   │   │   │       └── page.js                # Token resolver
│   │   │   │
│   │   │   └── results/
│   │   │       ├── page.js                    # Results list
│   │   │       └── [sessionId]/
│   │   │           └── page.js                # Individual result view
│   │   │
│   │   ├── layout.js                          # Root layout (fonts, metadata)
│   │   ├── loading.js                         # Global loading state
│   │   ├── not-found.js                       # 404 page
│   │   ├── error.js                           # Error boundary
│   │   ├── globals.css                        # Global styles
│   │   ├── manifest.json                      # PWA manifest
│   │   ├── favicon.ico
│   │   ├── apple-icon.png
│   │   ├── icon0.svg
│   │   └── icon1.png
│   │
│   ├── components/                            # React components
│   │   │
│   │   ├── ui/                                # Reusable primitives
│   │   │   ├── Modal.jsx                      # Confirmation dialog
│   │   │   ├── Spinner.jsx                    # Loading indicator
│   │   │   ├── Toast.jsx                      # Notification system
│   │   │   └── WorkspacePageNavigation.jsx    # Page navigation bar
│   │   │
│   │   ├── marketing/                         # Landing page sections
│   │   │   ├── Header.jsx                     # Site header with nav
│   │   │   ├── Footer.jsx                     # Site footer
│   │   │   ├── HeroSection.jsx                # Hero with CTA
│   │   │   ├── ModeSection.jsx                # Practice vs Exam modes
│   │   │   ├── FeatureSection.jsx             # Feature cards
│   │   │   └── FlowSection.jsx                # Candidate journey
│   │   │
│   │   ├── workspace/                         # Shared IDE components
│   │   │   ├── WorkspaceChrome.jsx            # IDE layout with resizable panels
│   │   │   ├── WorkspaceHeader.jsx            # IDE header bar
│   │   │   ├── WorkspaceLoadingStates.jsx     # Loading screens
│   │   │   ├── workspaceHooks.js              # Composite workspace hooks
│   │   │   ├── CodePanel.jsx                  # Code editor panel
│   │   │   ├── OutputPanel.jsx                # Test results panel
│   │   │   ├── ProblemPanel.jsx               # Problem description panel
│   │   │   └── QuestionSidebar.jsx            # Question list sidebar
│   │   │
│   │   ├── practice/                          # Practice-specific components
│   │   │   ├── PracticeWorkspaceClient.jsx    # Practice IDE orchestrator
│   │   │   ├── PracticeQuestionBrowser.jsx    # Question catalog browser
│   │   │   ├── PracticeProgressPage.jsx       # Progress summary
│   │   │   └── PracticeRouteViewport.jsx      # Route resolver
│   │   │
│   │   ├── exam/                              # Exam-specific components
│   │   │   ├── ExamSessionClient.jsx          # Exam IDE orchestrator
│   │   │   ├── ExamStartPageClient.jsx        # Exam lobby client
│   │   │   ├── ExamStartScreen.jsx            # Exam lobby screen
│   │   │   ├── ExamResultsScreen.jsx          # Results summary
│   │   │   ├── ExamIntegrityOverlay.jsx       # Fullscreen resume overlay
│   │   │   ├── JoinTokenForm.jsx              # Token input form
│   │   │   └── JoinTokenResolver.jsx          # Token validation
│   │   │
│   │   └── results/                           # Results display components
│   │       ├── ResultsListClient.jsx          # Results list
│   │       └── SessionResultClient.jsx        # Individual result view
│   │
│   ├── stores/                                # Zustand vanilla stores
│   │   ├── examStore.js                       # Exam session state
│   │   ├── practiceStore.js                   # Practice workspace state
│   │   └── internal/
│   │       └── createPersistScheduler.js      # Debounced persistence
│   │
│   ├── providers/                             # React context providers
│   │   ├── ExamStoreProvider.jsx              # Exam store context
│   │   └── PracticeStoreProvider.jsx          # Practice store context
│   │
│   ├── hooks/                                 # Custom React hooks
│   │   ├── useTimer.js                        # Countdown timer
│   │   ├── usePyodide.js                      # Pyodide lifecycle
│   │   └── useExamIntegrityGuards.js          # Integrity enforcement
│   │
│   ├── lib/                                   # Business logic & utilities
│   │   │
│   │   ├── repositories/                      # Data access layer
│   │   │   ├── questionRepository.js          # Question catalog
│   │   │   ├── examSessionRepository.js       # Exam sessions CRUD
│   │   │   ├── practiceWorkspaceRepository.js # Practice persistence
│   │   │   └── examAccessRepository.js        # Token validation
│   │   │
│   │   ├── session/                           # Session state logic
│   │   │   ├── examSession.mjs                # Exam state normalization
│   │   │   ├── practiceSession.mjs            # Practice state normalization
│   │   │   ├── submissionState.mjs            # Submission tracking
│   │   │   └── resultsSession.js              # Results view logic
│   │   │
│   │   ├── assessment/                        # Assessment configuration
│   │   │   └── assessmentConfig.mjs           # Question selection logic
│   │   │
│   │   ├── execution/                         # Code execution
│   │   │   └── pyodideJudge.js                # Pyodide WASM judge
│   │   │
│   │   ├── storage/                           # Storage abstraction
│   │   │   └── repositoryStorage.js           # IndexedDB wrapper
│   │   │
│   │   ├── routing/                           # Route state utilities
│   │   │   └── practiceRouting.js             # Practice route resolver
│   │   │
│   │   ├── workspace/                         # Workspace utilities
│   │   │   └── navigation.mjs                 # Question navigation
│   │   │
│   │   ├── questions/                         # Question utilities
│   │   │   └── questionCatalog.mjs            # Question formatting
│   │   │
│   │   ├── tokens/                            # Token handling
│   │   │   └── invitationToken.js             # Token validation
│   │   │
│   │   └── use-cases/                         # Business workflows
│   │       └── createExamSessionAttempt.js    # Session creation orchestration
│   │
│   └── data/                                  # Static data
│       ├── questions.json                     # Question catalog (37 questions)
│       └── exam/
│           └── blueprints.js                  # Exam blueprint definitions
│
├── tests/                                     # Test files
│   ├── exam-store.test.mjs
│   ├── exam-session-repository.test.mjs
│   └── invitation-token.test.mjs
│
├── next.config.mjs
├── jsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── package.json
└── .env.local.example
```

---

## Route Group Summary

| Group | URL Pattern | Layout | Purpose |
|-------|-------------|--------|---------|
| `(marketing)` | `/`, `/about`, `/help` | Header + Footer | Public landing pages |
| `(workspace)` | `/practice/*`, `/exam/*`, `/join/*`, `/results/*` | Minimal (Pyodide script only) | Protected workspace routes |

---

## Component Organization Principles

1. **Feature-based grouping**: Components organized by feature (exam, practice, results, marketing)
2. **Shared components**: Common UI primitives in `ui/`, shared IDE components in `workspace/`
3. **Client suffix**: Interactive components use `*Client.jsx` naming
4. **Screen suffix**: Presentational components use `*Screen.jsx` naming
5. **Co-located hooks**: Feature-specific hooks stay with components (e.g., workspaceHooks.js)

## State Management Organization

1. **Stores**: Zustand vanilla stores in `stores/` directory
2. **Providers**: React context wrappers in `providers/` directory
3. **Hooks**: Custom hooks in `hooks/` directory
4. **Pattern**: Store → Provider → Hook → Component

## Data Layer Organization

1. **Repositories**: Data access abstraction in `lib/repositories/`
2. **Session Logic**: State normalization in `lib/session/`
3. **Storage**: IndexedDB abstraction in `lib/storage/`
4. **Use Cases**: Business workflows in `lib/use-cases/`

---

*End of Document*
