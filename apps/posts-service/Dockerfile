FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY apps/posts-service/package*.json ./
COPY package*.json ./
RUN pnpm install
COPY apps/posts-service ./
EXPOSE 3004
CMD ["pnpm", "run", "dev"]
