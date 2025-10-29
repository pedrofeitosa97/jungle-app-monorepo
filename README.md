# 🦍 Jungle App Monorepo

Um **monorepo moderno** desenvolvido com **Turborepo**, estruturado em múltiplos microserviços baseados em **NestJS** e um frontend em **React (Vite)**.  
O projeto segue boas práticas de arquitetura limpa, desacoplamento entre domínios e comunicação assíncrona com **RabbitMQ**.

---

## 🚀 Visão Geral

A aplicação é um **fórum social** modularizado em quatro serviços principais:

| Serviço | Porta | Descrição |
|----------|--------|-----------|
| **Auth Service** | `3002` | Gerencia autenticação, JWT e cadastro de usuários |
| **Posts Service** | `3004` | CRUD de posts, curtidas e comentários |
| **Notifications Service** | `3003` | Gerencia notificações em tempo real via WebSocket |
| **Web** | `3000` | Interface do usuário construída com React + Vite |

Cada serviço roda de forma **independente**, porém se comunica via **mensageria (RabbitMQ)**, garantindo escalabilidade e isolamento.

---

## 🧩 Arquitetura

### 🧱 Estrutura Monorepo

```
jungle-app-monorepo/
│
├── apps/
│   ├── auth-service/           # Serviço de autenticação
│   ├── posts-service/          # Serviço de posts e comentários
│   ├── notifications-service/  # WebSockets e alertas
│   └── web/                    # Frontend (Vite + React)
│
├── package.json                # Scripts e dependências globais
├── pnpm-lock.yaml              # Lockfile do pnpm
├── turbo.json                  # Configuração do Turborepo
└── docker-compose.yml          # Orquestração de containers
```

