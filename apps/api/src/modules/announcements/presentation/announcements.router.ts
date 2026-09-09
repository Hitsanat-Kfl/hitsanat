import { Router } from "express";
import {
  createAnnouncement,
  listAnnouncements,
  publishAnnouncement,
} from "./announcements.controller.js";

export const announcementsRouter: Router = Router();

// Announcement CRUD (CORE-040)
announcementsRouter.post("/", createAnnouncement);
announcementsRouter.get("/", listAnnouncements);

// Publish (CORE-040) — RBAC: Ekd and Chairperson can publish
announcementsRouter.put("/:id/publish", publishAnnouncement);

// TODO PTF-003 (Backend Support - Israel): Telegram Bot Service
// Create apps/telegram standalone worker service
// Polls for published announcements and posts to Telegram group

// TODO PTF-009 (Backend Support - Israel): Portfolio Integration Tests
// Test public stats, events, announcements endpoints
// Test no PII in public responses
// Test rate limiting

// TODO PTF-010 (Backend Support - Israel): OpenAPI Documentation
// Document public and announcement endpoints
// Define schemas, error responses

// TODO PTF-004 (Frontend 1 - Eyob): Portfolio Home Page
// Build portfolio home page in apps/portfolio
// Ministry overview, welcome message in Amharic
// Ethiopian calendar display, mobile-responsive

// TODO PTF-005 (Frontend 1 - Eyob): Event Countdown Displays
// Build event countdown components in apps/portfolio
// Countdown timer for upcoming events
// Ethiopian calendar date display

// TODO PTF-006 (Frontend 1 - Eyob): Announcement Feed
// Build announcement feed in apps/portfolio
// Announcements sorted by published_at (newest first)

// TODO PTF-007 (Frontend 1): Public Stats Display
// Build public stats section in apps/portfolio
// Active members, enrolled children, completed events counts
