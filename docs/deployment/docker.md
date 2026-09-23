# Deployment: Docker Local & Testing Infrastructure

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Architecture ADR:** Docker Development Infrastructure (ADR-0012)  

---

## 1. Docker Compose Configuration (`docker-compose.yml`)

Docker is utilized for local development and running isolated PostgreSQL integration tests:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: hitsanat-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: hitsanat_dev
    ports:
      - '5434:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgres_test:
    image: postgres:16-alpine
    container_name: hitsanat-postgres-test
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: hitsanat_test
    ports:
      - '5433:5432'
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
```

Host connection string (local development):
```
postgresql://postgres:postgrespassword@localhost:5434/hitsanat_dev
```

### Starting the Local Database:
```bash
docker compose up -d
```
