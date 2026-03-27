# Phase 1 — Authentication & User Management

> **Priority:** 🔴 Critical — All subsequent phases depend on authenticated users.
> **Estimated Time:** 2–3 weeks
> **Prerequisites:** Phase 0 complete (NestJS running, PostgreSQL + Redis healthy, Prisma schema applied)

---

## Objectives

- Implement the full auth module in NestJS (signup, login, logout, refresh, OAuth sync).
- Implement JWT-based authentication with Redis blocklist for revocation.
- Implement RBAC with `JwtAuthGuard` and `RolesGuard`.
- Set up Auth.js (NextAuth.js) in the Next.js frontend with Google + GitHub + Credentials providers.
- Build login/signup/profile pages in Next.js.
- Implement `proxy.js` for route protection (Next.js 16).

---

## Step-by-Step Guide

### Step 1.1 — NestJS Auth Module: DTOs & Zod Schemas

Create `apps/api/src/modules/auth/dto/`:

| File | Schema Fields |
|------|---------------|
| `signup.dto.ts` | `email` (string, email), `name` (string, 2–255), `password` (string, 8–128), `role` (enum: 'examiner' \| 'candidate', default 'candidate') |
| `login.dto.ts` | `email` (string, email), `password` (string) |
| `token-response.dto.ts` | `accessToken`, `expiresIn`, `tokenType: 'Bearer'` |

Each DTO should export a Zod schema and a TypeScript type inferred from it.

```typescript
// Example: signup.dto.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(255),
  password: z.string().min(8).max(128),
  role: z.enum(['examiner', 'candidate']).default('candidate'),
});

export type SignupDto = z.infer<typeof signupSchema>;
```

- [ ] **Checkpoint:** All DTO files created with Zod schemas and inferred types.

---

### Step 1.2 — Auth Service

Create `apps/api/src/modules/auth/auth.service.ts`:

| Method | Responsibility |
|--------|---------------|
| `signup(dto)` | Hash password (bcrypt, 12 rounds), create user in PostgreSQL, return user (sans password) |
| `login(dto)` | Find user by email, verify password with bcrypt, generate access + refresh JWTs, return tokens |
| `logout(jti, expiresAt)` | Add JWT `jti` to Redis blocklist with TTL = remaining lifetime |
| `refreshToken(refreshJwt)` | Verify refresh token, check blocklist, issue new access token |
| `syncOAuthUser(profile)` | Upsert user from OAuth provider data (used by Auth.js callback) |
| `isTokenRevoked(jti)` | Check Redis for `blocklist:{jti}` key |

**JWT Payload:**

```typescript
{
  sub: user.id,         // UUID
  email: user.email,
  name: user.name,
  role: user.role,
  jti: uuidv4(),        // Unique token identifier
}
```

**Token Configuration:**
- Access token: 15 minutes (`JWT_ACCESS_TTL`)
- Refresh token: 7 days (`JWT_REFRESH_TTL`)
- Both stored as `httpOnly`, `secure`, `sameSite: 'lax'` cookies

**Install bcrypt:**

```bash
cd apps/api
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Checkpoint:** Unit tests pass for `signup`, `login`, `logout`, `refreshToken`, `isTokenRevoked`.

---

### Step 1.3 — JWT Strategy (Passport.js)

Create `apps/api/src/modules/auth/strategies/jwt.strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract JWT from httpOnly cookie
        (req: Request) => req?.cookies?.access_token ?? null,
        // Fallback: Bearer token in Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      jti: payload.jti,
    };
  }
}
```

- [ ] **Checkpoint:** JWT strategy registered and injectable.

---

### Step 1.4 — JwtAuthGuard with Redis Blocklist Check

Upgrade the stub `src/common/guards/jwt-auth.guard.ts`:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Run Passport JWT validation
    const isValid = await super.canActivate(context);
    if (!isValid) return false;

    // 2. Check Redis blocklist
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isRevoked = await this.authService.isTokenRevoked(user.jti);
    if (isRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return true;
  }
}
```

- [ ] **Checkpoint:** Revoked tokens are correctly rejected.

---

### Step 1.5 — RolesGuard

Upgrade the stub `src/common/guards/roles.guard.ts`:

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

- [ ] **Checkpoint:** Routes decorated with `@Roles('examiner')` reject candidates. Routes without `@Roles()` are open to all authenticated users.

