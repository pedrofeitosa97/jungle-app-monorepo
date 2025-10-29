FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/notifications-service/package.json apps/notifications-service/package.json
RUN pnpm install --filter ./apps/notifications-service... --include-workspace-root --frozen-lockfile

COPY . .

EXPOSE 3003
CMD ["pnpm", "--filter", "./apps/notifications-service", "dev"]
