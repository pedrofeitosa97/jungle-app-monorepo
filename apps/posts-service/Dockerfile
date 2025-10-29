FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/posts-service/package.json apps/posts-service/package.json
RUN pnpm install --filter ./apps/posts-service... --include-workspace-root --frozen-lockfile

COPY . .

EXPOSE 3004
CMD ["pnpm", "--filter", "./apps/posts-service", "dev"]