---

### Step 1.6 — Auth Controller

Create `apps/api/src/modules/auth/auth.controller.ts`:

| Endpoint | Method | Auth | Description | Cookie Action |
|----------|--------|------|-------------|---------------|
| `/api/v1/auth/signup` | POST | Public | Create account | Set access + refresh cookies |
| `/api/v1/auth/login` | POST | Public | Authenticate | Set access + refresh cookies |
| `/api/v1/auth/logout` | POST | JWT | Revoke token | Clear cookies, blocklist `jti` |
| `/api/v1/auth/refresh` | POST | Refresh cookie | Rotate access token | Set new access cookie |
| `/api/v1/auth/sync-oauth-user` | POST | Internal | Auth.js → NestJS user upsert | N/A |
| `/api/v1/auth/me` | GET | JWT | Get current user profile | N/A |

**Cookie settings (all tokens):**

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: ttlInSeconds * 1000,
}
```

- [ ] **Checkpoint:** All auth endpoints are functional. Test with Postman or `curl`:
  1. `POST /signup` → creates user, sets cookies
  2. `POST /login` → authenticates, sets cookies
  3. `GET /auth/me` with cookie → returns user profile
  4. `POST /logout` → clears cookies, subsequent requests fail
  5. `POST /refresh` → issues new access token

---

### Step 1.7 — Users Module

Create `apps/api/src/modules/users/`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/users/me` | GET | JWT | Get own profile (alias for `/auth/me`) |
| `/api/v1/users/me` | PATCH | JWT | Update own profile (name, avatar) |
| `/api/v1/users/:id` | GET | JWT + Admin | View any user profile |

Key: The response DTO must **never** include `passwordHash`.

- [ ] **Checkpoint:** `PATCH /users/me` updates name/avatar. Response never contains `passwordHash`.

---

### Step 1.8 — Auth Service Unit Tests

Create `apps/api/src/modules/auth/auth.service.spec.ts`:

| Test | Assertion |
|------|-----------|
| `signup` with valid data | User created, password hashed, no passwordHash in response |
| `signup` with duplicate email | Throws ConflictException |
| `login` with valid credentials | Returns valid JWT tokens |
| `login` with wrong password | Throws UnauthorizedException |
| `logout` | `jti` appears in Redis blocklist with correct TTL |
| `isTokenRevoked` for revoked token | Returns true |
| `isTokenRevoked` for valid token | Returns false |
| `refreshToken` with valid token | Returns new access token |
| `refreshToken` with revoked token | Throws UnauthorizedException |

```bash
cd apps/api
npm run test -- --testPathPattern auth
```

- [ ] **Checkpoint:** All auth unit tests pass.

---

### Step 1.9 — Auth E2E Tests

Create `apps/api/test/auth.e2e-spec.ts`:

Tests the full HTTP request/response cycle including cookies.

| Test | Flow |
|------|------|
| Signup → Login → Access Protected Route → Logout → Verify Rejection | Full lifecycle |
| Signup with invalid data → 400 | Validation |
| Login with wrong password → 401 | Auth failure |
| Access protected route without cookie → 401 | Guard enforcement |
| Refresh token rotation | Token lifecycle |

```bash
npm run test:e2e
```

- [ ] **Checkpoint:** All E2E tests pass.

---

### Step 1.10 — Next.js Auth.js Integration

**Install dependencies in `web/`:**

```bash
cd web
npm install next-auth@beta
```

**Create Auth.js configuration:**

1. `web/src/lib/auth/auth.config.js` — Providers: GoogleProvider, GitHubProvider, CredentialsProvider
2. `web/src/lib/auth/session.js` — `getServerSession` helper
3. `web/src/app/api/auth/[...nextauth]/route.js` — Auth.js API route handler

**Auth.js Callbacks:**
- `jwt` callback: Include `role`, `sub` (userId), `jti` in the JWT
- `session` callback: Expose `role` and `userId` in the session object
- `signIn` callback: Call `POST /api/v1/auth/sync-oauth-user` on the NestJS API to upsert the user

