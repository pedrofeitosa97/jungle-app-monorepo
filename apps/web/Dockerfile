# apps/web/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# 1) Trazer metadata do monorepo para resolver workspaces e manter cache
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
# 2) Trazer o package do web
COPY apps/web/package.json apps/web/package.json

# 3) Instalar deps do web (inclui devDeps -> vite)
RUN pnpm install --filter ./apps/web... --include-workspace-root --frozen-lockfile

# 4) Agora sim, copiar o restante do repo
COPY . .

EXPOSE 3000
# 5) Rodar o script do pacote web
CMD ["pnpm", "--filter", "./apps/web", "dev"]
