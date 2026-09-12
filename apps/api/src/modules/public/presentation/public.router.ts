import { Router } from "express";
import { getPublicAnnouncements, getPublicEvents, getPublicStats } from "./public.controller.js";

export const publicRouter: Router = Router();

// Public endpoints — NO authentication required (FR-11.3)
// Rate limiting should be applied at the middleware level

// Public Stats (CORE-041) — Sanitized aggregate data, no PII
publicRouter.get("/stats", getPublicStats);

// Published Events (CORE-041) — Countdown data
publicRouter.get("/events", getPublicEvents);

// Published Announcements (CORE-041)
publicRouter.get("/announcements", getPublicAnnouncements);
