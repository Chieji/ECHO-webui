# ECHOMEN — AI Orchestration Platform

A modern, full-stack web platform for orchestrating AI agents, managing conversations, and analyzing code using the **Echoctl CLI** as the backend engine.

## 🚀 Quick Links

- **ECHOMEN UI Repository**: [Chieji/ECHOMEN](https://github.com/Chieji/ECHOMEN)
- **Echoctl CLI Repository**: [Chieji/Echoctl](https://github.com/Chieji/Echoctl)

## 📋 Overview

**ECHOMEN** is the web dashboard for the **Echoctl** AI orchestration system. Together, they form a complete AI agent management platform:

- **Echoctl** (`Chieji/Echoctl`) — The CLI brain with BDI engine, 14+ AI providers, multi-layer memory, and tool execution
- **ECHOMEN** (`Chieji/ECHOMEN`) — The web UI for managing agents, running tasks, chatting with AI, and analyzing code

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ECHOMEN Web UI                       │
│  (React 19 + Tailwind 4 + shadcn/ui + Glass Horizon)   │
├─────────────────────────────────────────────────────────┤
│  Dashboard │ Agents │ Chat │ Code Summarizer │ Settings │
├─────────────────────────────────────────────────────────┤
│         tRPC Backend (Express + Drizzle ORM)            │
├─────────────────────────────────────────────────────────┤
│  Supabase Auth │ PostgreSQL │ Real-time SSE Streams    │
├─────────────────────────────────────────────────────────┤
│         Echoctl CLI (via WebSocket Bridge)              │
│  (BDI Engine │ 14+ Providers │ Memory │ Tools)          │
└─────────────────────────────────────────────────────────┘
```

## ✨ Features

### Dashboard
- **KPI Stats** — Active agents, tasks completed, response time, system usage
- **Recent Activity** — Timeline of agent actions and task execution
- **Echoctl CLI Bridge** — Connection status, provider health, memory overview
- **Quick Actions** — Create agents, start chat, analyze code

### Agent Management
- **Agent CRUD** — Create, read, update, delete AI agents
- **Provider Selection** — Choose from Echoctl's 14+ AI providers
- **Real-time Status** — SSE streaming for live agent status updates
- **Agent Configuration** — Memory settings, tool access, behavior tuning

### Chat Interface
- **AI Conversations** — Real-time streaming responses from Echoctl
- **Message History** — Persistent chat logs with database storage
- **Markdown Support** — Rich text rendering with `streamdown`
- **Typing Indicators** — Real-time user presence

### Code Summarizer
- **File Analysis** — Upload code files for AI-powered summarization
- **Multi-language Support** — Analyze TypeScript, Python, JavaScript, etc.
- **Echoctl Integration** — Uses `echoctl summarize <path>` command
- **Results Display** — Formatted summaries with syntax highlighting

### Settings
- **Echoctl CLI Setup** — Configuration and connection instructions
- **API Keys** — Manage Supabase and Echoctl credentials
- **User Profile** — Edit name, email, preferences
- **System Settings** — Theme, notifications, privacy

## 🔐 Authentication

**Supabase Auth** with multiple sign-in options:
- Email/password registration and login
- OAuth providers: Google, GitHub, Discord
- Password reset via email
- Session management with persistent login

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend** | Express 4, tRPC 11, Node.js |
| **Database** | PostgreSQL (Supabase), Drizzle ORM |
| **Auth** | Supabase Auth, JWT |
| **Real-time** | Server-Sent Events (SSE) for agent status |
| **Styling** | Glass Horizon design system with OKLCH colors |
| **Testing** | Vitest with 23+ test cases |

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- Supabase account
- Echoctl CLI installed locally

### Installation

```bash
# Clone the repository
git clone https://github.com/Chieji/ECHOMEN.git
cd ECHOMEN

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Configure Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Push database schema
pnpm db:push

# Start dev server
pnpm dev
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test supabase-auth

# Watch mode
pnpm test --watch
```

### Building for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
echomen-ui-overhaul/
├── client/                      # React frontend
│   ├── src/
│   │   ├── pages/              # Page components (Dashboard, Agents, Chat, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React contexts (Auth, Theme)
│   │   ├── lib/                # Utilities (Supabase client, tRPC)
│   │   └── index.css           # Glass Horizon theme
│   └── index.html
├── server/                      # Express backend
│   ├── routers.ts              # tRPC procedure definitions
│   ├── db.ts                   # Database query helpers
│   ├── storage.ts              # S3 file storage helpers
│   └── _core/                  # Framework internals
├── drizzle/                     # Database schema & migrations
│   └── schema.ts               # Table definitions
├── shared/                      # Shared types and constants
├── vitest.config.ts            # Test configuration
├── package.json
└── README.md
```

## 🔗 Connecting to Echoctl

To bridge ECHOMEN with Echoctl, run the CLI connection command:

```bash
# In your Echoctl installation
echoctl connect --url https://your-echomen-instance.com

# Or for local development
echoctl connect --url http://localhost:3000
```

This establishes a WebSocket connection between the CLI and the web dashboard, enabling:
- Real-time agent status updates
- Live task execution feedback
- Memory synchronization
- Tool execution results

## 📊 Database Schema

**Users** — Supabase Auth managed
**Agents** — AI agent configurations and metadata
**ChatMessages** — Conversation history
**Settings** — User preferences and system config
**ActivityLog** — Audit trail of actions

See `drizzle/schema.ts` for full schema definition.

## 🧪 Testing

All critical paths are covered with Vitest:

```bash
# Test categories
✓ Supabase Auth (4 tests)
✓ tRPC Routers (14 tests)
✓ Backend Routes (5 tests)
```

Run tests before deploying:
```bash
pnpm test
```

## 🎨 Design System

**Glass Horizon** — A modern, translucent design inspired by Apple Vision Pro and Linear.app

- **Colors**: Deep navy (`#0c1222`) with violet-blue gradients
- **Typography**: Sora (headings), Inter (body), Geist Mono (code)
- **Components**: Frosted glass panels, ambient background orbs, gradient accents
- **Animations**: Smooth framer-motion transitions

## 🌐 Deployment

ECHOMEN is designed for **Manus** built-in hosting with custom domain support:

1. Save a checkpoint in the Manus UI
2. Click **Publish** to deploy
3. Configure custom domain in **Settings > Domains**

For external hosting (Railway, Render, Vercel), ensure:
- Environment variables are set
- Database migrations are run (`pnpm db:push`)
- Build command: `pnpm build`
- Start command: `pnpm start`

## 📝 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://user:password@host/dbname

# OAuth
VITE_OAUTH_PORTAL_URL=https://api.manus.im
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=your-app-id

# LLM
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License — See LICENSE file for details

## 🔗 Related Projects

- **Echoctl** — [Chieji/Echoctl](https://github.com/Chieji/Echoctl) — CLI brain with BDI engine
- **Manus** — [manus.im](https://manus.im) — AI agent platform

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [Echoctl documentation](https://github.com/Chieji/Echoctl)
- Visit [Manus Help Center](https://help.manus.im)

---

**Built with ❤️ by Chieji | Powered by Manus**
