FROM node:20-alpine
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter ./apps/web...

COPY . .

EXPOSE 3000
CMD ["pnpm", "--filter", "./apps/web", "dev", "--host", "0.0.0.0", "--port", "3000"]