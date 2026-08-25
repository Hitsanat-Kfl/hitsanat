# ADR-0006: Decoupled Telegram Bot as a Standalone Service

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Hitsanat Kifl uses Telegram to broadcast announcements, feast reminders, and weekly training schedules to student members and parents.

Integrating the Telegram bot directly into the synchronous Express API request lifecycle would couple API availability to Telegram's external HTTP API rate limits and network latency. A failure or timeout when calling Telegram would fail or delay admin portal requests.

---

## Decision
1. **Standalone Service (`apps/telegram`):** The Telegram Bot runs as a decoupled standalone Node.js service.
2. **Event-Driven Integration:** The Express API persists announcements and emits domain events (`AnnouncementPublishedEvent`) or logs to an outbox table. The Telegram worker consumes these events and asynchronously executes group broadcasts.

---

## Consequences
### Positive:
- API responsiveness is completely isolated from Telegram API rate limits or network issues.
- The Telegram worker can be deployed, scaled, or restarted independently without impacting the admin API.

### Negative:
- Requires managing an additional standalone deployable service.
