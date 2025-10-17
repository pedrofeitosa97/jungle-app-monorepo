FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY apps/notifications-service/package*.json ./
COPY package*.json ./
RUN pnpm install
COPY apps/notifications-service ./
EXPOSE 3003
CMD ["pnpm", "run", "dev"]
