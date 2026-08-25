# Deployment: Docker Local & Testing Infrastructure

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Architecture ADR:** Docker Development Infrastructure (ADR-0012)  

---

## 1. Docker Compose Configuration (`docker-compose.yml`)

Docker is utilized for local development and running isolated PostgreSQL integration tests:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: hitsanat_postgres
    restart: always
    environment:
      POSTGRES_USER: hitsanat_user
      POSTGRES_PASSWORD: hitsanat_password
      POSTGRES_DB: hitsanat_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hitsanat_user -d hitsanat_dev"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Starting the Local Database:
```bash
docker compose up -d
```