**Environment variables (add to `web/.env.local`):**

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-minimum-32-characters-long!!!
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
API_URL=http://localhost:4000
```

- [ ] **Checkpoint:** `/api/auth/signin` shows the Auth.js sign-in page with Google, GitHub, and Credentials options.

---

### Step 1.11 — Auth Provider Component

Create `web/src/components/shared/AuthProvider.jsx`:

```jsx
'use client';
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Wrap `<AuthProvider>` around children in `web/src/app/layout.js`.

- [ ] **Checkpoint:** `useSession()` hook works in client components.

---

### Step 1.12 — Login & Signup Pages

Create Next.js pages:

1. `web/src/app/(auth)/login/page.js` — Email/password login form + OAuth buttons (Google, GitHub)
2. `web/src/app/(auth)/signup/page.js` — Registration form with name, email, password, role selection
3. `web/src/app/(auth)/layout.js` — Minimal layout (centered card, no sidebar)

**Design requirements:**
- Dark theme matching existing app aesthetic
- Form validation (client-side + server response errors)
- Loading states during authentication
- Redirect to dashboard/practice after successful auth
- "Already have an account?" / "Don't have an account?" links

- [ ] **Checkpoint:** Users can sign up, log in, and are redirected to the appropriate page based on role.

---

### Step 1.13 — Route Protection with `proxy.js`

Create `web/proxy.js` (Next.js 16 replacement for `middleware.js`):

```javascript
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isExaminerRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/questions') || pathname.startsWith('/exams');
  const isCandidateRoute = pathname.startsWith('/practice') || pathname.startsWith('/exam') || pathname.startsWith('/join');

  if (!token && (isExaminerRoute || isCandidateRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token?.role !== 'examiner' && isExaminerRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] **Checkpoint:** Unauthenticated users are redirected to `/login` when accessing protected routes. Candidates cannot access examiner routes.

---

### Step 1.14 — User Profile Page

Create `web/src/app/(examiner)/profile/page.js` and `web/src/app/(candidate)/profile/page.js`:

- Display current user info (name, email, avatar, role)
- Allow editing name and avatar
- Show account creation date
- Sign-out button

- [ ] **Checkpoint:** Profile page renders with user data and allows updates.

---

## Phase 1 — Testing Protocol

### Manual Tests

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Sign up with email/password (candidate) | User created, redirected to practice page |
| 2 | Sign up with email/password (examiner) | User created, redirected to dashboard |
| 3 | Log in with valid credentials | Session created, cookies set |
| 4 | Log in with wrong password | Error message displayed |
| 5 | Access `/dashboard` as candidate | Redirected to home |
| 6 | Access `/practice` as unauthenticated | Redirected to `/login` |
| 7 | Log out | Session destroyed, cookies cleared |
| 8 | Refresh page after login | Session persists (cookie-based) |
| 9 | Google OAuth flow | User created/logged in via OAuth |
| 10 | GitHub OAuth flow | User created/logged in via OAuth |

### Automated Tests

```bash
# Unit tests
cd apps/api && npm run test -- --testPathPattern auth

# E2E tests
cd apps/api && npm run test:e2e
```

---

## Phase 1 — Completion Checklist

| # | Item | Status |
|---|------|--------|
| 1.1 | Auth DTOs with Zod schemas | ⬜ |
| 1.2 | Auth service (signup, login, logout, refresh, OAuth sync) | ⬜ |
| 1.3 | JWT strategy (Passport.js) | ⬜ |
| 1.4 | JwtAuthGuard with Redis blocklist | ⬜ |
| 1.5 | RolesGuard | ⬜ |
| 1.6 | Auth controller (all endpoints) | ⬜ |
| 1.7 | Users module (profile CRUD) | ⬜ |
| 1.8 | Auth service unit tests | ⬜ |
| 1.9 | Auth E2E tests | ⬜ |
| 1.10 | Auth.js integration in Next.js | ⬜ |
| 1.11 | AuthProvider component | ⬜ |
| 1.12 | Login & Signup pages | ⬜ |
| 1.13 | Route protection (`proxy.js`) | ⬜ |
| 1.14 | User profile page | ⬜ |

**✅ Phase 1 is complete when:** Users can sign up, log in (email + OAuth), access role-appropriate routes, and log out. All auth endpoints have unit + E2E tests passing.

---

**Previous ← [Phase 0: Foundation](PHASE-0-FOUNDATION.md)**
**Next → [Phase 2: Question Bank & Practice Mode](PHASE-2-QUESTIONS.md)**
