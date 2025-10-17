FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY apps/api-gateway/package*.json ./
COPY package*.json ./
RUN pnpm install
COPY apps/api-gateway ./
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
