# Migration & Expansion: Generic Scalable Online Assessment Platform

## Current Context
The workspace currently consists of two parts:
1. **Legacy Frontend (Root Directory):** A fully functional, plain HTML/CSS/JS frontend application (`index.html`, `assets/`) that simulates a TCS NQT exam. It features:
   - 37 hardcoded coding challenges (`assets/js/questions.js`).
   - An in-browser code execution engine powered by Pyodide (WebAssembly Python) (`assets/js/judge.js`).
   - State management, countdown timer, scoring, and session handling utilizing `localStorage` (`assets/js/examEngine.js`).
   - A single-page, DOM-manipulation-heavy UI utilizing CodeMirror 5 for the code editor.
2. **New Next.js App (`web/` Directory):** A freshly initialized Next.js project using the **App Router**, **Tailwind CSS**, and **JavaScript**, intended to be the future home of the platform.

## Objective
The primary objective is to **migrate** the legacy HTML/JS implementation into the new Next.js project inside the `web/` directory, while simultaneously **expanding** its scope. The platform must transition from a hardcoded TCS-specific simulation into a **full-fledged, generic, and scalable online examination platform** (similar to HackerRank or LeetCode). 

It should serve as a professional-grade technical assessment system where candidates can:
* Select and navigate through various programming challenges.
* Write code inside predefined functions using a modern code editor.
* Run test cases (sample and hidden) with an online judge.
* Get instant, accurate feedback on passed/failed cases, errors (TLE, RE, WA, AC), and scoring.
* Experience a robust, responsive, real exam-like interface.

## Implementation Requirements

### 1. Frontend Migration & Modernization
* **Framework:** Next.js with App Router architecture inside the `web/src` folder.
* **Styling:** Tailwind CSS, maintaining a premium, modern, dark-themed UI (replacing the legacy vanilla CSS).
* **State Management:** Implement proper React state management to replace the legacy `examEngine.js` state logic.
* **Components:** Build reusable, modular React components for the UI (Header, Sidebar, Editor Panel, Output Console, Timer, Results Screen).
* **Code Editor:** Integrate a modern code editor compatible with React (e.g., `@uiw/react-codemirror` or Monaco Editor) replacing the legacy CodeMirror 5 CDN script.

### 2. Core Engine Adaptation
* **Pyodide Judge:** Adapt the existing `judge.js` (Pyodide Wasm Python runtime) to work efficiently within the Next.js/React ecosystem (handling asynchronous WASM loading and preventing UI blocking).
* **Data Structure:** Extricate the hardcoded TCS-specific questions from `questions.js` and design a generic JSON/data structure that can be easily expanded or fetched from an API in the future.

### 3. Future-Proofing for Full-Stack Expansion
Initially, the system will remain frontend-only (relying on Pyodide for the judge and local storage for sessions), but the architecture *must* support seamless migration to a backend infrastructure:
* **API Design:** Data fetching (questions, test cases) and submission handling should be abstracted behind interface methods that can easily be swapped with REST API calls.
* **Database Readiness:** The state shape representing user sessions, scores, and code submissions must align with a standard backend database schema.
* **Remote Code Execution:** The architecture should allow swapping the Pyodide in-browser judge for a backend remote execution engine in a future iteration.

## Documentation Requirements
The project must include comprehensive, well-structured documentation covering:
* **Tech Stack:** Selection, justification, and migration rationale.
* **System Architecture:** Detailed explanation of the current Next.js architecture and the planned future full-stack architecture.
* **Component & State Design:** Folder structure, component hierarchy, and state management decisions.
* **Online Judge Implementation:** How the Pyodide execution engine is integrated and optimized in the Next.js environment.
* **Scalability & Best Practices:** Strategies for scaling the platform, handling concurrent users, securing the judge environment, and optimizing performance.

## Action Plan
Before writing code, draft a **detailed implementation plan** explaining:
* The step-by-step strategy for migrating the legacy code into Next.js components.
* How the in-browser judge will be integrated into the React component lifecycle.
* What UI/UX enhancements will be made during the transition from vanilla CSS to Tailwind CSS.
* How the system will evolve into a production-grade, secure, and scalable backend-driven application.