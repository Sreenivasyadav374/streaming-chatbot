# Contributing to AI Chat Assistant

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- A Supabase account
- A Google AI Studio account (for Gemini API access)

### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ai-chat-assistant.git
cd ai-chat-assistant

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/ai-chat-assistant.git
```

### Install Dependencies

```bash
npm install
```

## Development Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the SQL migrations from `supabase/migrations/` in the SQL editor
3. Copy your project URL and anon key

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## How to Contribute

### Reporting Bugs

Before submitting a bug report:

1. Check existing [issues](../../issues) to avoid duplicates
2. Verify you can reproduce the bug with the latest version
3. Gather information:
   - Browser and version
   - Node.js version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

Submit a bug report using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).

### Suggesting Features

1. Check existing [issues](../../issues) for similar suggestions
2. Clearly describe the feature and its benefits
3. Provide examples or mockups if possible
4. Explain how it fits with the project's goals

Submit a feature request using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

### Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add missing documentation
- Improve examples
- Translate documentation

### Submitting Code

1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests
4. Update documentation
5. Submit a pull request

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Run tests and linting:**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

### PR Guidelines

1. **Title:** Use conventional commit format
   - `feat: add new feature`
   - `fix: resolve bug in chat streaming`
   - `docs: update API documentation`

2. **Description:**
   - What changes were made
   - Why they were made
   - How to test them
   - Any breaking changes

3. **Checklist:**
   - [ ] Tests pass
   - [ ] Linting passes
   - [ ] Build succeeds
   - [ ] Documentation updated
   - [ ] No new warnings

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR

### After Merge

1. Delete your feature branch
2. Sync your fork with upstream
3. Celebrate your contribution! 🎉

## Coding Standards

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatWindow.tsx` |
| Hooks | camelCase with `use` prefix | `useChatWindow.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `Chat.ts` |
| API Routes | lowercase | `route.ts` |

### TypeScript

- Use strict mode
- Define types for all functions
- Avoid `any` when possible
- Use type inference where appropriate

```typescript
// Good
interface Props {
  chatId: string;
  onSubmit: (value: string) => void;
}

function Component({ chatId, onSubmit }: Props) {
  // ...
}

// Avoid
function Component(props: any) {
  // ...
}
```

### React

- Prefer functional components
- Use hooks for state management
- Keep components focused and small
- Extract reusable logic to custom hooks

```tsx
// Good
function ChatInput({ onSubmit }: Props) {
  const [value, setValue] = useState("");
  const handleSubmit = () => onSubmit(value);

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}

// Avoid
class ChatInput extends Component {
  // ...
}
```

### Styling

- Use Tailwind CSS
- Follow the design system
- Keep responsive design in mind

```tsx
// Good - responsive and consistent
<button className="
  h-10 px-4
  rounded-xl
  bg-zinc-900 text-white
  hover:bg-zinc-800
  transition-colors
">
  Click me
</button>
```

### Imports

Group imports in this order:

1. React/Next.js
2. External libraries
3. Internal components
4. Internal utilities
5. Types

```typescript
// 1. React/Next
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External
import { useChat } from "@ai-sdk/react";

// 3. Internal components
import { Button } from "@/components/ui/button";

// 4. Utilities
import { cn } from "@/lib/utils";

// 5. Types
import type { Chat } from "@/types/chat";
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvement |

### Examples

```bash
feat(chat): add image upload support
fix(auth): resolve session timeout issue
docs(api): update endpoint documentation
style(ui): improve button hover states
refactor(store): simplify Zustand actions
test(hooks): add tests for useChatWindow
chore(deps): update dependencies
perf(messages): optimize scroll performance
```

## Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

### Writing Tests

```typescript
// Component test example
import { render, screen } from "@testing-library/react";
import { ChatInput } from "./ChatInput";

describe("ChatInput", () => {
  it("renders input field", () => {
    render(<ChatInput onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText("Ask something...")).toBeInTheDocument();
  });

  it("calls onSubmit with input value", () => {
    const onSubmit = jest.fn();
    render(<ChatInput onSubmit={onSubmit} />);

    // ... simulate user input and submit

    expect(onSubmit).toHaveBeenCalledWith("test message");
  });
});
```

### Test Coverage

- Aim for meaningful test coverage
- Focus on critical paths
- Test edge cases
- Avoid testing implementation details

## Documentation

### Code Comments

```typescript
// Good - explains why
// Use optimistic update to provide instant feedback
setChats(chats.filter(chat => chat.id !== chatId));

// Good - documents complex logic
// The first message triggers title generation
// because the chat needs an initial title
if (messages.length === 1) {
  await generateTitle();
}

// Avoid - explains what (obvious from code)
// Filter the chats
const filtered = chats.filter(isActive);
```

### JSDoc for Public APIs

```typescript
/**
 * Sends a chat message and returns the AI response stream.
 *
 * @param chatId - The unique identifier of the chat session
 * @param content - The message content to send
 * @returns A ReadableStream of response tokens
 *
 * @example
 * ```ts
 * const stream = await sendMessage("123", "Hello");
 * for await (const token of stream) {
 *   console.log(token);
 * }
 * ```
 */
async function sendMessage(chatId: string, content: string): Promise<ReadableStream> {
  // ...
}
```

### README Updates

Update the README when:
- Adding new features
- Changing configuration
- Updating dependencies
- Adding new scripts

## Questions?

- Open a [Discussion](../../discussions) for questions
- Join our community chat (link TBD)
- Check existing documentation in `docs/`

## Recognition

Contributors are recognized in:
- The commit history
- Release notes for significant contributions
- A contributors section (coming soon)

Thank you for contributing! 🙏
