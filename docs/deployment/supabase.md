# Deployment: Supabase PostgreSQL Database Setup

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Target Engine:** Managed PostgreSQL 15+  

---

## 1. Connection Architecture & Pooling

Supabase provides direct and pooled PostgreSQL connection strings:

- **Transaction Connection (Port 5432 / Direct):** Used by `drizzle-kit` for executing schema migrations.
- **Session / Pool Connection (Port 6543 / Supavisor):** Used by the Express API (`apps/api`) runtime to handle high-concurrency client requests efficiently within free-tier connection limits.

---

## 2. Backup & Disaster Recovery Strategy

- **Daily Backups:** Supabase automatically creates daily snapshots of the database.
- **Drizzle SQL Versioning:** All schema changes are version-controlled in `packages/database/drizzle/*.sql`, enabling recreation of the full database structure on any standard PostgreSQL instance at any time.
