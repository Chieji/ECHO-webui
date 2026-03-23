# Design Document: ECHOMEN Full-Stack Upgrade

## 1. Overview

- **Project/Feature Name**: ECHOMEN Full-Stack Upgrade — Backend API, Real-Time Agents, GitHub Push
- **Date**: 2026-03-23
- **Author**: Manus AI
- **Purpose**: Upgrade the static ECHOMEN UI into a full-stack application with a backend server, database, real-time WebSocket communication for agent status, and live API integration for the Chat and Code Summarizer features. Push the completed codebase to GitHub.

## 2. Problem Statement

The current ECHOMEN UI is a static frontend with mock data. It cannot:
1. Communicate with the actual ECHOMEN backend services (agent management, task execution, AI chat).
2. Display real-time agent status updates (running, idle, error transitions happen live).
3. Stream AI chat responses token-by-token for a responsive conversational experience.
4. Persist agent configurations, chat history, or user preferences in a database.
5. Synchronize with the user's GitHub repositories for version control.

## 3. Proposed Solution

### 3.1. User Stories / Requirements

- As a user, I want to see real-time agent status changes so I know which agents are active without refreshing.
- As a user, I want to chat with ECHOMEN and see responses stream in token-by-token, like ChatGPT.
- As a user, I want to create, start, stop, and delete agents through the UI and have those changes persist.
- As a user, I want to run the Code Summarizer on real file paths and get AI-generated summaries.
- As a user, I want my settings (API keys, model preferences) saved in a database.
- As a user, I want the code pushed to my GitHub repository automatically.

### 3.2. Technical Design

#### 3.2.1. Backend Architecture

The upgrade uses `webdev_add_feature("web-db-user")` to add:
- **Express.js backend** with API routes
- **PostgreSQL database** via Drizzle ORM
- **User authentication** via Manus OAuth

**API Routes:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/agents` | List all agents with current status |
| POST | `/api/agents` | Create a new agent |
| PATCH | `/api/agents/:id` | Update agent (start/stop/configure) |
| DELETE | `/api/agents/:id` | Delete an agent |
| GET | `/api/agents/:id/status` | Get real-time agent status |
| POST | `/api/chat` | Send a message and get AI response (streaming SSE) |
| GET | `/api/chat/history` | Get chat history |
| POST | `/api/summarize` | Analyze a codebase path and return summary |
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update user settings |
| GET | `/api/dashboard/stats` | Get dashboard KPI statistics |
| GET | `/api/dashboard/activity` | Get recent activity feed |

#### 3.2.2. Database Schema

**agents table:**
- `id` (serial, PK)
- `name` (varchar, unique)
- `description` (text)
- `model` (varchar) — e.g., "GPT-4o", "Claude 3.5"
- `status` (enum: running, idle, error, stopped)
- `tasks_completed` (integer, default 0)
- `last_active` (timestamp)
- `config` (jsonb) — agent-specific configuration
- `created_at` (timestamp)
- `updated_at` (timestamp)

**chat_messages table:**
- `id` (serial, PK)
- `role` (enum: user, assistant)
- `content` (text)
- `model` (varchar)
- `created_at` (timestamp)

**settings table:**
- `id` (serial, PK)
- `key` (varchar, unique)
- `value` (jsonb)
- `updated_at` (timestamp)

**activity_log table:**
- `id` (serial, PK)
- `action` (text)
- `status` (varchar) — success, running, info, error
- `agent_id` (integer, FK → agents.id, nullable)
- `created_at` (timestamp)

#### 3.2.3. Real-Time Communication

Use **Server-Sent Events (SSE)** for:
- **Chat streaming**: `/api/chat` returns an SSE stream of tokens
- **Agent status updates**: `/api/agents/events` returns an SSE stream of status changes

SSE is chosen over WebSockets because:
- Simpler to implement with Express
- Works through HTTP proxies and CDNs
- Sufficient for server→client push (we don't need bidirectional)
- Native browser support via `EventSource`

#### 3.2.4. Frontend Integration

Each page will be updated to use real API calls:

| Page | Current State | Target State |
|------|--------------|--------------|
| Dashboard | Mock KPI data | Live stats from `/api/dashboard/stats` + `/api/dashboard/activity` |
| Agents | Static agent list | CRUD via `/api/agents`, real-time status via SSE |
| Chat | Simulated responses | Streaming AI via `/api/chat` SSE, history from `/api/chat/history` |
| Code Summarizer | Demo output | Real analysis via `/api/summarize` |
| Settings | No persistence | Save/load via `/api/settings` |

#### 3.2.5. AI Integration Strategy

The backend will use the **BUILT_IN_FORGE_API** (already injected as env vars) for AI operations:
- Chat completions with streaming
- Code summarization via prompt engineering

## 4. Alternatives Considered

| Alternative | Reason Not Chosen |
|-------------|-------------------|
| WebSockets | Overkill for server→client push; SSE is simpler and sufficient |
| tRPC | Adds complexity; standard REST + SSE is more portable |
| SQLite | PostgreSQL is already provided by the platform upgrade |
| Polling for status | Wasteful; SSE provides instant updates with minimal overhead |

## 5. Open Questions / Future Considerations

- **Agent execution engine**: The current backend simulates agent execution. Future work could connect to actual Echoctl CLI for real agent management.
- **Multi-user support**: Current design is single-user. Manus OAuth provides the foundation for multi-user expansion.
- **Rate limiting**: Should be added for AI endpoints in production.

## 6. Acceptance Criteria

1. All API routes return correct responses and handle errors gracefully.
2. Agents can be created, updated, and deleted through the UI with database persistence.
3. Chat messages stream token-by-token via SSE and are saved to the database.
4. Code Summarizer sends real paths to the backend and displays AI-generated summaries.
5. Settings persist across page reloads.
6. Dashboard displays live statistics from the database.
7. Activity log updates in real-time when agents change status.
8. All TypeScript compiles without errors.
9. Code is pushed to the user's GitHub repository.
