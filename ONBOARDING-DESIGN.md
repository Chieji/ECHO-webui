# Onboarding Wizard Design

## Overview

A 5-step guided wizard for first-time users to:
1. **Welcome** — Introduce ECHOMEN and Echoctl
2. **Echoctl Setup** — Download/verify Echoctl CLI installation
3. **Connect CLI** — Establish WebSocket bridge between CLI and web UI
4. **Create Agent** — Configure first AI agent with provider selection
5. **Run Test Task** — Execute a sample task to verify everything works

## Wizard Flow

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Welcome                                         │
│ • Explain ECHOMEN + Echoctl relationship               │
│ • Show what they'll accomplish                         │
│ • "Get Started" button → Step 2                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Echoctl Setup                                   │
│ • Check if Echoctl is installed locally                │
│ • Show installation command if not found               │
│ • Verify installation status                           │
│ • "Next" → Step 3                                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Connect CLI                                     │
│ • Show WebSocket connection command                    │
│ • Display connection status (polling)                  │
│ • Verify connection successful                         │
│ • "Next" → Step 4                                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Create Agent                                    │
│ • Agent name input                                      │
│ • Provider selection (dropdown)                        │
│ • Model selection based on provider                    │
│ • Memory settings (optional)                           │
│ • "Create Agent" → Step 5                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Step 5: Test Task                                       │
│ • Run a simple test query with the agent               │
│ • Display streaming response                           │
│ • Show success message                                 │
│ • "Finish" → Dashboard                                 │
└─────────────────────────────────────────────────────────┘
```

## Database Changes

Add to `users` table:
- `onboarding_completed` (boolean, default: false)
- `onboarding_step` (int, default: 0) — Track where user left off
- `first_agent_created` (boolean, default: false)

## UI Components

1. **OnboardingWizard** — Main container with step tracking
2. **WizardStep** — Reusable step wrapper with header/footer
3. **StepWelcome** — Welcome screen
4. **StepEchoctlSetup** — CLI installation check
5. **StepConnectCLI** — WebSocket connection status
6. **StepCreateAgent** — Agent creation form
7. **StepTestTask** — Test task execution
8. **WizardProgress** — Progress indicator at top

## API Endpoints

- `POST /api/trpc/onboarding.updateStep` — Save wizard progress
- `POST /api/trpc/onboarding.completeWizard` — Mark as complete
- `GET /api/trpc/onboarding.checkCliStatus` — Check Echoctl connection
- `POST /api/trpc/agents.createFirstAgent` — Create first agent
- `POST /api/trpc/chat.runTestTask` — Execute test query

## Styling

- Use Glass Horizon theme (frosted panels, gradients)
- Progress bar with smooth animations
- Step indicators (circles with numbers)
- Smooth transitions between steps
- Mobile-responsive (single column on mobile)

## Edge Cases

- User closes wizard mid-way → Save progress, resume on next login
- Echoctl not installed → Show installation instructions
- Connection fails → Retry button with helpful error messages
- Agent creation fails → Show error and allow retry
- Test task fails → Suggest debugging steps
