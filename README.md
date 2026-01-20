# Real-Time AI Chatbot with Streaming Responses

A modern, production-ready AI chatbot application built with Next.js 14, featuring real-time streaming responses, a beautiful UI, and seamless user experience.

## Description

This project is an end-to-end real-time AI chatbot that streams responses token-by-token using Server-Sent Events (SSE). It provides an intuitive chat interface with visual feedback, typing indicators, and connection status monitoring. The application leverages OpenAI's GPT models to deliver intelligent, context-aware responses.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: OpenRouter API (openrouter/auto)
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Features

### Core Features Implemented

- [x] **Chat Interface**
  - [x] Chat message list displaying user and AI messages
  - [x] Auto-scroll to the latest message
  - [x] Visually distinguish user vs AI messages
  - [x] Display message timestamps
  - [x] Text input with Send button
  - [x] Enter key sends message (Shift+Enter for new line)
  - [x] Disable input while AI is responding
  - [x] Mobile-responsive layout using Tailwind CSS

- [x] **Real-Time Streaming**
  - [x] Server-Sent Events (SSE) for streaming AI responses
  - [x] Display AI response token-by-token in real time
  - [x] Show typing indicator until the first chunk arrives
  - [x] Properly handle stream completion
  - [x] Visual cursor animation during streaming

- [x] **Backend API**
  - [x] Next.js API route at `/app/api/chat/route.ts`
  - [x] OpenRouter with openrouter/auto model integration with streaming
  - [x] API keys secured server-side (not exposed to frontend)
  - [x] Clean streaming logic using ReadableStream
  - [x] Graceful error handling

- [x] **State Management**
  - [x] Maintain full message history in React state
  - [x] Correct message ordering
  - [x] Loading / streaming state
  - [x] Connection status indicator (connected / streaming / error)

- [x] **Code Quality**
  - [x] Clean, modular components
  - [x] Meaningful variable and function names
  - [x] Strong TypeScript typing
  - [x] No unused code or placeholders

## Setup Steps

### Prerequisites

- Node.js 18+ installed
- Any OPENROUTER API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download the project**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OPENROUTER API key:

   ```
   OPENROUTER_API_KEY=sk-your-actual-openrouter-api-key-here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable         | Description                                  | Required |
| ---------------- | -------------------------------------------- | -------- |
| `OPENROUTER_API_KEY` | Your OpenRouter API key for accessing models | Yes      |

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## Project Structure

```
app/
 ├─ page.tsx                 # Main page component
 ├─ layout.tsx               # Root layout
 ├─ api/chat/route.ts        # Streaming chat API endpoint
components/
 ├─ ChatWindow.tsx           # Main chat orchestrator
 ├─ MessageBubble.tsx        # Individual message display
 ├─ ChatInput.tsx            # Message input field
 ├─ TypingIndicator.tsx      # Animated typing indicator
 ├─ ConnectionStatus.tsx     # Connection status badge
types/
 └─ chat.ts                  # TypeScript type definitions
lib/
 └─ openrouter.ts                # OpenRouter client configuration
```

## How It Works

1. **User Input**: User types a message and presses Enter or clicks Send
2. **Message Added**: User message is immediately added to the chat history
3. **API Request**: Frontend sends POST request to `/api/chat` with message history
4. **Streaming Response**: Backend streams OpenAI response using Server-Sent Events
5. **Real-Time Display**: Frontend displays each token as it arrives
6. **Completion**: When stream completes, message is finalized and added to history

## Usage

1. Type your message in the input field at the bottom
2. Press Enter or click the Send button
3. Watch as the AI responds in real-time with streaming text
4. Continue the conversation - the AI maintains context from previous messages

## Time Estimate

- **Planning & Design**: 30 minutes
- **Core Implementation**: 2 hours
- **UI/UX Refinement**: 45 minutes
- **Testing & Debugging**: 45 minutes
- **Documentation**: 30 minutes

**Total Time**: Approximately 4.5 hours

## Demo Video

[Placeholder for demo video link - Add your demo video URL here]

## License

MIT

## Notes

- The application uses openrouter/auto by default for cost-effectiveness
- You can modify the model in `lib/openrouter.ts` to use openrouter/auto or other models
- Rate limits and costs depend on your OpenRouter plan
- All API calls are made server-side to protect your API key
