# Backend Authentication Implementation

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Authentication Engine:** Better Auth (`packages/auth`)  

---

## 1. Better Auth Initialization (`packages/auth/src/index.ts`)

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@hitsanat/database';
import * as schema from '@hitsanat/database/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Internal leadership accounts provisioned by SuperAdmin/Secretary
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days rolling
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookie: {
      name: 'better-auth.session_token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  },
});
```

---

## 2. Express Integration

Better Auth handlers are mounted onto the Express application in `apps/api/src/server.ts`:
```typescript
app.all('/api/v1/auth/*', toNodeHandler(auth));
```
