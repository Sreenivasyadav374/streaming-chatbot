# Project Summary — AI Chat Assistant

A comprehensive technical and functional overview of the AI Chat Assistant application.

---

## 1. Project Overview & Objectives

### What the application does

AI Chat Assistant is a production-ready, real-time conversational AI chatbot. It lets a user sign in, start multiple chat threads, exchange messages with an AI assistant, and have those conversations streamed back token-by-token and persisted to a database so they survive page reloads.

### Core problem it solves

Most AI chat demos are stateless — refresh the page and the conversation is gone, or the AI's answer appears all at once after a long wait. This app solves three things at once:

- **Persistence** — every chat and message is stored in a Postgres database, tied to the signed-in user.
- **Real-time UX** — responses are streamed live (token-by-token) instead of arriving as a single block.
- **Structured AI output** — the AI can call "tools" that render as purpose-built UI cards (weather, task lists, recipes) instead of plain text.

### Target user

A developer or technical end-user who wants a personal AI workspace: multiple conversation threads, fast streaming responses, file/image attachments, and the ability to switch between AI "personas" (e.g. Code Expert, Content Strategist, Friendly Tutor) depending on the task.

---

## 2. Key Features & Functionality

### Authentication & Access Control
- **Email / password sign-in** via Supabase Auth.
- **Magic link** passwordless sign-in (email-based OTP).
- **Middleware route protection** — unauthenticated visitors are redirected to `/login`; authenticated users visiting `/login` are bounced back to the dashboard.
- **Row Level Security (RLS)** on every database table so a user can only read/write their own chats and messages.
- **Sign-out** button in the sidebar that clears the session and returns to login.

### Chat Experience
- **Multi-thread conversations** — create, switch between, and delete independent chat sessions from the sidebar.
- **Real-time token streaming** via Server-Sent Events (SSE) using the Vercel AI SDK.
- **Automatic title generation** — on the first message of a new chat, the AI generates a short descriptive title and writes it to the database before streaming begins.
- **Persistent message history** — reloading a chat rehydrates the full conversation from Supabase.
- **File / image attachments** — users can attach an image which is sent to the AI as a multipart message.
- **Optimistic UI updates** — deleting a chat removes it from the sidebar instantly and rolls back if the server delete fails.
- **"New Chat" button** that creates a chat row in the database, dispatches an optimistic sidebar event, and routes to the new chat.

### AI Tool Calling (Generative UI)
The AI can invoke structured tools that render as custom UI cards inside the chat:

| Tool | Purpose | Renders as |
|------|---------|------------|
| `showWeather` | Return weather for a city | `WeatherCard` |
| `showTasks` | Build a checklist of tasks | `TaskCard` |
| `showRecipe` | Generate a full recipe (ingredients, steps, timings) | `RecipeCard` |

Tool inputs are validated with **Zod schemas** before execution.

### AI Personas
Five built-in personas, each with a tailored system prompt:
1. Code Expert
2. Content Strategist
3. Friendly Tutor
4. Technical Writer
5. Creative Brainstorm Partner

A dialog UI exists for creating **custom personas** (name, description, system prompt).

### UI / UX
- **Responsive layout** — desktop sidebar, mobile slide-in drawer with backdrop.
- **Loading states** — a branded "Initializing Workspace" loader while a chat hydrates.
- **Empty state** with clickable suggestion prompts.
- **Markdown rendering** with GitHub-flavored markdown support in assistant messages.
- **Stop button** to abort a streaming response.
- **Auto-scroll** to the latest message.

---

## 3. Tech Stack & Libraries

### Frontend Framework & Language
- **Next.js 14** (App Router) — server components, API routes, route groups `(auth)` and `(dashboard)`.
- **React 18**.
- **TypeScript 5.2** (strict mode).

### Styling & UI Libraries
- **Tailwind CSS 3.3** with a CSS-variable theme system (light/dark ready).
- **shadcn/ui** + **Radix UI** primitives (dialog, select, tabs, dropdown, sheet, tooltip, etc.).
- **Lucide React** icons.
- **`tailwindcss-animate`** for transitions.
- **`class-variance-authority`** + **`clsx`** + **`tailwind-merge`** for conditional class composition.

### State Management & Routing
- **Zustand 5** for client-side chat list state (`store/useChatStore.tsx`).
- **Next.js App Router** for file-based routing and nested layouts.
- **`@ai-sdk/react`** `useChat` hook for streaming chat state inside `hooks/useChatWindow.tsx`.

