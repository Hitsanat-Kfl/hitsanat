# ADR-0007: Regular Members Restricted to Public Portfolio Website (Zero Admin Access)

**Status:** Accepted  
**Deciders:** Kifl Leadership, Abrham (Core Lead)  
**Date:** August 2026  

---

## Context
In early design discussions, there was ambiguity regarding whether regular student members (with no leadership post) should have individual logins to the management system to view their personal attendance or teaching schedules.

However, Kifl leadership clarified that:
1. Student members serve collectively in teams under leadership supervision.
2. Managing hundreds of student login credentials across active campus semesters creates excessive administrative overhead and security attack surface.
3. Ministry communication for regular members is already well-served through the public portfolio website and Telegram group broadcasts.

---

## Decision
1. **Zero Admin Portal Access:** Regular members (`MEMBER_REGULAR`) without active leadership roles are not provisioned authentication credentials and cannot log into `apps/admin`.
2. **Public Portfolio Only:** Regular members interact with Hitsanat Kifl digitally exclusively through the Public Portfolio Website (`apps/portfolio` at `https://hitsanat.vercel.app`) with no login and no personalized views (identical experience to general public visitors).

---

## Consequences
### Positive:
- Drastically simplifies authentication, authorization, and data privacy safeguards.
- Eliminates administrative burden of student user credential provisioning and password resets.
- Completely protects internal ministry data (children's contact details, internal reports) behind leadership-only authentication.

### Negative:
- Student servants cannot view their personal assignment history in a private portal; assignments are communicated via team leaders and Telegram notices.
