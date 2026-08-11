# Coding Standards & Guidelines
## Smart Home Monitoring & Control System

**Course**: SCS 3311: Mobile Application Design & Development  
**Document Version**: 1.0  
**Date**: July 2026  

---

## 1. Naming Conventions

Strict naming conventions ensure consistency across the mobile application (`mobile/`), hardware simulator (`hardware-simulator/`), and backend (`backend/`).

| Code Element | Convention | Example | Notes |
| :--- | :--- | :--- | :--- |
| **Folder Names** | `kebab-case` | `hardware-simulator`, `floor-plan` | Lowercase with hyphens |
| **Component Files** | `PascalCase.tsx` | `OutletTile.tsx`, `FloorGrid.tsx` | Matches exported component name |
| **Hook Files** | `camelCase.ts` | `useDeviceControl.ts` | Must start with `use` |
| **Service Files** | `camelCase.ts` | `deviceService.ts`, `floorService.ts` | Suffix with `Service` |
| **Types / Interfaces** | `PascalCase.ts` | `Device.ts`, `UserSession.ts` | Avoid `I` prefix in interfaces |
| **React Components** | `PascalCase` | `function OutletTile() {}` | Standard React function component |
| **Variables & Functions** | `camelCase` | `const isOutletActive = true;` | Descriptive & self-documenting |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_ACTIVE_DURATION_LIMIT` | Global or module-level constants |
| **Custom Hooks** | `camelCase` | `useFloorDevices()` | Must begin with `use` prefix |
| **Firebase Collections** | `lowercase` plural | `devices`, `floors`, `logs` | Plural noun identifiers |

---

## 2. Folder Organization Rules

1. **Separation by Subsystem**:
   - `mobile/`: React Native (Expo) app source files.
   - `hardware-simulator/`: React.js Web App source files.
   - `backend/`: Cloud functions, DB security rules, and worker scripts.
2. **Feature & Layer Based Modularity**:
   - Keep presentational components in `components/`.
   - Keep screen routes in `app/` (Expo Router).
   - Keep business logic in `hooks/`.
   - Keep data fetching and Firebase SDK calls in `services/`.
3. **No Direct Import Across Subsystems**:
   - Mobile and Simulator codebases must never import directly from each other's source trees; shared interfaces should be duplicated or referenced via `types/`.

---

## 3. Component Design Rules

1. **Single Responsibility Principle (SRP)**:
   - Each component must serve a single presentational or layout purpose.
2. **Presentational vs Container Separation**:
   - UI components (e.g., `StatusBadge`) should be stateless and controlled via props.
   - Container screens or custom hooks manage state subscriptions and side effects.
3. **Explicit Prop Types**:
   - Every component must define a clear TypeScript `interface` or `type` for its props.
   - Do not use `any` type for props.

---

## 4. React Best Practices

1. **Functional Components Only**: Use functional components with hooks exclusively. Class components are prohibited.
2. **Immutable State Updates**: Never mutate state directly. Use setter functions and spread operators for objects and arrays.
3. **Controlled Hooks & Dependencies**:
   - Always specify accurate dependency arrays in `useEffect`, `useCallback`, and `useMemo`.
   - Clean up subscriptions and listeners (`unsubscribe()`) on component unmount.

---

## 5. Expo Router Best Practices

1. **File-Based Routing Structure**:
   - Group screens logically under `app/` (e.g., `app/index.tsx`, `app/floor/[id].tsx`).
2. **Use Layout Wrappers**:
   - Define common headers, safe areas, and context providers in `app/_layout.tsx`.
3. **Typed Navigation Params**:
   - Route parameters must be validated and typed when reading from `useLocalSearchParams()`.

---

## 6. Firebase Best Practices

1. **Centralized Service Wrapper**:
   - Direct calls to `firebase/firestore` functions (`getDoc`, `setDoc`, `onSnapshot`) inside React UI components are strictly forbidden.
   - All database calls must pass through `services/deviceService.ts` or similar service modules.
2. **Realtime Listener Unsubscription**:
   - Always return `unsubscribe()` in `useEffect` cleanup routines when establishing `onSnapshot` listeners to prevent memory leaks.
3. **Batch Writes & Transactions**:
   - Use atomic batch writes (`writeBatch`) when updating multiple related documents (e.g., toggling a 5-switch gang box).

---

## 7. Git Commit Message Convention

Follow the **Conventional Commits** specification (`<type>(<scope>): <short description>`):

| Commit Type | Purpose | Example |
| :--- | :--- | :--- |
| `feat` | New feature implementation | `feat(mobile): add multi-floor grid overlay component` |
| `fix` | Bug fix | `fix(backend): resolve safety timer cutoff calculation overflow` |
| `docs` | Documentation update | `docs(srs): add non-functional performance requirements` |
| `style` | Formatting & code style adjustments | `style(simulator): format device LED visualizer css` |
| `refactor` | Code restructuring without feature change | `refactor(services): abstract firestore listener methods` |
| `chore` | Maintenance tasks | `chore(repo): update root .gitignore rules` |

---

## 8. Branch Naming Convention

Work on isolated branches created from `develop`:

- Feature branch: `feature/<component>-<short-description>` (e.g., `feature/mobile-grid-mapping`)
- Bug fix branch: `fix/<issue>-<short-description>` (e.g., `fix/timer-cutoff-bug`)
- Documentation branch: `docs/<doc-name>` (e.g., `docs/coding-standards`)

---

## 9. Code Formatting

1. **Indentation**: 2 spaces (no hard tabs).
2. **Quotes**: Single quotes (`'`) for TS/JS strings; double quotes (`"`) for JSX attributes and JSON.
3. **Semicolons**: Mandatory at the end of statements.
4. **Line Length Limit**: Maximum 100 characters per line.

