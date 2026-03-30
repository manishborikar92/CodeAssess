# System Architecture

## Overview

CodeAssess is a Next.js application with a clear separation between marketing pages (SSG) and workspace routes (client-heavy). The application uses route-scoped Zustand stores for state management, repository pattern for data access, and IndexedDB for persistence. The judge engine runs entirely in the browser via Pyodide WebAssembly.

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Browser                                    │
│                                                                         │
│  ┌─────────────────┐         ┌──────────────────────────────────────┐   │
│  │  Marketing      │         │         Workspace Routes             │   │
│  │  (SSG)          │         │                                      │   │
│  │  /, /about,     │         │  ┌────────────────────────────────┐  │   │
│  │  /help          │────────>│  │  Practice (/practice)          │  │   │
│  └─────────────────┘         │  │  - PracticeStoreProvider       │  │   │
│                              │  │  - PracticeWorkspaceClient     │  │   │
│                              │  │  - Question browser & IDE      │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              │                                      │   │
│                              │  ┌────────────────────────────────┐  │   │
│                              │  │  Exam (/exam)                  │  │   │
│                              │  │  - ExamStoreProvider           │  │   │
│                              │  │  - ExamSessionClient           │  │   │
│                              │  │  - Timed session with guards   │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              │                                      │   │
│                              │  ┌────────────────────────────────┐  │   │
│                              │  │  Join (/join)                  │  │   │
│                              │  │  - Token validation            │  │   │
│                              │  │  - Session provisioning        │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              │                                      │   │
│                              │  ┌────────────────────────────────┐  │   │
│                              │  │  Results (/results)            │  │   │
│                              │  │  - Completed session views     │  │   │
│                              │  │  - Immutable snapshots         │  │   │
│                              │  └────────────────────────────────┘  │   │
│                              └──────────────────────────────────────┘   │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    Data & Persistence Layer                    │     │
│  │                                                                │     │
│  │  ┌──────────────┐    ┌────────────────┐    ┌────────────────┐  │     │
│  │  │ Repositories │───>│  IndexedDB     │    │  Pyodide WASM  │  │     │
│  │  │  - Question  │    │  - examSessions│    │  - Python exec │  │     │
│  │  │  - ExamSess  │    │  - practiceWork│    │  - Judge logic │  │     │
│  │  │  - Practice  │    │                │    │                │  │     │
│  │  │  - ExamAccess│    │                │    │                │  │     │
│  │  └──────────────┘    └────────────────┘    └────────────────┘  │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │              Static Data (questions.json, blueprints)          │     │
│  └────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Architecture Layers

### 1. Route Layer (app/)
- **Marketing Routes** `(marketing)/`: SSG pages with Header/Footer layout
  - `/` - Landing page with hero, features, modes, flow sections
  - `/about` - Product principles and route ownership
  - `/help` - Documentation and FAQ
  
- **Workspace Routes** `(workspace)/`: Client-heavy with route-scoped stores
  - `/practice` - Question browser
  - `/practice/[id]` - Practice IDE for specific question
  - `/practice/progress` - Progress summary
  - `/exam` - Exam lobby (start/resume)
  - `/exam/[sessionId]` - Active exam session
  - `/join` - Token input form
  - `/join/[token]` - Token resolver
  - `/results` - Completed sessions list
  - `/results/[sessionId]` - Individual result view