### Backend / Database / BaaS
- **Supabase** — Postgres database, Auth, and RLS policies.
  - Tables: `chats`, `messages`, `personas`.
  - Server client: `lib/supabase/server.ts` (cookie-based).
  - Browser client: `lib/supabase/client.ts`.
- **Next.js API Routes** as the server layer:
  - `POST /api/chat` — streaming chat endpoint.
  - `POST /api/chat/update-title` — title updates.
  - `GET /api/auth/callback` — OAuth/magic-link callback.

### Third-Party APIs / Integrations
- **Google Gemini** (`gemini-2.5-flash`) via `@ai-sdk/google` for chat responses, title generation, and tool calling.
- **Vercel AI SDK 6** (`ai`, `@ai-sdk/react`, `@ai-sdk/rsc`) for streaming protocol, tool definitions, and message conversion.
- **`@vercel/functions`** `waitUntil` to persist the assistant message after the stream finishes without blocking the response.
- **date-fns** for timestamp formatting.
- **react-markdown** + **remark-gfm** for markdown rendering.

> Note: `lib/openai.ts` and `lib/gemini.ts` (legacy `@google/generative-ai` direct client) exist as alternate-provider scaffolding but the active chat path uses the Vercel AI SDK + `@ai-sdk/google`.

---

## 4. Architecture & How It Works

### High-level data flow

```
Browser  ──POST /api/chat──▶  Next.js API Route
                                  │
                                  ├─ Supabase auth.getUser()  (verify session)
                                  ├─ Insert user message into `messages`
                                  ├─ If first message: generateText() → update `chats.title`
                                  ├─ streamText() with tools ──▶ Google Gemini
                                  │       ◀── token stream (SSE) ──
                                  └─ onFinish → waitUntil(insert assistant message)
Browser  ◀── toUIMessageStreamResponse() ──
```

### Request lifecycle (single message)
1. User types and hits send in `ChatInput`.
2. `useChatWindow` calls `sendMessage()` from the `useChat` hook, passing `chatId` in the request body.
3. `POST /api/chat` verifies the user via Supabase, inserts the user message into the `messages` table.
4. If this is the first message, it synchronously generates a title with `generateText()` and updates the `chats` row.
5. `streamText()` is called with the Gemini model, a system prompt, and the three tools. The result is returned as a UI message stream.
6. As tokens arrive, the browser renders them live via the `MessageList` / `MessagePartRenderer`.
7. When the stream finishes, `onFinish` fires and `waitUntil()` persists the assistant message (text or tool-call JSON) to the database.
8. `onFinish` on the client triggers `router.refresh()` so the sidebar reflects any title change.

### State management
- **Server state** — chats and messages live in Supabase and are fetched in server components (`layout.tsx`, `chat/[chatId]/page.tsx`).
- **Client state (Zustand)** — the sidebar chat list is mirrored into a Zustand store so optimistic create/delete can happen without a full server round-trip. The store snapshots previous state and rolls back on failure.
- **Chat stream state** — the `useChat` hook from `@ai-sdk/react` owns the streaming `messages`, `status`, and `stop` controls for the active conversation.

### Authentication flow
- Middleware (`middleware.ts`) runs on every matched route, refreshes the Supabase session via `getUser()`, and gates private routes.
- Login page supports both `signInWithPassword` and `signInWithOtp` (magic link → `/api/auth/callback` → session exchange → redirect).

### Generative UI rendering
Messages are normalized into a `parts[]` array. `MessagePartRenderer` inspects each part's `type`:
- `text` → `MarkdownRenderer`
- `tool-showWeather` (with `output-available`) → `WeatherCard`
- `tool-showTasks` → `TaskCard`
- `tool-showRecipe` → `RecipeCard`
- `file` → inline image preview

### Security model
- RLS enabled on `chats`, `messages`, and `personas`.
- All API routes re-verify `auth.getUser()` before doing work (defense in depth).
- The Gemini API key is server-side only; only the Supabase anon key is exposed to the browser (protected by RLS).
- Title update endpoint scopes updates with `.eq("user_id", user.id)`.

---

## 5. Project File Structure

