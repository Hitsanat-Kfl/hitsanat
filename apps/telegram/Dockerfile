FROM node:20-alpine AS base
RUN corepack enable
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/database/package.json ./packages/database/
COPY apps/telegram/package.json ./apps/telegram/

RUN pnpm install --frozen-lockfile || pnpm install

COPY packages/database ./packages/database
COPY apps/telegram ./apps/telegram
COPY tsconfig.json ./

WORKDIR /app/apps/telegram
CMD ["pnpm", "start"]