### ⚙️ Padrões de Arquitetura
- **Monorepo:** gerenciado com [Turborepo](https://turbo.build/repo)
- **Back-end:** [NestJS](https://nestjs.com/)
- **Front-end:** [React + Vite](https://vitejs.dev/)
- **Mensageria:** [RabbitMQ](https://www.rabbitmq.com/)
- **Banco de dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Gerenciador de pacotes:** [pnpm](https://pnpm.io/)
- **Comunicação:** via filas (event-driven) e HTTP local entre serviços
- **Notificações:** via Socket.IO (tempo real)

---

## 🧠 Serviços

### 🔐 Auth Service
Gerencia autenticação e registro de usuários.  
Principais recursos:
- Registro e login de usuários
- Hash seguro de senhas (bcrypt)
- Geração e validação de tokens JWT
- Validação em middlewares nos demais serviços

**Stack:**  
NestJS, TypeORM, PostgreSQL, JWT, bcrypt.

---

### 📰 Posts Service
Gerencia **posts, curtidas e comentários**.  
Cada post contém autor, título, conteúdo e reações em tempo real.

Principais funcionalidades:
- CRUD completo de posts
- Sistema de likes/unlikes
- Comentários integrados
- Emissão de eventos RabbitMQ para notificações
- Atualização em tempo real via WebSocket (através do `notifications-service`)

**Stack:**  
NestJS, TypeORM, PostgreSQL, RabbitMQ.

---

### 🔔 Notifications Service
Responsável por notificações **em tempo real**, usando **WebSockets (Socket.IO)**.  
Recebe eventos do RabbitMQ e os distribui aos usuários conectados.

Funções principais:
- Receber eventos (`post.created`, `post.liked`, `comment.added`)
- Emitir notificações para todos ou usuários específicos
- Manter conexões de WebSocket autenticadas

**Stack:**  
NestJS, Socket.IO, RabbitMQ.

---

### 💻 Web (Frontend)
Interface construída com **React + Vite + TypeScript**.

Principais recursos:
- Login e registro de usuários (JWT)
- Exibição de posts, likes e comentários
- WebSocket em tempo real para notificações
- Cache e sincronização via **React Query**
- Estado global via **Zustand**

**Stack:**
- React 18
- Vite
- Zustand
- React Query
- Axios
- TailwindCSS
- Socket.IO Client

---

## 🧰 Principais Dependências

| Tipo | Biblioteca | Uso |
|------|-------------|-----|
| Backend | `@nestjs/core`, `@nestjs/typeorm`, `@nestjs/websockets`, `@nestjs/microservices` | Estrutura e comunicação |
| Banco | `pg`, `typeorm` | Integração com PostgreSQL |
| Segurança | `bcrypt`, `jsonwebtoken`, `passport` | Autenticação e segurança |
| Frontend | `react`, `vite`, `@tanstack/react-query`, `zustand` | Interface e cache |
| Realtime | `socket.io`, `socket.io-client` | Notificações em tempo real |
| DevOps | `docker`, `turborepo`, `pnpm` | Orquestração e build |

---

## 🐳 Docker Compose

O projeto inclui um `docker-compose.yml` com os serviços:
- `auth-service`
- `posts-service`
- `notifications-service`
- `web`
- `db` (PostgreSQL)
- `rabbitmq`

### Subir tudo:
```bash
docker compose up --build
```

### Verificar status:
```bash
docker compose ps
```

### Encerrar containers:
```bash
docker compose down -v
```

---

## 🧪 Execução Local (sem Docker)

> É possível rodar os serviços manualmente durante o desenvolvimento.

1. Crie o banco via Docker:
   ```bash
   docker run --name jungle-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=jungle-db -p 5432:5432 -d postgres:17-alpine
   ```

2. Configure o `.env` em cada app:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jungle-db
   RABBITMQ_URL=amqp://admin:admin@localhost:5672
   JWT_SECRET=supersecret
   ```

3. Rode cada app em modo watch:
   ```bash
   pnpm --filter auth-service dev
   pnpm --filter posts-service dev
   pnpm --filter notifications-service dev
   pnpm --filter web dev
   ```

---

## 🧩 Comunicação entre Serviços

Os microserviços comunicam-se de forma **assíncrona via RabbitMQ**, trocando eventos:
- `post.created` → notifica usuários
- `post.liked` → envia alerta ao autor
- `comment.added` → notifica o autor do post

E de forma **direta (HTTP)** apenas para autenticação e validação de usuários (`/auth/verify`).

---

## 🔄 Fluxo de Realtime (Notificações)

1. O usuário A cria um post → `posts-service` envia evento `post.created` via RabbitMQ.  
2. O `notifications-service` escuta o evento → emite via WebSocket para todos.  
3. O `web` (React) recebe o evento e atualiza a lista de posts com `React Query`.

Mesmo fluxo ocorre para curtidas (`post.liked`) e comentários (`comment.added`).

---

## 🧱 Boas Práticas Implementadas

- ✅ **Clean Architecture** com separação entre camadas (`controllers`, `services`, `repositories`)
- ✅ **Princípio SOLID** aplicado em serviços
- ✅ **DTOs e validações** com `class-validator` e `class-transformer`
- ✅ **Env variables seguras** via `.env`
- ✅ **Padronização com ESLint + Prettier**
- ✅ **Observabilidade** via logs em todos os eventos críticos

---

## 🧾 Scripts úteis

| Comando | Descrição |
|----------|------------|
| `pnpm dev` | Mensagem de aviso para rodar os apps isolados |
| `pnpm --filter auth-service dev` | Inicia o Auth Service |
| `pnpm --filter posts-service dev` | Inicia o Posts Service |
| `pnpm --filter notifications-service dev` | Inicia o Notifications Service |
| `pnpm --filter web dev` | Inicia o Frontend |
| `docker compose up --build` | Sobe todos os containers |
| `docker compose down -v` | Remove containers e volumes |

---

## 🧑‍💻 Autor

**Pedro — Desenvolvedor Full Stack**  
- ⚙️ Foco em arquitetura de microsserviços  
- 🧠 Experiência com NestJS, React e Docker  
- 🕸️ Arquiteturas escaláveis com RabbitMQ e WebSockets  

---

## 🏁 Licença
Projeto desenvolvido para fins técnicos e demonstração profissional.  
Licença MIT © 2025
