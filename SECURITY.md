# Security Policy

This document outlines the security policy for the AI Chat Assistant project.

## Table of Contents

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Security Features](#security-features)
- [Best Practices](#best-practices)
- [Security Updates](#security-updates)

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

### How to Report

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email: security@example.com (replace with actual email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

| Stage | Timeline |
|-------|----------|
| Initial response | Within 48 hours |
| Vulnerability assessment | Within 7 days |
| Fix development | Within 14 days (critical) |
| Security advisory | On patch release |

### What to Expect

1. **Acknowledgment:** We'll confirm receipt within 48 hours
2. **Assessment:** We'll evaluate the severity and impact
3. **Updates:** We'll keep you informed of progress
4. **Credit:** With your permission, we'll credit you in the advisory
5. **Disclosure:** Coordinated disclosure after fix is released

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | Remote code execution, data breach | 24-48 hours |
| High | Authentication bypass, significant data exposure | 7 days |
| Medium | Limited data exposure, CSRF | 14 days |
| Low | Minor info disclosure, UI issues | 30 days |

## Security Features

### Authentication

- **Supabase Auth:** Industry-standard authentication
- **Session Management:** Secure cookie-based sessions
- **Token Refresh:** Automatic token rotation
- **Magic Link:** Passwordless authentication option

### Authorization

- **Row Level Security (RLS):** Database-level access control
- **Middleware Protection:** Route-level authentication
- **User Ownership:** All data belongs to authenticated users

### Data Protection

| Feature | Implementation |
|---------|----------------|
| API Key Storage | Server-side only (never exposed to browser) |
| Session Cookies | httpOnly, secure, sameSite |
| CSRF Protection | Built-in via Supabase |
| Input Validation | Zod schemas on all inputs |

### Transport Security

- **HTTPS:** Required in production
- **CORS:** Configured per environment
- **CSP Headers:** Recommended for production

## Best Practices

### For Developers

1. **Never expose server-only secrets:**
   ```typescript
   // ❌ Wrong - exposes to browser
   const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

   // ✅ Correct - server only
   // In API route (server component)
   const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
   ```

2. **Always validate user input:**
   ```typescript
   // ✅ Use Zod for validation
   const schema = z.object({
     chatId: z.string().uuid(),
     title: z.string().min(1).max(100),
   });

   const parsed = schema.safeParse(input);
   if (!parsed.success) {
     return new Response("Invalid input", { status: 400 });
   }
   ```

3. **Check authentication in every API route:**
   ```typescript
   export async function POST(request: Request) {
     const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();

     if (!user) {
       return new Response("Unauthorized", { status: 401 });
     }
     // ... continue
   }
   ```

4. **Use RLS policies on all tables:**
   ```sql
   -- Always enable RLS
   ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

   -- Create specific policies
   CREATE POLICY "Users can only access own data"
     ON your_table FOR ALL TO authenticated
     USING (auth.uid() = user_id);
   ```

### For Deployment

1. **Environment Variables:**
   - Never commit secrets to git
   - Use platform's secret management (Vercel, Netlify)
   - Rotate keys regularly

2. **HTTPS:**
   - Always use HTTPS in production
   - Set `Secure` flag on cookies

3. **Content Security Policy:**
   ```html
   <meta http-equiv="Content-Security-Policy" content="
     default-src 'self';
     script-src 'self' 'unsafe-inline' 'unsafe-eval';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data: https:;
     connect-src 'self' https://*.supabase.co;
   ">
   ```

4. **Rate Limiting:**
   - Implement for API endpoints
   - Prevent abuse and brute force

## Known Security Considerations

### API Keys

- **Gemini API Key:** Stored server-side, never exposed to browser
- **Supabase Anon Key:** Safe for browser (protected by RLS)
- **Supabase Service Role Key:** Server-side only, bypasses RLS

### User Data

- Messages are stored in database with RLS protection
- Each user can only access their own chats
- Deletion is permanent (no recovery)

### Third-Party Services

| Service | Data Shared | Purpose |
|---------|-------------|---------|
| Supabase | Messages, User ID | Storage, Auth |
| Google Gemini | Message content | AI responses |
| Netlify/Vercel | Static assets | Hosting |

## Security Updates

### Checking for Vulnerabilities

```bash
# Check npm dependencies
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated
```

### Update Process

1. Security vulnerabilities are tracked via GitHub Dependabot
2. Critical vulnerabilities are patched immediately
3. Security releases are tagged and documented
4. Users are notified via GitHub Security Advisories

### Staying Informed

- Watch the repository for security alerts
- Subscribe to release notifications
- Follow security advisories

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set server-side
- [ ] No secrets in client-side code
- [ ] RLS policies are enabled on all tables
- [ ] Authentication is required for all protected routes
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are audited (`npm audit`)
- [ ] CSP headers are configured

## Contact

For security-related questions or concerns:
- Email: security@example.com (replace with actual email)
- GitHub: Open a private security advisory

---

Last updated: 2026-06-16
