# CodeAssess Coding Standards

**Last Updated:** March 29, 2026

---

## File Naming Conventions

### React Components
- **Client Components**: `*Client.jsx` (e.g., `ExamSessionClient.jsx`, `PracticeWorkspaceClient.jsx`)
- **Screen Components**: `*Screen.jsx` (e.g., `ExamStartScreen.jsx`, `ExamResultsScreen.jsx`)
- **Page Components**: `*Page.jsx` (e.g., `PracticeProgressPage.jsx`, `PracticeQuestionBrowser.jsx`)
- **UI Primitives**: PascalCase `.jsx` (e.g., `Modal.jsx`, `Spinner.jsx`, `Toast.jsx`)
- **Layout Components**: PascalCase `.jsx` (e.g., `WorkspaceChrome.jsx`, `WorkspaceHeader.jsx`)

### JavaScript Files
- **Utilities**: camelCase `.js` (e.g., `repositoryStorage.js`, `invitationToken.js`)
- **Repositories**: camelCase with `Repository` suffix `.js` (e.g., `examSessionRepository.js`)
- **Stores**: camelCase with `Store` suffix `.js` (e.g., `examStore.js`, `practiceStore.js`)
- **Providers**: PascalCase with `Provider` suffix `.jsx` (e.g., `ExamStoreProvider.jsx`)
- **Hooks**: camelCase with `use` prefix `.js` (e.g., `useTimer.js`, `usePyodide.js`)
- **Domain Modules**: camelCase `.mjs` for ES modules (e.g., `examSession.mjs`, `practiceSession.mjs`)

### Route Files
- **Pages**: `page.js` (Next.js convention)
- **Layouts**: `layout.js` (Next.js convention)
- **Loading**: `loading.js` (Next.js convention)
- **Error**: `error.js` (Next.js convention)

---

## Component Structure Patterns

### Client Component Pattern
```jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import UI components
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";

// Import hooks
import { usePyodide } from "@/hooks/usePyodide";

// Import store
import { useExamStore, useExamStoreApi } from "@/providers/ExamStoreProvider.jsx";

// Import workspace components
import WorkspaceChrome from "../workspace/WorkspaceChrome.jsx";
import WorkspaceHeader from "../workspace/WorkspaceHeader.jsx";

export default function FeatureClient({ prop1, prop2 }) {
  // Router
  const router = useRouter();
  
  // Store hooks
  const storeApi = useExamStoreApi();
  const data = useExamStore((state) => state.data);
  
  // Custom hooks
  const pyodide = usePyodide();
  
  // Local state
  const [localState, setLocalState] = useState(false);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Callbacks
  const handleAction = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Screen Component Pattern (Presentational)
```jsx
"use client";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-main bg-bg-card p-4">
      <div className="font-mono text-[1.6rem] font-bold text-accent-cyan">{value}</div>
      <div className="mt-1 text-[0.72rem] uppercase tracking-[1px] text-text-muted">
        {label}
      </div>
    </div>
  );
}

export default function FeatureScreen({ config, onAction }) {
  return (
    <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
      <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(...)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        {/* Main content */}
      </section>
      
      <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        {/* Sidebar content */}
      </aside>
    </div>
  );
}
```

### Page Component Pattern (Server)
```javascript
import FeatureClient from "@/components/feature/FeatureClient.jsx";
import { repository } from "@/lib/repositories/repository.js";

export const metadata = {
  title: "Page Title",
  description: "Page description",
};

export default function FeaturePage() {
  const data = repository.getData();
  
  return <FeatureClient data={data} />;
}
```

---

## Layout Patterns

### Standard Workspace Page Layout
```jsx
<div className="min-h-screen overflow-y-auto bg-bg-primary px-6 py-10">
  <WorkspacePageNavigation 
    backHref="/back" 
    backLabel="Back" 
    links={[...]} 
  />
  
  <div className="mx-auto grid max-w-[1180px] items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
    <section className="overflow-hidden rounded-[28px] border border-border-main bg-[radial-gradient(...)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Main content */}
    </section>
    
    <aside className="self-start rounded-[28px] border border-border-main bg-bg-secondary p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      {/* Sidebar content */}
    </aside>
  </div>
  
  {/* Optional: Table or list section */}
  <div className="mx-auto mt-6 max-w-[1180px] overflow-hidden rounded-[28px] border border-border-main bg-bg-secondary shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
    {/* Table content */}
  </div>
