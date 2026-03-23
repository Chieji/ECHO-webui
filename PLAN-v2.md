# Implementation Plan: ECHOMEN Full-Stack Upgrade

## Phase 1: Infrastructure Setup (Upgrade to web-db-user)

### Task 1.1: Upgrade project scaffold
- **Action**: Run `webdev_add_feature("web-db-user")` to add backend, database, and auth
- **Verification**: Server starts, database is accessible, new files appear in `server/`
- **Time**: 3 min

### Task 1.2: Define database schema
- **Files**: `shared/schema.ts`
- **Action**: Create Drizzle ORM schema for `agents`, `chat_messages`, `settings`, `activity_log` tables
- **Verification**: `npx drizzle-kit push` succeeds, tables appear in database
- **Time**: 5 min

### Task 1.3: Seed initial data
- **Files**: `server/seed.ts` (or SQL via webdev_execute_sql)
- **Action**: Insert sample agents, default settings, and initial activity log entries
- **Verification**: `SELECT * FROM agents` returns rows
- **Time**: 3 min

---

## Phase 2: Backend API Routes

### Task 2.1: Agents CRUD routes
- **Files**: `server/routes/agents.ts`
- **Endpoints**: GET/POST `/api/agents`, PATCH/DELETE `/api/agents/:id`
- **Test**: POST creates agent, GET lists it, PATCH updates status, DELETE removes it
- **Time**: 5 min

### Task 2.2: Dashboard stats route
- **Files**: `server/routes/dashboard.ts`
- **Endpoints**: GET `/api/dashboard/stats`, GET `/api/dashboard/activity`
- **Test**: Returns agent count, task totals, recent activity from database
- **Time**: 3 min

### Task 2.3: Chat route with SSE streaming
- **Files**: `server/routes/chat.ts`
- **Endpoints**: POST `/api/chat` (SSE stream), GET `/api/chat/history`
- **Test**: POST returns SSE stream with `data:` events, history returns saved messages
- **Time**: 5 min

### Task 2.4: Code Summarizer route
- **Files**: `server/routes/summarize.ts`
- **Endpoints**: POST `/api/summarize`
- **Test**: Accepts `{ path, language }`, returns AI-generated summary via Forge API
- **Time**: 4 min

### Task 2.5: Settings routes
- **Files**: `server/routes/settings.ts`
- **Endpoints**: GET/PUT `/api/settings`
- **Test**: PUT saves settings, GET retrieves them
- **Time**: 3 min

### Task 2.6: Agent SSE events route
- **Files**: `server/routes/agents.ts` (add SSE endpoint)
- **Endpoints**: GET `/api/agents/events` (SSE stream)
- **Test**: When agent status changes, connected SSE clients receive the update
- **Time**: 4 min

### Task 2.7: Register all routes in server/index.ts
- **Files**: `server/index.ts`
- **Action**: Import and mount all route modules
- **Verification**: All endpoints respond correctly
- **Time**: 2 min

---

## Phase 3: Frontend Integration

### Task 3.1: Create API client utility
- **Files**: `client/src/lib/api.ts`
- **Action**: Create typed fetch wrappers for all API endpoints, SSE helpers
- **Time**: 4 min

### Task 3.2: Create React hooks for data fetching
- **Files**: `client/src/hooks/useAgents.ts`, `client/src/hooks/useChat.ts`, `client/src/hooks/useDashboard.ts`, `client/src/hooks/useSettings.ts`
- **Action**: Custom hooks wrapping API calls with loading/error states
- **Time**: 5 min

### Task 3.3: Wire Dashboard page to live data
- **Files**: `client/src/pages/Dashboard.tsx`
- **Action**: Replace mock data with `useDashboard()` hook
- **Time**: 4 min

### Task 3.4: Wire Agents page to live data
- **Files**: `client/src/pages/Agents.tsx`
- **Action**: Replace mock data with `useAgents()` hook, add SSE listener for real-time status
- **Time**: 5 min

### Task 3.5: Wire Chat page to streaming API
- **Files**: `client/src/pages/Chat.tsx`
- **Action**: Replace simulated typing with SSE streaming from `/api/chat`
- **Time**: 5 min

### Task 3.6: Wire Code Summarizer page to API
- **Files**: `client/src/pages/CodeSummarizer.tsx`
- **Action**: Replace mock analysis with `/api/summarize` call
- **Time**: 3 min

### Task 3.7: Wire Settings page to API
- **Files**: `client/src/pages/Settings.tsx`
- **Action**: Load/save settings via `/api/settings`
- **Time**: 3 min

---

## Phase 4: Code Review and GitHub Push

### Task 4.1: TypeScript check
- **Action**: Run `npx tsc --noEmit` and fix any errors
- **Time**: 3 min

### Task 4.2: Code review against DESIGN-v2.md
- **Action**: Verify all acceptance criteria are met
- **Time**: 5 min

### Task 4.3: Push to GitHub
- **Action**: Push to `Chieji/ECHOMEN` or create new repo
- **Time**: 3 min

---

## MoSCoW Priority Matrix

| Priority | Items |
|----------|-------|
| **Must Have** | Agents CRUD, Chat streaming, Dashboard live stats, Database schema, GitHub push |
| **Should Have** | Code Summarizer API, Settings persistence, Activity log, Agent SSE events |
| **Could Have** | Chat history pagination, Agent execution logs, Search functionality |
| **Won't Have (this iteration)** | Multi-user support, Rate limiting, Echoctl CLI integration, File upload |
