FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/auth-service/package.json apps/auth-service/package.json
RUN pnpm install --filter ./apps/auth-service... --include-workspace-root --frozen-lockfile

COPY . .

EXPOSE 3002
CMD ["pnpm", "--filter", "./apps/auth-service", "dev"]