### 2. Component Layer (components/)
- **ui/** - Reusable primitives (Modal, Spinner, Toast, WorkspacePageNavigation)
- **marketing/** - Landing page sections (Header, Hero, Features, Flow, Mode, Footer)
- **exam/** - Exam-specific clients (ExamSessionClient, ExamStartPageClient, ExamStartScreen, etc.)
- **practice/** - Practice-specific clients (PracticeWorkspaceClient, PracticeQuestionBrowser, PracticeProgressPage, etc.)
- **results/** - Results display (ResultsListClient, SessionResultClient)
- **workspace/** - Shared IDE components (WorkspaceChrome, WorkspaceHeader, CodePanel, OutputPanel, ProblemPanel, QuestionSidebar, workspaceHooks.js)

**Naming Convention:**
- Client components: `*Client.jsx` suffix (e.g., ExamSessionClient, PracticeWorkspaceClient)
- Screen components: `*Screen.jsx` suffix for presentational components
- Page components: `*Page.jsx` suffix for page-level components

### 3. State Management Layer (stores/ + providers/)
- **Zustand Vanilla Stores**: Created at route layout boundaries
  - `examStore.js` - Exam session state (active session, questions, submissions, drafts, integrity)
  - `practiceStore.js` - Practice workspace state (questions, workspace, navigation)
  - `internal/createPersistScheduler.js` - Debounced persistence scheduler

- **React Context Providers**: Wrap stores for React integration
  - `ExamStoreProvider.jsx` - Provides `useExamStore()` and `useExamStoreApi()`
  - `PracticeStoreProvider.jsx` - Provides `usePracticeStore()` and `usePracticeStoreApi()`

**Pattern:** Zustand vanilla stores + React context wrappers for scoped state trees

### 4. Data Access Layer (lib/repositories/)
Repository pattern abstracts persistence and provides clean interfaces:
- `questionRepository.js` - Read-only question catalog and exam blueprints
- `examSessionRepository.js` - CRUD for exam sessions (create, getById, save, complete, listCompleted, getLatestActive, remove)
- `practiceWorkspaceRepository.js` - Practice workspace persistence
- `examAccessRepository.js` - Exam access control and token validation

**Pattern:** Repository interfaces hide storage implementation (IndexedDB today, API tomorrow)

### 5. Domain Logic Layer (lib/)
- **session/** - Session state normalization and business logic
  - `examSession.mjs` - Exam state, timer calculation, integrity tracking
  - `practiceSession.mjs` - Practice workspace normalization, summary building
  - `submissionState.mjs` - Submission tracking and best-score logic
  - `resultsSession.js` - Results view logic

- **assessment/** - Question selection and configuration
  - `assessmentConfig.mjs` - Question selection, exam/practice config builders

- **execution/** - Code execution
  - `pyodideJudge.js` - Python code execution via Pyodide WASM

- **questions/** - Question utilities
  - `questionCatalog.mjs` - Question normalization and formatting

- **tokens/** - Token handling
  - `invitationToken.js` - Invitation token validation

- **workspace/** - Workspace utilities
  - `navigation.mjs` - Question navigation utilities

- **routing/** - Route state management
  - `practiceRouting.js` - Practice route state resolution

- **use-cases/** - Business workflows
  - `createExamSessionAttempt.js` - Orchestrates exam session creation

### 6. Storage Layer (lib/storage/)
- `repositoryStorage.js` - IndexedDB abstraction with in-memory fallback
  - Stores: `examSessions`, `practiceWorkspaces`
  - Provides: `get()`, `save()`, `remove()`, `list()`, `clear()`

### 7. Hooks Layer (hooks/)
- `useTimer.js` - Countdown timer with elapsed/remaining calculations
- `usePyodide.js` - Pyodide WASM lifecycle management
- `useExamIntegrityGuards.js` - Fullscreen, tab-switch, clipboard detection
- `workspaceHooks.js` (in components/workspace/) - Composite workspace hooks

## Component Hierarchy

```
RootLayout (fonts, metadata)
│
├── MarketingLayout (Header + Footer)
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── ModeSection
│   │   ├── FeatureSection
│   │   └── FlowSection
│   ├── AboutPage
│   └── HelpPage
│
└── WorkspaceLayout (Pyodide script)
    ├── PracticeLayout (PracticeStoreProvider)
    │   ├── PracticeRouteViewport
    │   │   ├── PracticeQuestionBrowser (index)
    │   │   ├── PracticeWorkspaceClient ([id])
    │   │   └── PracticeProgressPage (progress)
    │   └── WorkspaceChrome (shared IDE layout)
    │
    ├── ExamLayout (ExamStoreProvider)
    │   ├── ExamStartPageClient (lobby)
    │   ├── ExamSessionClient ([sessionId])
    │   └── WorkspaceChrome (shared IDE layout)
    │
    ├── JoinLayout
    │   ├── JoinTokenForm (index)
    │   └── JoinTokenResolver ([token])
    │
    └── ResultsLayout
        ├── ResultsListClient (index)
        └── SessionResultClient ([sessionId])
```


## State Management Patterns

### Zustand Store Pattern

All stores follow this structure:

```javascript
// stores/[feature]Store.js
import { createStore } from "zustand/vanilla";

export function create[Feature]Store({ dependencies }) {
  return createStore((set, get) => ({
    // State
    hydrationStatus: "idle",
    data: null,
    
    // Actions
    async hydrate() {
      // Load from repository
      set({ hydrationStatus: "ready", data: loaded });
    },
    
    async mutate(payload) {
      // Update state
      set({ data: updated });
      // Persist via repository
      await repository.save(updated);
    },
  }));
}
```

### Provider Pattern

```javascript
// providers/[Feature]StoreProvider.jsx
"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

const StoreContext = createContext(null);

export function [Feature]StoreProvider({ children, ...deps }) {
  const storeRef = useRef(null);
  
  if (!storeRef.current) {
    storeRef.current = create[Feature]Store(deps);
  }
  
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function use[Feature]Store(selector) {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Must be used within provider");
  return useStore(store, selector);
}

export function use[Feature]StoreApi() {
  return useContext(StoreContext);
}
```

### Repository Pattern

```javascript
// lib/repositories/[feature]Repository.js
import { createBrowserRepositoryStorage } from "../storage/repositoryStorage.js";

const storage = createBrowserRepositoryStorage(STORE_NAMES.[feature]);

export const [feature]Repository = {
  async get(id) {
    return storage.get(id);
  },
  
  async save(record) {
    return storage.save(record);
  },
  
  async list() {
    return storage.list();
  },
  
  async remove(id) {
    return storage.remove(id);
  },
};
```

## Data Flow Patterns

### Practice Flow
```
User opens /practice/[id]
  ↓
PracticeRouteViewport resolves route state
  ↓
PracticeWorkspaceClient mounts
  ↓
useWorkspaceCodeEditor loads draft from store
  ↓
User edits code → saveDraft() → store → scheduler → repository → IndexedDB
  ↓
User submits → recordSubmission() → store → repository → IndexedDB
```

### Exam Flow
```
User starts exam from /exam
  ↓
ExamStartPageClient.handleStart()
  ↓
examStore.startDirectSession() → creates session → repository.create()
  ↓
Router pushes to /exam/[sessionId]
  ↓
ExamSessionClient mounts
  ↓
examStore.hydrateSession(sessionId) → loads from repository
  ↓
useTimer tracks elapsed time from session.lifecycle.startedAt
  ↓
User edits/submits → store mutations → scheduler → repository → IndexedDB
  ↓
Timer expires or user finishes → completeSession() → repository.complete()
  ↓
Router redirects to /results/[sessionId]
```

## Layout Patterns

### Standard Page Layout (Workspace Pages)
```jsx
<div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
  <WorkspacePageNavigation backHref="..." links={[...]} />
  
  <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
    <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(...)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Main content */}
    </section>
    
    <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Sidebar content */}
    </aside>
  </div>
  
  {/* Optional: Table or additional content */}
  <div className="mx-auto mt-6 max-w-[1180px] overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
    {/* Table or list */}
  </div>
