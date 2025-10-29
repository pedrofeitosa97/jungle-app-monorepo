# 🦍 Jungle App Monorepo

Um **monorepo completo** desenvolvido com **Turborepo**, estruturado em múltiplos microserviços baseados em **NestJS** e um frontend em **React (Vite)**.  
O projeto segue boas práticas de arquitetura limpa, escalabilidade e comunicação assíncrona entre serviços via **RabbitMQ**.

---

## 🚀 Visão Geral

A aplicação é um **fórum social distribuído**, composto por quatro serviços principais:

| Serviço | Porta | Descrição |
|----------|--------|-----------|
| **Auth Service** | `3002` | Gerencia autenticação, JWT e cadastro de usuários |
| **Posts Service** | `3004` | CRUD de posts, curtidas e comentários |
| **Notifications Service** | `3003` | Envia notificações em tempo real via WebSocket |
| **Web** | `3000` | Interface do usuário construída com React + Vite |

Cada microserviço roda de forma independente e se comunica através do **RabbitMQ**, garantindo isolamento e escalabilidade.

---

## 🧰 Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js v20+**  
  (Recomenda-se a versão **20.11.1** ou superior)
- **pnpm v9+**
- **Docker** e **Docker Compose**
- **Git**

---

## ⚙️ Instalação do PNPM

O **pnpm** é utilizado como gerenciador de pacotes em todo o projeto.  
Se você ainda não o possui instalado, execute:

```bash
npm install -g pnpm
```

Verifique a instalação:
```bash
pnpm -v
```

---

## ⚙️ Configuração Inicial

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/pedrofeitosa97/jungle-app-monorepo.git
cd jungle-app-monorepo
```

### 2️⃣ Instalar Dependências Globais
Na raiz do projeto:
```bash
pnpm install
```

### 3️⃣ Instalar Dependências em Cada Microserviço
Cada serviço possui suas dependências locais. Execute dentro de cada pasta:

```bash
cd apps/auth-service && pnpm install
cd ../posts-service && pnpm install
cd ../notifications-service && pnpm install
cd ../web && pnpm install
```

### 4️⃣ Configurar Variáveis de Ambiente
Cada serviço em `/apps` possui seu próprio arquivo `.env`.

#### Exemplo — `apps/auth-service/.env`
```env
PORT=3002
JWT_SECRET=sua_chave_jwt_aqui
DATABASE_URL=postgresql://postgres:postgres@db:5432/jungle-db
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
```

#### Exemplo — `apps/posts-service/.env`
```env
PORT=3004
DATABASE_URL=postgresql://postgres:postgres@db:5432/jungle-db
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
```

---

## 🐳 Rodando com Docker

### Subir todos os serviços
```bash
docker compose up --build
```

Isso iniciará:
- PostgreSQL  
- RabbitMQ (interface em `http://localhost:15672` — user: admin / pass: admin)  
- Todos os microserviços NestJS  
- O frontend React

### Parar os serviços
```bash
docker compose down
```

### Resetar volumes (opcional)
```bash
docker compose down -v
```

---

## 🧠 Estrutura de Pastas
```bash
├── apps/
│   ├── auth-service/           # Serviço de autenticação (JWT)
│   ├── posts-service/          # Serviço de posts e comentários
│   ├── notifications-service/  # WebSockets e eventos RabbitMQ
│   └── web/                    # Frontend React (Vite)
├── turbo.json                  # Configuração do Turborepo
├── docker-compose.yml          # Orquestração dos serviços
├── package.json                # Scripts e dependências compartilhadas
└── README.md                   # Documentação do projeto
```

---

## 🧩 Scripts Úteis

### Ambiente local (sem Docker)
Rode cada serviço separadamente em modo watch:

```bash
cd apps/auth-service && pnpm run start:dev
cd apps/posts-service && pnpm run start:dev
cd apps/notifications-service && pnpm run start:dev
cd apps/web && pnpm run dev
```

---

## 🌐 Endpoints Principais

### 🔐 Auth Service (`:3002`)
| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `POST` | `/auth/register` | Cria um novo usuário e envia notificação |
| `POST` | `/auth/login` | Retorna token JWT |
| `GET` | `/auth/verify` | Valida token JWT |

**Exemplo de registro**
```bash
POST http://localhost:3002/auth/register
{
  "name": "Pedro",
  "email": "usuario@email.com",
  "password": "123456"
}
```
**Retorno**
```json
{
  "message": "Usuário registrado com sucesso e notificação enviada",
  "user": {
    "id": "c1b2e19e-55f2-432b-b321-891ced423f11",
    "name": "Pedro",
    "email": "usuario@email.com"
  }
}
```

---

### 📰 Posts Service (`:3004`)
| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `GET` | `/posts` | Lista todos os posts |
| `GET` | `/posts?postid={id}` | Retorna post por ID |
| `POST` | `/posts` | Cria um novo post |
| `DELETE` | `/posts/{postId}` | Deleta um post |
| `POST` | `/posts/{postId}/like` | Adiciona ou remove curtida |
| `POST` | `/posts/{postId}/comments` | Cria um comentário |

**Exemplo criar post**
```bash
POST http://localhost:3004/posts
{
  "authorId": "c1b2e19e-55f2-432b-b321-891ced423f11",
  "title": "Meu primeiro post",
  "content": "Olá comunidade!"
}
```
**Retorno**
```json
{
  "id": "4f78c98d-61ff-4b17-9b74-9df0f1f7e66c",
  "title": "Meu primeiro post",
  "content": "Olá comunidade!",
  "likes": 0,
  "comments": []
}
```

---

### 🔔 Notifications Service (`:3003`)
Gerencia **notificações em tempo real** via WebSocket.

**Eventos WebSocket**
| Evento | Descrição |
|---------|------------|
| `postCreated` | Novo post criado |
| `postLiked` | Post curtido |
| `postUnliked` | Curtida removida |
| `comment.added` | Novo comentário |
| `posts.refresh` | Atualização de feed |
| `user.registered` | Novo usuário registrado |

**Exemplo (frontend)**
```js
socket.on("user.registered", (data) => {
  console.log("🎉 Novo usuário:", data);
});
```

---

## 🧱 Boas Práticas
- Clean Architecture (controllers, services)
- Princípios SOLID
- DTOs com validação (`class-validator`)
- `.env` isolado por serviço
- ESLint e Prettier padronizados
- Logs estruturados para auditoria

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
