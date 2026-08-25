# ADR-0012: Docker for Reproducible Development & Test Infrastructure

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Developers working on Windows, macOS, or Linux need a consistent, zero-configuration local PostgreSQL database that mirrors production versions, supports full ANSI SQL constraints, and can be easily reset for integration testing.

---

## Decision
Use **Docker Compose** (`docker-compose.yml`) to provision the local PostgreSQL 15 database instance and ephemeral test databases for CI and local development. Docker is used strictly for development and testing infrastructure, not as a mandatory production runtime constraint.

---

## Consequences
### Positive:
- Identical PostgreSQL version across all developer machines and GitHub Actions.
- Easy teardown and reset of test databases without polluting system services.

### Negative:
- Requires Docker Desktop or Docker engine installed on local development workstations.