</div>
```

### Standard Marketing Layout
```jsx
<div className="min-h-screen bg-bg-primary px-6 pb-16 pt-28">
  <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px]">
    <section className="rounded-[28px] border border-border-main bg-[radial-gradient(...)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Main content */}
    </section>
    
    <aside className="rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Sidebar content */}
    </aside>
  </div>
</div>
```

### Workspace IDE Layout
```jsx
<WorkspaceChrome
  header={<WorkspaceHeader {...headerProps} />}
  sidebar={<QuestionSidebar {...sidebarProps} />}
  problemPanel={<ProblemPanel question={currentQuestion} />}
  codePanel={<CodePanel {...codeProps} />}
  outputPanel={<OutputPanel {...outputProps} />}
  sidebarVisible={sidebar.isOpen || sidebar.isClosing}
  sidebarClosing={sidebar.isClosing}
  onCloseSidebar={sidebar.close}
/>
```

## Design System Constants

### Border Radius
- Large sections: `rounded-[28px]`
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-2xl` (16px)
- Small elements: `rounded-xl` (12px)
- Badges: `rounded-full`

### Shadows
- Hero sections: `shadow-[0_30px_80px_rgba(0,0,0,0.35)]`
- Tables/lists: `shadow-[0_22px_60px_rgba(0,0,0,0.22)]`
- Cards: `shadow-[0_24px_80px_rgba(0,0,0,0.28)]`