</div>
```

### Standard Marketing Page Layout
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

---

## Design System Constants

### Border Radius
- **Large sections**: `rounded-[28px]` (28px)
- **Cards**: `rounded-2xl` (16px)
- **Buttons**: `rounded-2xl` (16px)
- **Small elements**: `rounded-xl` (12px)
- **Badges**: `rounded-full`

### Shadows
- **Hero sections**: `shadow-[0_30px_80px_rgba(0,0,0,0.35)]`
- **Tables/lists**: `shadow-[0_22px_60px_rgba(0,0,0,0.22)]`
- **Cards**: `shadow-[0_24px_80px_rgba(0,0,0,0.28)]`

### Spacing
- **Workspace page padding**: `px-6 py-10`
- **Marketing page padding**: `px-6 pb-16 pt-28`
- **Max width (workspace)**: `max-w-[1180px]`
- **Max width (marketing)**: `max-w-[1200px]`
- **Grid gap (main)**: `gap-6`
- **Grid gap (cards)**: `gap-3` or `gap-4`
- **Section padding**: `p-8` (main), `p-6` (aside), `p-5` (cards)

### Typography
- **Page titles**: `text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[0.95]`
- **Section titles**: `text-[1.8rem] font-bold`
- **Card titles**: `text-[1.1rem] font-semibold`
- **Eyebrows**: `text-[0.76rem] font-semibold uppercase tracking-[0.28em]`
- **Body text**: `text-[1rem] leading-7` or `text-[0.88rem] leading-6`
- **Small text**: `text-[0.82rem]` or `text-[0.78rem]`
- **Tiny text**: `text-[0.72rem]` or `text-[0.68rem]`

### Colors (Semantic)
- **Primary text**: `text-text-primary`
- **Secondary text**: `text-text-secondary`
- **Muted text**: `text-text-muted`
- **Accent cyan**: `text-accent-cyan`
- **Accent blue**: `text-accent-blue`
- **Accent gold**: `text-accent-gold`
- **Accent green**: `text-accent-green`
- **Accent red**: `text-accent-red`
- **Background primary**: `bg-bg-primary`
- **Background secondary**: `bg-bg-secondary`
- **Background tertiary**: `bg-bg-tertiary`
- **Background card**: `bg-bg-card`
- **Border main**: `border-border-main`
- **Border subtle**: `border-border-subtle`

---

## State Management Patterns

### Store Creation Pattern
```javascript
// stores/featureStore.js
import { createStore } from "zustand/vanilla";

export function createFeatureStore({ dependencies }) {
  return createStore((set, get) => ({
    // State
    hydrationStatus: "idle",
    data: null,
    
    // Actions
    async hydrate() {
      const loaded = await repository.load();
      set({ hydrationStatus: "ready", data: loaded });
    },
    
    async mutate(payload) {
      const updated = { ...get().data, ...payload };
      set({ data: updated });
      await repository.save(updated);
    },
  }));
}
```

### Provider Pattern
```jsx
// providers/FeatureStoreProvider.jsx
"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { createFeatureStore } from "../stores/featureStore.js";

const FeatureStoreContext = createContext(null);

export function FeatureStoreProvider({ children, ...deps }) {
  const storeRef = useRef(null);
  
  if (!storeRef.current) {
    storeRef.current = createFeatureStore(deps);
  }
  
  useEffect(() => {
    storeRef.current.getState().hydrate().catch(() => {});
  }, []);
  
  return (
    <FeatureStoreContext.Provider value={storeRef.current}>
      {children}
    </FeatureStoreContext.Provider>
  );
}

export function useFeatureStore(selector) {
  const store = useContext(FeatureStoreContext);
  if (!store) {
    throw new Error("useFeatureStore must be used within FeatureStoreProvider");
  }
  return useStore(store, selector);
}