```
project/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group (no sidebar)
│   │   ├── layout.tsx                #   centered card layout
│   │   └── login/page.tsx            #   login (password + magic link)
│   ├── (dashboard)/                  # Main app route group (sidebar)
│   │   ├── layout.tsx                #   dashboard layout, fetches chats
│   │   ├── page.tsx                  #   home — creates a new chat & redirects
│   │   └── chat/[chatId]/page.tsx    #   chat session page, loads history
│   ├── api/
│   │   ├── auth/callback/route.ts    #   OAuth/magic-link callback
│   │   └── chat/
│   │       ├── route.ts              #   streaming chat endpoint
│   │       ├── tools.ts              #   AI tool definitions
│   │       ├── schema.ts             #   Zod schemas for tools
│   │       └── update-title/route.ts #   title update endpoint
│   ├── globals.css                   # Tailwind + theme variables
│   └── layout.tsx                    # Root layout, font, metadata
│
├── components/
│   ├── auth/SignOutButton.tsx        # Sign-out action
│   ├── cards/                        # Generative UI tool cards
│   │   ├── WeatherCard.tsx
│   │   ├── TaskCard.tsx
│   │   └── RecipeCard.tsx
│   ├── chat/                         # Chat UI surface
│   │   ├── ChatWindow.tsx            #   top-level chat container
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── EmptyState.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessagePartRenderer.tsx   #   routes parts → cards/markdown
│   │   ├── MarkDownRenderer.tsx
│   │   ├── SidebarChatList.tsx       #   Zustand-backed chat list
│   │   ├── SidebarChatItem.tsx       #   single chat row + delete
│   │   ├── NewChatButton.tsx
│   │   ├── MobileSidebarDrawer.tsx
│   │   ├── WorkspaceLoader.tsx       #   branded loading state
│   │   └── loading.tsx
│   ├── PersonaSelector.tsx           # Persona dropdown
│   ├── CustomPersonaDialog.tsx       # Create custom persona modal
│   ├── TypingIndicator.tsx
│   ├── ConnectionStatus.tsx
│   ├── MessageBubble.tsx             # Legacy standalone bubble
│   └── ui/                           # shadcn/ui primitives (40+ files)
│
├── hooks/
│   ├── useChatWindow.tsx             # Streaming chat state + input logic
│   └── use-toast.ts                  # Toast hook
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client (cookies)
│   ├── personas.ts                   # Built-in persona definitions
│   ├── gemini.ts                     # Legacy direct Gemini client
│   ├── openai.ts                     # Alternate provider scaffold
│   └── utils.ts                      # cn() class merge helper
│
├── store/
│   ├── useChatStore.tsx              # Zustand chat list store
│   └── __tests__/useChatStore.test.ts# Rollback unit test (Vitest)
│
├── types/
│   ├── chat.ts                       # Message / connection types
│   └── persona.ts                   # Persona interface
│
├── supabase/migrations/              # SQL migrations (personas table)
├── middleware.ts                     # Auth route protection
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json                   # shadcn/ui config
├── package.json
└── netlify.toml                      # Netlify deploy config
```

---

## 6. Setup & Deployment Guide

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase project (URL + anon key)
- A Google AI Studio API key (for Gemini)

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Configure environment variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI provider (server-side only)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
```

> The Supabase service role key is optional and must NEVER be exposed to the browser.

### Step 3 — Set up the database

Create the `chats` and `messages` tables in Supabase (via the SQL editor or migrations), enable RLS, and add ownership-scoped policies. Minimum schema:

```sql
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text DEFAULT 'New Chat Session',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL,
  content jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Per-verb policies scoped to auth.uid() = user_id (see project RLS guidance)
```

### Step 4 — Run locally

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

### Step 5 — Verify the build

```bash
npm run typecheck   # TypeScript checks
npm run lint        # ESLint
npm run build       # Production build
```

### Step 6 — Run tests

```bash
npm test            # Vitest (includes the Zustand rollback test)
```

### Deployment

**Netlify (configured via `netlify.toml`):**
1. Connect the repository to Netlify.
2. Set the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`) in the Netlify dashboard.
3. Deploy on push to `main`.

**Vercel:**
1. Import the project in Vercel.
2. Add the same environment variables.
3. Deploy.

**Self-hosted:**
```bash
npm run build
npm run start      # serves on port 3000
```

---

### Summary

AI Chat Assistant is a full-stack, streaming-first chatbot: Next.js 14 App Router on the front, Supabase (Postgres + Auth + RLS) on the back, and Google Gemini via the Vercel AI SDK in the middle. It persists every conversation, streams responses live, renders structured AI tool output as custom UI cards, supports multiple AI personas and image attachments, and ships with a responsive sidebar/drawer layout ready for mobile and desktop.
