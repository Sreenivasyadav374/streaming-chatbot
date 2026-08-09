# Environment Configuration

Complete guide to configuring environment variables for the AI Chat Assistant.

## Table of Contents

- [Overview](#overview)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Platform-Specific Configuration](#platform-specific-configuration)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses environment variables for configuration. These are loaded from:

1. System environment (highest priority)
2. `.env.local` (local development)
3. `.env.development` or `.env.production` (environment defaults)
4. `.env` (defaults)

### Loading Priority

```bash
# Next.js loads env files in this order:
# 1. .env.local        (overrides all, for secrets)
# 2. .env.development  # or .env.production
# 3. .env              # defaults
```

### File Structure

```
project/
├── .env              # Default values (safe to commit)
├── .env.example      # Template with all variables
├── .env.local        # Your local secrets (never commit)
├── .env.development  # Development environment
└── .env.production   # Production environment
```

## Required Variables

### Supabase Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJ...` |

#### How to Get These Values

1. Log in to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Security Note

The `anon` key is safe to expose in the browser because:
- Row Level Security (RLS) protects your data
- The key has limited permissions by default
- All database operations are validated by RLS policies

### AI Provider Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key for AI responses | `AIza...` |

#### How to Get This Value

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy the key for `GOOGLE_GENERATIVE_AI_API_KEY`

#### Usage

The API key is used for:
- Chat completions via Gemini 2.5 Flash
- Automatic title generation
- Tool calling (weather, tasks, recipes)

## Optional Variables

### Application Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Application URL for metadata |

### Alternative AI Providers

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (alternative provider) |
| `OPENROUTER_API_KEY` | OpenRouter API key (alternative provider) |

### Admin/Service Keys

| Variable | Description | Security |
|----------|-------------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | **SERVER-SIDE ONLY** |

> **WARNING**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It bypasses all RLS policies.

### Analytics & Monitoring

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN |

### Deployment Platforms

| Variable | Description |
|----------|-------------|
| `VERCEL` | Set automatically by Vercel |
| `VERCEL_URL` | Set automatically by Vercel |
| `NETLIFY` | Set automatically by Netlify |

## Platform-Specific Configuration

### Local Development

Create `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Deployment

Set environment variables in Vercel Dashboard:

1. Go to your project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:

```bash
# In Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
```

### Netlify Deployment

Set environment variables in Netlify Dashboard:

1. Go to your site in Netlify
2. Navigate to **Site settings** → **Environment variables**
3. Add each variable

Or use `netlify.toml`:

```toml
[context.production.environment]
NEXT_PUBLIC_SUPABASE_URL = "https://prod-project.supabase.co"
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

ENV NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
# ... other env vars
```

Or use `.env` file at runtime:

```bash
docker run --env-file .env.local -p 3000:3000 my-image
```

### Self-Hosted

Create a `.env.local` file on your server:

```bash
# On your server
cd /var/www/ai-chat-assistant
nano .env.local
# Paste your configuration
# Save and exit

# Restart the application
pm2 restart ai-chat
```

## Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore should include:
.env.local
.env*.local
```

### 2. Use Different Projects for Environments

| Environment | Supabase Project | Purpose |
|-------------|-------------------|---------|
| Development | `dev-chat-assistant` | Testing, debugging |
| Staging | `staging-chat-assistant` | Pre-production testing |
| Production | `prod-chat-assistant` | Live application |

### 3. Rotate Keys Regularly

```bash
# Rotate Supabase anon key
# In Supabase Dashboard: Settings → API → Reset anon key

# Rotate Gemini API key
# In Google AI Studio: Delete old key, create new one
```

### 4. Audit Key Usage

```bash
# Check for accidentally committed secrets
git log --all --full-history -- "*.env*"

# Search for exposed keys in history
git log -p | grep -i "api_key"
```

### 5. Use Environment-Specific Values

```env
# .env.development
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co

# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
```

### 6. Restrict CORS (Production)

In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your production domain to allowed origins:
   ```
   https://your-domain.com
   ```

## Troubleshooting

### Missing Environment Variables

**Symptoms:**
- App crashes on startup
- "Unauthorized" errors
- API calls fail silently

**Solution:**
```bash
# Check if variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# In the app, temporarily add:
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
```

### Variables Not Updating

**Symptoms:**
- Changed variable but app uses old value
- Changes not reflected after deployment

**Solution:**
```bash
# Local: Clear Next.js cache
rm -rf .next
npm run dev

# Vercel: Trigger redeploy
vercel --prod

# Netlify: Clear cache and deploy
netlify deploy --prod
```

### Browser vs Server Variables

**Issue:** `NEXT_PUBLIC_*` variables are available in browser, others are server-only.

```typescript
// ✅ Correct - Server only
import { createClient } from "@/lib/supabase/server";
const supabase = createClient();

// ✅ Correct - Browser accessible
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ❌ Wrong - Fails silently
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY; // undefined in browser
```

### Supabase CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Requests blocked by browser

**Solution:**
1. Verify Supabase URL is correct
2. Check Supabase project is not paused
3. Add your domain to Supabase allowed origins

### API Key Invalid

**Symptoms:**
- AI responses fail
- "Invalid API key" errors

**Solution:**
1. Verify key is correct (no extra spaces or newlines)
2. Check key has not expired or been revoked
3. Verify key has correct permissions

## Environment Reference

### Complete `.env.example`

```env
# =============================================================================
# AI Chat Assistant - Environment Configuration
# =============================================================================

# -----------------------------------------------------------------------------
# SUPABASE CONFIGURATION (Required)
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service role key (SERVER SIDE ONLY)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# -----------------------------------------------------------------------------
# AI PROVIDER CONFIGURATION (Required)
# -----------------------------------------------------------------------------
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here

# Optional: Alternative providers
# OPENAI_API_KEY=sk-your-openai-key-here
# OPENROUTER_API_KEY=sk-or-your-key-here

# -----------------------------------------------------------------------------
# APPLICATION CONFIGURATION (Optional)
# -----------------------------------------------------------------------------
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# -----------------------------------------------------------------------------
# ANALYTICS & MONITORING (Optional)
# -----------------------------------------------------------------------------
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
# NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# -----------------------------------------------------------------------------
# RATE LIMITING (Optional)
# -----------------------------------------------------------------------------
# UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
# UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Variable Validation Script

```javascript
// scripts/check-env.js
const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
}

console.log("All required environment variables are set.");
```
