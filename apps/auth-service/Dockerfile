FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN pnpm install

COPY . .
EXPOSE 3002
CMD ["pnpm", "run", "start:dev"]