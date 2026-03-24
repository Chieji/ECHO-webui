# Onboarding Wizard Implementation Plan

## Phase 1: Database Schema Updates

**Task 1.1** — Update `users` table schema
- Add `onboarding_completed` (boolean, default: false)
- Add `onboarding_step` (int, default: 0)
- Add `first_agent_created` (boolean, default: false)
- Run migration: `pnpm db:push`

**Task 1.2** — Create `onboarding_sessions` table
- Store CLI connection attempts and status
- Track wizard progress per user
- Columns: user_id, step, cli_connected, agent_created_id, created_at, updated_at

## Phase 2: Backend tRPC Routers

**Task 2.1** — Create `onboarding.getStatus` procedure
- Returns current wizard step and completion status
- Returns CLI connection status
- Returns first agent info if created

**Task 2.2** — Create `onboarding.updateStep` procedure
- Save wizard progress (which step user is on)
- Persist CLI connection status
- Mark wizard as complete when step 5 is done

**Task 2.3** — Create `onboarding.checkCliStatus` procedure
- Poll for Echoctl WebSocket connection
- Return connection status (connected/disconnected/error)
- Timeout after 30 seconds

**Task 2.4** — Create `onboarding.createFirstAgent` procedure
- Wrapper around `agents.create` 
- Mark `first_agent_created = true` after success
- Return created agent details

## Phase 3: Frontend UI Components

**Task 3.1** — Create `OnboardingWizard.tsx`
- Main container component
- Step tracking and navigation
- Progress bar at top
- Conditional rendering of steps

**Task 3.2** — Create individual step components
- `StepWelcome.tsx` — Welcome screen with intro
- `StepEchoctlSetup.tsx` — CLI installation check
- `StepConnectCLI.tsx` — WebSocket connection status
- `StepCreateAgent.tsx` — Agent creation form
- `StepTestTask.tsx` — Test task execution

**Task 3.3** — Create `WizardProgress.tsx`
- Visual progress indicator
- Step circles with numbers
- Current step highlight

**Task 3.4** — Create `WizardStep.tsx`
- Reusable wrapper for each step
- Header with step title
- Footer with Next/Back buttons
- Loading states

## Phase 4: Wizard Logic & State

**Task 4.1** — Create `useOnboarding` hook
- Manage wizard state (current step, completion)
- Handle step navigation (next, back, skip)
- Persist progress to database

**Task 4.2** — Create `useCliConnection` hook
- Poll for Echoctl WebSocket connection
- Handle connection status updates
- Retry logic with exponential backoff

**Task 4.3** — Integrate wizard into `App.tsx`
- Show wizard for users with `onboarding_completed = false`
- Hide dashboard until wizard complete
- Allow skip option (optional)

## Phase 5: Testing

**Task 5.1** — Write vitest tests
- Test wizard step navigation
- Test CLI connection detection
- Test agent creation flow
- Test wizard completion

**Task 5.2** — Manual testing checklist
- [ ] Welcome step displays correctly
- [ ] CLI setup step shows installation instructions
- [ ] Connection polling works
- [ ] Agent creation form validates input
- [ ] Test task executes and shows response
- [ ] Wizard completion redirects to dashboard
- [ ] Progress persists if user closes wizard mid-way

## Deliverables

1. Updated database schema with onboarding fields
2. 5 tRPC procedures for wizard backend
3. 5 wizard step components + progress indicator
4. Wizard logic hooks and state management
5. Integration into App.tsx with conditional rendering
6. 10+ vitest tests covering wizard flow
7. Updated README with onboarding documentation

## Timeline

- Phase 1 (Schema): 10 min
- Phase 2 (Backend): 30 min
- Phase 3 (UI): 45 min
- Phase 4 (Logic): 20 min
- Phase 5 (Testing): 20 min
- **Total: ~2 hours**

## Success Criteria

- ✅ First-time users see wizard on login
- ✅ Wizard guides through all 5 steps
- ✅ Echoctl connection detected automatically
- ✅ Agent created successfully
- ✅ Test task runs and shows response
- ✅ Wizard marked complete in database
- ✅ All 23+ tests pass
- ✅ Zero TypeScript errors