export function useFeatureStoreApi() {
  const store = useContext(FeatureStoreContext);
  if (!store) {
    throw new Error("useFeatureStoreApi must be used within FeatureStoreProvider");
  }
  return store;
}
```

### Hook Pattern
```javascript
// hooks/useFeature.js
"use client";

import { useCallback, useEffect, useState } from "react";

export function useFeature({ config }) {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  const action = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  return {
    state,
    action,
  };
}
```

---

## Repository Pattern

### Repository Interface
```javascript
// lib/repositories/featureRepository.js
import { createBrowserRepositoryStorage } from "../storage/repositoryStorage.js";

const storage = createBrowserRepositoryStorage(STORE_NAMES.feature);

export const featureRepository = {
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
  
  async clear() {
    return storage.clear();
  },
};
```

### Repository Usage
```javascript
// In store or component
import { featureRepository } from "@/lib/repositories/featureRepository.js";

// Load
const data = await featureRepository.get(id);

// Save
await featureRepository.save(record);

// List
const items = await featureRepository.list();
```

---

## Import Order

1. React imports
2. Next.js imports
3. Third-party libraries
4. UI components
5. Feature components
6. Hooks
7. Stores/Providers
8. Repositories
9. Utilities
10. Types/Constants

```javascript
// 1. React
import { useCallback, useEffect, useState } from "react";

// 2. Next.js
import { useRouter } from "next/navigation";
import Link from "next/link";

// 3. Third-party
import { createStore } from "zustand/vanilla";

// 4. UI components
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";

// 5. Feature components
import WorkspaceChrome from "../workspace/WorkspaceChrome.jsx";

// 6. Hooks
import { usePyodide } from "@/hooks/usePyodide";
import { useTimer } from "@/hooks/useTimer";

// 7. Stores/Providers
import { useExamStore, useExamStoreApi } from "@/providers/ExamStoreProvider.jsx";

// 8. Repositories
import { examSessionRepository } from "@/lib/repositories/examSessionRepository.js";

// 9. Utilities
import { getNextQuestionIndex } from "@/lib/workspace/navigation.mjs";

// 10. Constants
import { EXAM_DURATION_SECONDS } from "@/lib/session/examSession.mjs";
```

---

## Code Style Guidelines

### Component Props
- Always destructure props in function signature
- Use default values for optional props
- Document complex props with JSDoc

```jsx
export default function Component({
  required,
  optional = "default",
  callback = () => {},
}) {
  // Component logic
}
```

### State Updates
- Use functional updates when depending on previous state
- Batch related state updates
- Use useCallback for event handlers

```javascript
// Good
setState((prev) => ({ ...prev, updated: true }));

// Good - batch updates
set((state) => ({
  ...state,
  field1: value1,
  field2: value2,
}));

// Good - memoized callback
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### Async Operations
- Always handle errors
- Use try/catch for async operations
- Show user feedback for async actions

```javascript
const handleSubmit = useCallback(async () => {
  try {
    const result = await repository.save(data);
    showToast("Saved successfully", "success");
    return result;
  } catch (error) {
    showToast("Failed to save", "error");
    console.error(error);
  }
}, [data]);
```

### Conditional Rendering
- Use early returns for loading/error states
- Keep JSX clean with extracted conditions

```jsx
// Good - early return
if (isLoading) {
  return <LoadingScreen />;
}

if (!data) {
  return <ErrorScreen />;
}

return <MainContent data={data} />;
```

---

## CSS/Tailwind Guidelines

### Class Organization
1. Layout (flex, grid, position)
2. Sizing (w-, h-, min-, max-)
3. Spacing (p-, m-, gap-)
4. Typography (text-, font-, leading-)
5. Colors (bg-, text-, border-)
6. Effects (shadow-, opacity-, transition-)
7. States (hover:, focus:, disabled:)

```jsx
// Good
<div className="flex items-center gap-3 rounded-2xl border border-border-main bg-bg-card px-4 py-3 text-sm font-semibold text-text-primary shadow-lg transition-colors duration-200 hover:bg-bg-hover">
```

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple screen sizes

```jsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
```

