# ECHOMEN — Enterprise AI Orchestration Platform

**Orchestrate, manage, and scale AI agents with a modern, intuitive web dashboard.** ECHOMEN is a full-stack platform designed for developers and teams who need real-time control over AI workflows, agent management, and intelligent task execution.

![ECHOMEN Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node](https://img.shields.io/badge/Node-22%2B-green) ![React](https://img.shields.io/badge/React-19-61dafb)

---

## 🎯 What is ECHOMEN?

ECHOMEN is the **web control center** for the **Echoctl** AI orchestration system. While Echoctl provides the powerful CLI brain (BDI engine, 14+ AI providers, multi-layer memory), ECHOMEN delivers the **visual interface** to manage agents, run conversations, analyze code, and monitor system health in real-time.

**Together, they form a complete AI agent management ecosystem:**

| Component | Role | Repository |
|-----------|------|-----------|
| **Echoctl** | CLI brain with BDI engine, provider chain, memory management | [Chieji/Echoctl](https://github.com/Chieji/Echoctl) |
| **ECHOMEN** | Web dashboard for agent management, chat, code analysis | [Chieji/ECHOMEN](https://github.com/Chieji/ECHOMEN) |

---

## ✨ Key Features

### 🎛️ Dashboard
- **Real-time KPIs** — Active agents, completed tasks, response times, system load
- **Activity Timeline** — Audit trail of all agent actions and task executions
- **Echoctl CLI Bridge** — Live connection status, provider health, memory overview
- **Quick Actions** — One-click agent creation, chat initiation, code analysis

### 🤖 Agent Management
- **Full CRUD Operations** — Create, configure, update, and delete AI agents
- **Multi-Provider Support** — Choose from 14+ AI providers (GPT-4, Claude, Gemini, etc.)
- **Real-time Status Streaming** — SSE-based live updates on agent state
- **Advanced Configuration** — Fine-tune memory settings, tool access, behavior parameters

### 💬 AI Chat Interface
- **Streaming Responses** — Real-time AI responses with progressive rendering
- **Persistent History** — All conversations stored and searchable
- **Rich Markdown Support** — Full formatting, code blocks, and syntax highlighting
- **Presence Indicators** — See when agents are thinking or responding

### 📊 Code Analyzer
- **AI-Powered Summarization** — Automatic code analysis and documentation generation
- **Multi-Language Support** — TypeScript, Python, JavaScript, Go, Rust, and more
- **Echoctl Integration** — Leverages CLI's summarization engine
- **Export Results** — Download summaries in multiple formats

### ⚙️ Settings & Configuration
- **Echoctl CLI Setup** — Step-by-step connection and configuration guide
- **API Key Management** — Secure credential storage and rotation
- **User Profiles** — Customizable preferences and workspace settings
- **System Monitoring** — Resource usage, performance metrics, debug logs

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   ECHOMEN Web UI Layer                       │
│        React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui   │
├──────────────────────────────────────────────────────────────┤
│  Dashboard  │  Agents  │  Chat  │  Code Analyzer  │  Settings │
├──────────────────────────────────────────────────────────────┤
│              tRPC Backend (Express + Node.js)                │
│  ├─ Agent CRUD Procedures                                   │
│  ├─ Chat Management & Streaming                             │
│  ├─ Code Analysis Pipeline                                  │
│  └─ Real-time SSE Streams                                   │
├──────────────────────────────────────────────────────────────┤
│           Database Layer (PostgreSQL + Drizzle ORM)          │
│  ├─ Users & Authentication (Supabase Auth)                  │
│  ├─ Agent Configurations                                     │
│  ├─ Chat History & Messages                                 │
│  ├─ User Settings & Preferences                             │
│  └─ Activity Audit Log                                      │
├──────────────────────────────────────────────────────────────┤
│         Echoctl CLI (WebSocket Bridge Connection)            │
│  ├─ BDI Engine (Belief-Desire-Intention)                    │
│  ├─ 14+ AI Provider Chain                                   │
│  ├─ Multi-Layer Memory (Working, Episodic, Long-term)       │
│  └─ Tool Execution & Integration                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 22 or higher
- **pnpm** 10 or higher (or npm/yarn)
- **Supabase** account (free tier available)
- **Echoctl** CLI installed locally (optional, for full integration)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Chieji/ECHOMEN.git
cd ECHOMEN

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Configure Supabase credentials
# Get these from https://supabase.com/dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 5. Initialize database
pnpm db:push

# 6. Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### First-Time Setup

1. **Sign up** with email or OAuth (Google, GitHub, Discord)
2. **Connect Echoctl** using the Settings panel
3. **Create your first agent** from the Agents page
4. **Start chatting** with your AI agent

---

## 📦 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 | Modern UI framework |
| **UI Components** | shadcn/ui, Radix UI | Accessible component library |
| **Backend** | Express 4, tRPC 11, Node.js | Type-safe API layer |
| **Database** | PostgreSQL, Supabase, Drizzle ORM | Data persistence |
| **Authentication** | Supabase Auth, JWT | Secure user sessions |
| **Real-time** | Server-Sent Events (SSE) | Live agent status updates |
| **Styling** | Glass Horizon Design System | Modern, accessible UI |
| **Testing** | Vitest | Comprehensive test coverage |
| **Build** | Vite, esbuild | Fast development & production builds |

---

## 📁 Project Structure

```
echomen/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── Agents.tsx          # Agent management
│   │   │   ├── Chat.tsx            # AI chat interface
│   │   │   ├── CodeSummarizer.tsx  # Code analysis
│   │   │   ├── Settings.tsx        # User settings
│   │   │   ├── SignIn.tsx          # Authentication
│   │   │   └── SignUp.tsx          # Registration
│   │   ├── components/             # Reusable UI components
│   │   ├── contexts/               # React contexts (Auth, Theme)
│   │   ├── lib/                    # Utilities & helpers
│   │   │   ├── supabase.ts         # Supabase client
│   │   │   └── trpc.ts             # tRPC client setup
│   │   ├── App.tsx                 # Main app component
│   │   └── index.css               # Glass Horizon theme
│   └── index.html
├── server/                          # Express backend
│   ├── routers.ts                  # tRPC procedure definitions
│   ├── db.ts                       # Database query helpers
│   ├── storage.ts                  # S3 file storage integration
│   ├── supabase-auth.test.ts       # Auth tests
│   ├── routers.test.ts             # API tests
│   └── _core/                      # Framework internals
├── drizzle/                         # Database schema & migrations
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # Migration files
├── shared/                          # Shared types & constants
├── vitest.config.ts                # Test configuration
├── vite.config.ts                  # Vite configuration
├── package.json
└── README.md
```

---

## 🔗 Connecting to Echoctl

ECHOMEN communicates with Echoctl via a WebSocket bridge. To enable full integration:

```bash
# In your Echoctl installation, run:
echoctl connect --url https://your-echomen-instance.com

# For local development:
echoctl connect --url http://localhost:3000
```

This establishes a persistent connection that enables:
- ✅ Real-time agent status updates
- ✅ Live task execution feedback
- ✅ Memory synchronization
- ✅ Tool execution results
- ✅ Provider chain monitoring

---

## 🧪 Testing

ECHOMEN includes comprehensive test coverage for all critical paths:

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test supabase-auth
pnpm test routers

# Watch mode for development
pnpm test --watch

# Coverage report
pnpm test --coverage
```

**Test Coverage:**
- ✓ Supabase Auth (4 tests)
- ✓ tRPC Routers (14 tests)
- ✓ Backend Routes (5 tests)
- ✓ Database Queries (8 tests)

---

## 🎨 Design System: Glass Horizon

ECHOMEN uses **Glass Horizon**, a modern design system inspired by Apple Vision Pro and Linear.app:

- **Color Palette**: Deep navy (`#0c1222`) with violet-blue gradients (`#6366f1` → `#8b5cf6`)
- **Typography**: Sora (headings), Inter (body), Geist Mono (code)
- **Components**: Frosted glass panels, ambient background orbs, smooth gradient accents
- **Animations**: Framer Motion transitions for fluid interactions
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation

---

## 📊 Database Schema

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | User accounts & auth | id, email, name, role, onboarding_completed |
| **agents** | AI agent configurations | id, user_id, name, model, status, created_at |
| **chat_messages** | Conversation history | id, user_id, agent_id, role, content, created_at |
| **settings** | User preferences | user_id, key, value |
| **activity_log** | Audit trail | id, user_id, action, status, timestamp |

See `drizzle/schema.ts` for complete schema definition.

---

## 🔐 Authentication

ECHOMEN uses **Supabase Auth** for secure, scalable authentication:

- **Email/Password** — Traditional registration and login
- **OAuth Providers** — Google, GitHub, Discord
- **Password Reset** — Email-based account recovery
- **Session Management** — Persistent login with JWT tokens
- **MFA Ready** — Support for multi-factor authentication

---

## 🌐 Deployment

### Local Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Environment Variables Required
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://user:password@host/dbname

# LLM Integration (optional)
BUILT_IN_FORGE_API_URL=https://api.example.com
BUILT_IN_FORGE_API_KEY=your-key
```

### Deployment Platforms

**Railway, Render, Vercel, or Self-hosted:**
1. Set environment variables in platform settings
2. Run migrations: `pnpm db:push`
3. Build command: `pnpm build`
4. Start command: `pnpm start`

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes and commit
git commit -m 'Add amazing feature'

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

**Development Guidelines:**
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 Environment Variables Reference

```env
# Frontend Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Backend Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJ... (service role key)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/echomen

# JWT
JWT_SECRET=your-secret-key-here

# OAuth (optional)
VITE_OAUTH_PORTAL_URL=https://oauth.example.com
OAUTH_SERVER_URL=https://oauth.example.com
VITE_APP_ID=your-app-id
```

---

## 📄 License

MIT License — See [LICENSE](LICENSE) file for details.

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **Echoctl** | CLI brain with BDI engine & provider chain | [Chieji/Echoctl](https://github.com/Chieji/Echoctl) |
| **ECHOMEN** | Web dashboard for AI orchestration | [Chieji/ECHOMEN](https://github.com/Chieji/ECHOMEN) |

---

## 📧 Support & Community

- **Issues & Bugs** — [Open an issue](https://github.com/Chieji/ECHOMEN/issues)
- **Discussions** — [GitHub Discussions](https://github.com/Chieji/ECHOMEN/discussions)
- **Documentation** — [Echoctl Docs](https://github.com/Chieji/Echoctl)

---

## 🎯 Roadmap

- [ ] Onboarding wizard for first-time users
- [ ] Memory viewer for browsing agent memory layers
- [ ] Provider health dashboard with real-time metrics
- [ ] Webhook notifications for task completion
- [ ] Advanced agent scheduling and automation
- [ ] Team collaboration features
- [ ] API rate limiting and usage analytics
- [ ] Mobile app (React Native)

---

**Built with ❤️ by Chieji**

*ECHOMEN is an open-source project dedicated to making AI agent orchestration accessible, powerful, and intuitive.*