### Spacing
- Page padding: `px-6 py-10` (workspace), `px-6 pb-16 pt-28` (marketing)
- Max width: `max-w-[1180px]` (workspace), `max-w-[1200px]` (marketing)
- Grid gap: `gap-6` (main layout), `gap-3` or `gap-4` (cards)

### Typography
- Page titles: `text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95]`
- Section titles: `text-[1.8rem] font-bold`
- Card titles: `text-[1.1rem] font-semibold`
- Eyebrows: `text-[0.76rem] font-semibold uppercase tracking-[0.28em]`
- Body: `text-[1rem] leading-7` or `text-[0.88rem] leading-6`

## File Organization Standards

### Naming Conventions
- React components: PascalCase with `.jsx` extension
- Utilities/logic: camelCase with `.js` extension
- Domain modules: camelCase with `.mjs` extension (ES modules)
- Client components: `*Client.jsx` suffix
- Screen components: `*Screen.jsx` suffix
- Page components: `*Page.jsx` suffix

### Directory Structure
```
web/src/
├── app/                    # Next.js app router
│   ├── (marketing)/        # Public pages with Header/Footer
│   └── (workspace)/        # Protected workspace routes
├── components/             # React components
│   ├── ui/                 # Reusable primitives
│   ├── marketing/          # Landing page sections
│   ├── exam/               # Exam-specific components
│   ├── practice/           # Practice-specific components
│   ├── results/            # Results display components
│   └── workspace/          # Shared IDE components
├── stores/                 # Zustand vanilla stores
│   └── internal/           # Store utilities
├── providers/              # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Business logic & utilities
│   ├── repositories/       # Data access layer
│   ├── session/            # Session state logic
│   ├── assessment/         # Question selection logic
│   ├── execution/          # Code execution
│   ├── storage/            # Storage abstraction
│   ├── routing/            # Route state utilities
│   ├── workspace/          # Workspace utilities
│   ├── questions/          # Question utilities
│   ├── tokens/             # Token handling
│   └── use-cases/          # Business workflows
└── data/                   # Static data
    ├── questions.json      # Question catalog
    └── exam/               # Exam configurations
        └── blueprints.js   # Exam blueprint definitions
```

## Key Architectural Principles

1. **Route Ownership**: Each route family owns one responsibility (practice, exam, join, results)
2. **Repository Pattern**: All persistence goes through repositories, never direct storage access
3. **Scoped State**: Zustand stores created at route layout boundaries, not global singletons
4. **Server/Client Split**: Pages are server components, interactivity delegated to client components
5. **Shared Workspace**: Common IDE components (WorkspaceChrome, panels) used by both practice and exam
6. **Persistence Scheduling**: Debounced saves prevent excessive writes
7. **Hydration Pattern**: Stores hydrate from repositories on mount
8. **Immutable Results**: Completed sessions become read-only snapshots

## Testing Strategy

Tests are organized by layer:
- `tests/[feature]-store.test.mjs` - Store logic tests
- `tests/[feature]-repository.test.mjs` - Repository tests
- Component tests would go in `__tests__/` directories (not yet implemented)

## Migration Path to Backend

The architecture is designed for seamless backend migration:

1. **Repository Layer**: Swap IndexedDB implementation with API client
2. **Store Layer**: No changes needed (stores already use repositories)
3. **Component Layer**: No changes needed (components use stores)
4. **Session Management**: Move session creation/validation to server
5. **Judge Execution**: Replace Pyodide with remote judge service

The repository pattern ensures components never know about storage implementation.