### Animation Classes
- Use consistent durations: `duration-200`, `duration-300`
- Use cubic-bezier for smooth animations
- Define keyframes in globals.css

```jsx
<div className="transition-all duration-200 hover:opacity-90">
```

---

## Testing Guidelines

### Test File Naming
- Store tests: `[feature]-store.test.mjs`
- Repository tests: `[feature]-repository.test.mjs`
- Component tests: `[Component].test.jsx` (future)

### Test Structure
```javascript
import { describe, it, expect, beforeEach } from "vitest";

describe("FeatureStore", () => {
  let store;
  
  beforeEach(() => {
    store = createFeatureStore({ dependencies });
  });
  
  it("should initialize with default state", () => {
    const state = store.getState();
    expect(state.data).toBeNull();
  });
  
  it("should handle action", async () => {
    await store.getState().action();
    const state = store.getState();
    expect(state.data).toBeDefined();
  });
});
```

---

## Error Handling

### User-Facing Errors
- Always show toast notifications for errors
- Provide clear, actionable error messages
- Log errors to console for debugging

```javascript
try {
  await operation();
  showToast("Success message", "success");
} catch (error) {
  showToast("User-friendly error message", "error");
  console.error("Detailed error for debugging:", error);
}
```

### Repository Errors
- Repositories should throw descriptive errors
- Callers should handle and display errors

```javascript
// In repository
if (!record) {
  throw new Error("Record not found");
}

// In component
try {
  const record = await repository.get(id);
} catch (error) {
  showToast(error.message, "error");
}
```

---

## Performance Guidelines

### Memoization
- Use useMemo for expensive calculations
- Use useCallback for event handlers passed as props
- Use React.memo for expensive components (sparingly)

```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### Code Splitting
- Use dynamic imports for heavy components
- Lazy load non-critical features

```javascript
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Spinner />,
});
```

---

## Accessibility Guidelines

### Semantic HTML
- Use semantic elements (button, nav, main, aside, section)
- Avoid div soup

```jsx
// Good
<button type="button" onClick={handleClick}>
  Click me
</button>

// Bad
<div onClick={handleClick}>
  Click me
</div>
```

### ARIA Labels
- Add aria-label for icon-only buttons
- Use aria-hidden for decorative elements

```jsx
<button
  type="button"
  aria-label="Close sidebar"
  onClick={onClose}
>
  <X size={20} />
</button>
```

### Keyboard Navigation
- Support keyboard shortcuts
- Ensure focus states are visible
- Test with keyboard only

```javascript
useEffect(() => {
  const handler = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleRun();
    }
  };
  
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, [handleRun]);
```

---

## Documentation Guidelines

### Component Documentation
- Add JSDoc comments for complex components
- Document props with types and descriptions
- Include usage examples

```jsx
/**
 * Modal dialog component for confirmations.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Show/hide modal
 * @param {string} props.title - Dialog title
 * @param {Function} props.onConfirm - Confirm handler
 * @param {Function} props.onCancel - Cancel handler
 * 
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   title="Confirm Action"
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 */
export default function Modal({ isOpen, title, onConfirm, onCancel }) {
  // Component logic
}
```

### Function Documentation
- Document complex functions with JSDoc
- Explain parameters and return values
- Include examples for non-obvious usage

```javascript
/**
 * Calculates remaining time from elapsed seconds.
 * 
 * @param {number} durationSeconds - Total duration
 * @param {number} elapsedSeconds - Already elapsed time
 * @returns {number} Remaining seconds (never negative)
 */
export function calculateRemainingTime(durationSeconds, elapsedSeconds) {
  return Math.max(0, durationSeconds - elapsedSeconds);
}
```

---

## Git Commit Guidelines

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting, styling
- `docs`: Documentation
- `test`: Tests
- `chore`: Build, dependencies

### Examples
```
feat: add exam integrity overlay component

Implement fullscreen resume overlay that blocks interaction
until candidate returns to fullscreen mode.

Closes #123
```

```
refactor: standardize workspace page layouts

Update all exam pages to match practice page layout patterns
including consistent padding, max-width, and border-radius.
```

---

*End of Document*
