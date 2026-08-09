# Development Guide

This guide covers everything you need to know for local development, debugging, and contributing to the AI Chat Assistant.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Code Style & Conventions](#code-style--conventions)
- [Debugging](#debugging)
- [Testing](#testing)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x+ | JavaScript runtime |
| npm | 9.x+ | Package manager |
| VS Code | Latest | Recommended IDE |

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd ai-chat-assistant

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

## Development Environment

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"`]"]
  ]
}
```

### Environment Files

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `.env.example` | Template with placeholders | Yes |
| `.env.local` | Your local credentials | No |
| `.env.development` | Development defaults | Optional |
| `.env.production` | Production defaults | Optional |

### Supabase Local Development (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# View local credentials
supabase status
```

## Project Structure

### Directory Overview

```
project/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication route group
│   ├── (dashboard)/      # Main application routes
│   └── api/              # API route handlers
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── cards/           # Tool result display cards
│   ├── chat/            # Chat interface components
│   └── ui/              # shadcn/ui primitives
├── docs/                 # Documentation
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── store/               # Zustand state stores
├── supabase/           # Database migrations
├── types/              # TypeScript definitions
└── swagger/           # OpenAPI specification
```

### Route Groups

| Group | Path | Purpose |
|-------|------|---------|
| `(auth)` | `/login` | Authentication pages (no sidebar) |
| `(dashboard)` | `/`, `/chat/:id` | Main app (with sidebar) |
| `api` | `/api/*` | Backend endpoints |

## Available Scripts

### Development

```bash
# Start development server (port 3000)
npm run dev

# Start with specific port
PORT=3001 npm run dev

# Start with Turbopack (experimental)
npm run dev --turbo
```

### Building

```bash
# Production build
npm run build

# Analyze bundle size
ANALYZE=true npm run build

# Export static site (if applicable)
npm run build && npm run export
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

### Linting & Type Checking

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# TypeScript type check
npm run typecheck

# Run both
npm run typecheck && npm run lint
```

## Code Style & Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatWindow.tsx` |
| Hooks | camelCase with `use` prefix | `useChatWindow.tsx` |
| Utilities | camelCase | `utils.ts` |
| Types | PascalCase | `chat.ts` |
| API Routes | lowercase | `route.ts` |

### Component Structure

```tsx
// 1. Imports
import { useState } from "react";
import { SomeComponent } from "./SomeComponent";

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onClick: () => void;
}

// 3. Component
export function Component({ title, onClick }: ComponentProps) {
  // 4. Hooks at top
  const [state, setState] = useState("");

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Handlers
  const handleClick = () => {
    onClick();
  };

  // 7. Render
  return (
    <div onClick={handleClick}>
      {title}
    </div>
  );
}
```

### Server vs Client Components

```tsx
// Server Component (default)
// No "use client" directive
// Can fetch data directly

import { createClient } from "@/lib/supabase/server";

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data } = await supabase.from("chats").select("*");

  return <div>{data?.length} chats</div>;
}

// Client Component
// Has "use client" at top
// Uses React hooks

"use client";

import { useState } from "react";

export function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Tailwind CSS Conventions

```tsx
// Use arbitrary values for one-offs
<div className="w-[320px] px-[24px]">

// Group related classes
<button className="
  flex items-center justify-center
  h-10 w-full
  rounded-xl bg-black
  text-sm font-medium text-white
  hover:bg-zinc-800
  disabled:opacity-50
">

// Use class-variance-authority (CVA) for variants
// See components/ui/button.tsx for examples
```

### Import Organization

```tsx
// 1. React/Next
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { createClient } from "@supabase/supabase-js";
import { useChat } from "@ai-sdk/react";

// 3. Internal components
import { Button } from "@/components/ui/button";
import { ChatInput } from "./ChatInput";

// 4. Internal utilities
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// 5. Types
import type { Chat } from "@/types/chat";
```

## Debugging

### Browser DevTools

```javascript
// Log Zustand state
useChatStore.getState();

// Log current messages
console.log("Messages:", messages);
```

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### API Route Debugging

```typescript
// Add logging in API routes
console.log("Request body:", await req.json());

// Check authentication
const { data: { user } } = await supabase.auth.getUser();
console.log("Current user:", user?.id);
```

### Common Debug Scenarios

**Streaming not working:**

```bash
# Check AI SDK is properly configured
console.log("Model:", model.modelId);

# Verify API key
console.log("Gemini key present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
```

**Authentication issues:**

```bash
# Check cookies
document.cookie;

# Check session
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
console.log("Session:", session);
```

## Testing

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- path/to/test.test.ts

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

### Writing Tests

```typescript
// store/__tests__/useChatStore.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore } from "../useChatStore";

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({ chats: [] });
  });

  it("should add a chat", () => {
    const { setChats } = useChatStore.getState();
    setChats([{ id: "1", title: "Test", user_id: "user1" }]);

    const { chats } = useChatStore.getState();
    expect(chats).toHaveLength(1);
  });
});
```

## Common Tasks

### Adding a New API Route

1. Create `app/api/your-route/route.ts`
2. Export async function for HTTP method (`GET`, `POST`, etc.)

```typescript
// app/api/example/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ message: "Hello" });
}
```

### Adding a New Component

1. Create component in appropriate directory
2. Export as named or default
3. Add TypeScript types
4. Import where needed

```typescript
// components/chat/NewComponent.tsx
"use client";

interface NewComponentProps {
  // props
}

export function NewComponent({ }: NewComponentProps) {
  return <div>New Component</div>;
}
```

### Adding a New AI Tool

1. Define Zod schema in `app/api/chat/schema.ts`
2. Create tool in `app/api/chat/tools.ts`
3. Add to exports in `allTools`
4. Create display component if needed

```typescript
// schema.ts
export const myToolSchema = z.object({
  param1: z.string(),
  param2: z.number(),
});

// tools.ts
export const myTool = tool({
  description: "Tool description",
  inputSchema: myToolSchema,
  execute: async ({ param1, param2 }) => {
    // Tool logic
    return { result: "data" };
  },
});
```

### Adding a New UI Component (shadcn/ui)

```bash
# Add a new shadcn/ui component
npx shadcn@latest add <component-name>

# Example: add a dialog
npx shadcn@latest add dialog
```

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update minor/patch versions
npm update

# Update specific package
npm install package@latest

# Check for security vulnerabilities
npm audit
```

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### TypeScript Errors

```bash
# Regenerate types
npm run typecheck

# Check specific file
npx tsc --noEmit path/to/file.ts
```

### Styling Issues

```bash
# Rebuild Tailwind
npm run build

# Check if classes are being detected
# tailwind.config.ts content paths must match your file structure
```

### Database Connection Issues

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/ \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

## Performance Tips

### Development

- Use `// @ts-expect-error` sparingly during development
- Comment out unused imports to speed up hot reload
- Use React DevTools Profiler for performance debugging

### Production

- Run `npm run build` before deploying
- Verify all environment variables are set
- Test authentication flow end-to-end
- Check streaming works correctly

### Best Practices

1. **Lazy load heavy components**
   ```tsx
   const HeavyComponent = dynamic(() => import("./Heavy"), { ssr: false });
   ```

2. **Use server components for data fetching**
   ```tsx
   // Prefer
   export default async function Page() {
     const data = await fetchData();
     return <ClientComponent data={data} />;
   }
   ```

3. **Optimize images**
   ```tsx
   import Image from "next/image";
   <Image src="/image.png" width={400} height={300} alt="" />;
   ```

4. **Minimize client-side JavaScript**
   - Use server components when possible
   - Move non-interactive UI to server components
