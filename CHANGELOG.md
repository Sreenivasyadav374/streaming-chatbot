# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive documentation suite (`docs/`)
- OpenAPI/Swagger specification (`swagger/openapi.yaml`)
- Contribution guidelines (`CONTRIBUTING.md`)
- Security policy (`SECURITY.md`)
- Code of Conduct (`CODE_OF_CONDUCT.md`)
- GitHub issue templates for bugs and feature requests
- Pull request template
- Detailed environment configuration documentation

### Changed

- Improved mobile responsive layout with collapsible sidebar drawer
- Auto-close mobile sidebar when selecting a chat
- Fixed chat container viewport handling on mobile devices
- Updated README with complete project overview

### Fixed

- Mobile sidebar not closing after chat selection
- Chat input box positioning on small screens
- Horizontal overflow issues on mobile
- Favicon.ico build error in Next.js

## [1.0.0] - 2026-01-01

### Added

- Real-time AI chat with streaming responses
- Multi-thread conversation management
- User authentication (email/password and magic link)
- Chat persistence with Supabase PostgreSQL
- Automatic title generation for new chats
- AI tool calling for weather, tasks, and recipes
- Five built-in AI personas
- File attachment support
- Responsive design for mobile and desktop
- Dark mode ready CSS variables
- Row Level Security (RLS) for data protection
- Middleware-based route protection

### Technical Details

- Next.js 14 App Router architecture
- TypeScript for type safety
- Tailwind CSS for styling
- Zustand for client state management
- Vercel AI SDK for streaming
- Google Gemini 2.5 Flash integration
- Supabase authentication and database

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.0.0 | 2026-01-01 | Initial release |
| Unreleased | - | Documentation, mobile UX improvements |

---

[Unreleased]: https://github.com/your-org/ai-chat-assistant/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/ai-chat-assistant/releases/tag/v1.0.0
