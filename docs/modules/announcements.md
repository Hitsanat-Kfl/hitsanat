# Module Specification: Announcements & Integrations (M-11)

## Hitsanat Kifl Children's Ministry Management System
**Module ID:** M-11  
**Target Lane:** Backend Support (Israel) + Frontend Lane  
**Architectural ADR:** ADR-0006 (Decoupled Telegram Service)  

---

## 1. Module Overview

The Announcements module manages public notices, training updates, and feast reminders across the public website and Telegram.

```mermaid
sequenceDiagram
    autonumber
    actor Leader as Ekd / Chairperson
    participant API as Management API (apps/api)
    participant Web as Portfolio Website (apps/portfolio)
    participant TG as Telegram Bot Service (apps/telegram)
    participant Group as Telegram Church Group

    Leader->>API: Create & Publish Announcement
    API->>API: Persist Announcement in DB
    API->>Web: Public Feed immediately reflects announcement
    API->>TG: Triggers AnnouncementPublished Domain Event / Outbox
    TG->>Group: Formats & broadcasts message to Telegram Group
```

---

## 2. Decoupled Architecture (ADR-0006)

- Announcements are published synchronously to the database.
- The Telegram Bot (`apps/telegram`) operates as an independent worker listening to announcement events or polling the outbox table, ensuring that Telegram API network delays or rate limits never block the admin portal.

---

## 3. Key Use Cases

1. **`CreateAnnouncementUseCase`:** Authors announcement with title, Amharic content, target audience (`Public`, `Members`, `Parents`), and publishing options.
2. **`PublishAnnouncementUseCase`:** Sets `is_published = true`, updates public API feed, and emits `AnnouncementPublishedEvent`.
3. **`GetPublicAnnouncementsUseCase`:** Returns sanitized list of published announcements for the portfolio website.
