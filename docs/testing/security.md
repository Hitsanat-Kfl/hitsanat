# Testing: Security & Scoped RBAC Validation

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Runner:** Vitest + Playwright (`pnpm test:security`)  

---

## 1. Security Test Matrix

```mermaid
graph TD
    SecuritySuite[Security Test Runner]
    
    SecuritySuite --> NonAuth[Test 1: Unauthenticated Requests -> 401 Unauthorized]
    SecuritySuite --> RegMember[Test 2: Regular Member Login -> 403 Forbidden ADR-0007]
    SecuritySuite --> ScopeIso[Test 3: Cross-Department Access -> 403 Insufficient Scope]
    SecuritySuite --> SQLInj[Test 4: SQL Injection Payloads -> Safely Handled via Drizzle]
    SecuritySuite --> XSSInj[Test 5: XSS in Names -> Escaped & Sanitized]
    SecuritySuite --> CSRFCheck[Test 6: Mutation without Valid Cookie -> Denied]
```

---

## 2. Mandatory Negative Test Cases

1. **Non-Leadership Lockout (ADR-0007):**
   - Attempt login with student member holding `role = 'Member'`.
   - Assert: Returns `403 Forbidden` with code `AUTH_NOT_AUTHORIZED_LEADERSHIP`.
2. **Cross-Department Scope Denial (ADR-0005):**
   - Authenticate as `SUB_LEAD_MEZMUR`.
   - Issue `POST /api/v1/timihrt/curriculum`.
   - Assert: Returns `403 Forbidden` with code `FORBIDDEN_INSUFFICIENT_SCOPE`.
3. **Child Data Exfiltration Defense:**
   - Query `/api/v1/public/stats` without credentials.
   - Assert: Response contains only aggregate numbers; zero child phone numbers or residential addresses exposed.
