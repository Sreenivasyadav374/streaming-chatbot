# API Documentation

Complete reference for all API endpoints in the AI Chat Assistant.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Overview

The API follows RESTful conventions with JSON request/response bodies. All endpoints return JSON unless streaming is involved.

### Content Types

| Endpoint | Request | Response |
|----------|---------|----------|
| `/api/chat` | `application/json` | `text/event-stream` |
| All others | `application/json` | `application/json` |

## Authentication

All API endpoints require Supabase authentication. Include session cookies with each request.

### How Authentication Works

1. User logs in via Supabase Auth (password or magic link)
2. Supabase sets session cookies (`sb-access-token`, `sb-refresh-token`)
3. Middleware validates session on each request
4. API routes verify user before processing

### Session Verification

```typescript
// In any API route
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // User is authenticated, proceed
}
```

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000` |
| Production | `https://your-domain.com` |

## Endpoints

---

### Chat

#### `POST /api/chat`

Send a message to the AI and receive a streaming response.

**Request Body:**

```json
{
  "chatId": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chatId` | string (uuid) | Yes | Chat session identifier |
| `messages` | array | Yes | Array of message objects |
| `messages[].role` | string | Yes | One of: `user`, `assistant`, `system` |
| `messages[].content` | string | No* | Text content of message |
| `messages[].parts` | array | No* | Multipart message content |
| `messages[].files` | array | No | File attachments |

*Either `content` or `parts` must be provided.

**Response:**

Server-Sent Events stream with the following event types:

```typescript
// Text delta
{
  "type": "text-delta",
  "textDelta": "word"
}

// Tool call
{
  "type": "tool-call",
  "toolCallId": "uuid",
  "toolName": "showWeather",
  "args": { "location": "Tokyo" }
}

// Finish
{
  "type": "finish"
}

// Error
{
  "type": "error",
  "error": "message"
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success (streaming) |
| 400 | Missing `chatId` parameter |
| 401 | Unauthorized (invalid/missing session) |
| 500 | Internal server error |

**Example:**

```javascript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chatId: "550e8400-e29b-41d4-a716-446655440000",
    messages: [{ role: "user", content: "What is React?" }],
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split("\n").filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const data = JSON.parse(line.slice(6));
      if (data.type === "text-delta") {
        process.stdout.write(data.textDelta);
      }
    }
  }
}
```

---

#### `POST /api/chat/update-title`

Update the title of a chat session.

**Request Body:**

```json
{
  "chatId": "uuid",
  "title": "New Chat Title"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chatId` | string (uuid) | Yes | Chat session identifier |
| `title` | string | Yes | New title (1-100 characters) |

**Response:**

```json
{
  "success": true
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Title updated successfully |
| 400 | Missing parameters |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example:**

```javascript
const response = await fetch("/api/chat/update-title", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chatId: "550e8400-e29b-41d4-a716-446655440000",
    title: "React Performance Discussion",
  }),
});

const result = await response.json();
// { success: true }
```

---

### Authentication

#### `GET /api/auth/callback`

OAuth callback handler for magic link authentication.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | Yes | OAuth authorization code |
| `next` | string | No | Redirect path after auth (default: `/`) |

**Response:**

HTTP 302 Redirect to either:
- `${origin}${next}` on success
- `${origin}/login?error=auth_failed` on failure

**Example Flow:**

1. User requests magic link: `POST /auth` (handled by Supabase client)
2. User clicks link in email, which navigates to:
   ```
   /api/auth/callback?code=abc123&next=/chat/xyz
   ```
3. Server exchanges code for session
4. User is redirected to `/chat/xyz`

---

## AI Tools

The `/api/chat` endpoint supports AI tool calling. The AI can invoke these tools:

### `showWeather`

Get current weather for a city.

**Schema:**

```typescript
{
  location: z.string().describe("The city name to get weather for");
}
```

**Returns:**

```typescript
{
  city: string;
  temperature: string;
}
```

---

### `showTasks`

Create a task list with checklist items.

**Schema:**

```typescript
{
  title: z.string().describe("The name of the task list");
  tasks: z.array(
    z.object({
      id: z.string().describe("Unique task id");
      text: z.string().describe("Task description");
      completed: z.boolean().default(false);
    })
  ).describe("List of tasks");
}
```

**Returns:**

```typescript
{
  title: string;
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}
```

---

### `showRecipe`

Generate a recipe with ingredients and instructions.

**Schema:**

```typescript
{
  title: z.string();
  description: z.string();
  prepTime: z.string();
  cookTime: z.string();
  servings: z.number();
  ingredients: z.array(
    z.object({
      name: z.string();
      amount: z.string();
    })
  );
  instructions: z.array(z.string());
}
```

**Returns:**

The structured recipe data is returned for UI rendering.

---

## Error Handling

All errors follow a consistent format:

### JSON Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Authenticated but not permitted |
| `BAD_REQUEST` | 400 | Invalid request body or parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server-side error |

### Error Handling Example

```javascript
try {
  const response = await fetch("/api/chat/update-title", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, title }),
  });

  if (!response.ok) {
    const error = await response.text();
    switch (response.status) {
      case 401:
        // Redirect to login
        window.location.href = "/login";
        break;
      case 400:
        alert(`Invalid request: ${error}`);
        break;
      default:
        alert("An error occurred. Please try again.");
    }
    return;
  }

  const result = await response.json();
  // Handle success
} catch (error) {
  console.error("Network error:", error);
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider adding rate limiting:

### Recommended Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/chat` | 20 requests | 1 minute |
| `/api/chat/update-title` | 60 requests | 1 minute |

### Implementation Example (Upstash)

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});

// In API route
const identifier = user.id;
const { success, remaining } = await ratelimit.limit(identifier);

if (!success) {
  return new Response("Too many requests", {
    status: 429,
    headers: { "X-RateLimit-Remaining": remaining.toString() }
  });
}
```

---

## WebSocket Alternative

While currently using SSE, here's how a WebSocket implementation would look:

```typescript
// Future: WebSocket endpoint
// app/api/chat/ws/route.ts (conceptual)

import { WebSocket } from "ws";

export function upgrade(request: Request) {
  const ws = new WebSocket(request);

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "message") {
      // Process message
      const stream = await processMessage(data);

      for await (const chunk of stream) {
        ws.send(JSON.stringify(chunk));
      }
    }
  };

  return ws;
}
```

---

## OpenAPI Specification

Full OpenAPI 3.1 specification available at [`/swagger/openapi.yaml`](../swagger/openapi.yaml).

To serve the spec:

```bash
# InstallSwagger UI
npm install swagger-ui-react

# Create a documentation page
# app/api-docs/page.tsx
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  return <SwaggerUI url="/swagger/openapi.yaml" />;
}
```

---

## Client SDK Example

For third-party integration:

```typescript
// sdk/chat-client.ts
class ChatClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async sendMessage(chatId: string, content: string, onToken: (token: string) => void) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        messages: [{ role: "user", content }],
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));
          if (data.type === "text-delta") {
            onToken(data.textDelta);
          }
        }
      }
    }
  }
}

// Usage
const client = new ChatClient("https://your-app.com");
await client.sendMessage(chatId, "Hello", (token) => {
  process.stdout.write(token);
});
```