---

## 10. Documentation Guidelines

1. **JSDoc for Public Functions**:
   - Document service methods, utility functions, and custom hooks using JSDoc tags (`@param`, `@returns`).
2. **Self-Documenting Code**:
   - Use descriptive variable names (`isDeviceOverheating` instead of `chk`).
3. **Inline Comments**:
   - Use inline comments only to explain complex business logic or safety cutoff algorithms, not obvious statements.

---

## 11. Error Handling Guidelines

1. **Try-Catch Blocks in Services**:
   - Wrap asynchronous network calls in `try-catch` blocks and pass structured error objects to the caller.
2. **User-Friendly Error Messages**:
   - Raw database error stack traces must never be shown to end-users. Map errors to clear user notifications (e.g., `"Network disconnected. Reconnecting..."`).
3. **Fallback UI**:
   - Use Error Boundaries or fallback tiles for devices that fail to render or experience payload corruption.

---

## 12. Logging Guidelines

1. **No Debug Console Logs in Production**:
   - Remove `console.log()` calls prior to merging code into `main`.
2. **Structured Log Levels**:
   - `console.info()` for lifecycle events.
   - `console.warn()` for transient network retries.
   - `console.error()` for unhandled exceptions or safety worker failures.

---

## 13. Reusable Component Guidelines

1. **Design System Consistency**:
   - Use consistent color tokens (`ON` = Green/Emerald, `OFF` = Dark Gray, `ERROR` = Amber/Orange, `DISCONNECTED` = Muted Red).
2. **Prop Transparency**:
   - Expose optional `style` or `className` props on reusable UI widgets to allow layout adjustments by parent wrappers.

---

## 14. Performance Guidelines

1. **Prevent Unnecessary Re-renders**:
   - Wrap heavy list/grid items in `React.memo()`.
   - Memoize callback functions with `useCallback` when passing to child grid nodes.
2. **Asset Optimization**:
   - Compress floor plan background images (PNG/WebP format) under 500 KB to guarantee fast loading over mobile networks.
3. **Unsubscribe Listeners**:
   - Ensure all real-time Firestore listeners are detached when screens unmount or when changing active floor tabs.

---

## 15. Project Structure Rules

```text
Smart Home Monitoring System/
├── docs/                 # SRS, Architecture, Coding Standards, Reports
├── mobile/               # React Native (Expo) codebase
├── hardware-simulator/  # React.js web simulator codebase
├── backend/              # Firebase Functions & rules
├── assets/               # Floor plans, icons, static images
├── meeting-notes/        # Team decision logs
└── .github/              # Actions workflows & templates
```

- Source code changes must remain isolated within `mobile/`, `hardware-simulator/`, or `backend/`.
- Project root must contain repository-level configuration files only.
