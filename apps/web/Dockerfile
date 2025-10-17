FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY apps/web/package*.json ./
COPY package*.json ./
RUN pnpm install
COPY apps/web ./
EXPOSE 3000
CMD ["pnpm", "run", "dev"]
