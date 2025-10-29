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

## ⚙️ Tecnologias Utilizadas

- **NestJS** — Framework Node.js modular e escalável
- **React + Vite** — Frontend moderno e rápido
- **TypeORM + PostgreSQL** — ORM e banco relacional
- **RabbitMQ** — Comunicação assíncrona entre microserviços
- **Socket.IO** — Notificações em tempo real
- **Turborepo + pnpm** — Estrutura monorepo e gerenciamento de pacotes
- **Docker Compose** — Orquestração dos serviços

---

## 🧠 Serviços e Rotas

### 🔐 Auth Service (`:3002`)

Responsável por autenticação e registro de usuários.

#### **Rotas**
| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `POST` | `/auth/register` | Cria um novo usuário |
| `POST` | `/auth/login` | Retorna token JWT para autenticação |
| `GET` | `/auth/verify` | Valida token JWT |

#### **Exemplo de Login**
```bash
POST http://localhost:3002/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "123456"
}
```
**Retorno:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "7bc8e113-18e7-4397-a36e-a3b8773e73b8",
    "email": "usuario@email.com",
    "name": "Pedro"
  }
}
```

---

### 📰 Posts Service (`:3004`)

Gerencia **posts**, **curtidas** e **comentários**.

#### **Rotas de Post**

| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `GET` | `/posts` | Lista todos os posts |
| `GET` | `/posts?postid={id}` | Retorna um post pelo ID |
| `POST` | `/posts` | Cria um novo post |
| `DELETE` | `/posts/{postId}` | Deleta um post existente |
| `POST` | `/posts/{postId}/like` | Adiciona ou remove curtida no post |

#### **Exemplo: Criar Post**
```bash
POST http://localhost:3004/posts
Content-Type: application/json

{
  "authorId": "7bc8e113-18e7-4397-a36e-a3b8773e73b8",
  "title": "Meu primeiro post",
  "content": "Olá comunidade!"
}
```
**Retorno:**
```json
{
  "id": "14990ba6-9494-4c6d-b1c1-6827c53cbbf2",
  "title": "Meu primeiro post",
  "content": "Olá comunidade!",
  "authorId": "7bc8e113-18e7-4397-a36e-a3b8773e73b8",
  "likes": 0,
  "comments": [],
  "createdAt": "2025-10-28T20:15:13.000Z"
}
```

#### **Exemplo: Buscar Post por ID**
```bash
GET http://localhost:3004/posts?postid=14990ba6-9494-4c6d-b1c1-6827c53cbbf2
```
**Retorno:**
```json
{
  "id": "14990ba6-9494-4c6d-b1c1-6827c53cbbf2",
  "title": "Meu primeiro post",
  "content": "Olá comunidade!",
  "authorId": "7bc8e113-18e7-4397-a36e-a3b8773e73b8",
  "likes": 2,
  "likedUsers": ["user123", "user456"],
  "comments": [
    {
      "id": "82cc7817-23cb-41e2-9e2e-bd3b857d5ed2",
      "content": "Muito bom!",
      "authorId": "e91b6a3d-77d9-4d0b-8c1b-9fcb1f2043f2"
    }
  ],
  "createdAt": "2025-10-28T20:15:13.000Z"
}
```

#### **Exemplo: Curtir Post**
```bash
POST http://localhost:3004/posts/f20b49b2-3355-4761-9148-c51dd9be946b/like
```
**Retorno:**
```json
{
  "message": "Post curtido com sucesso",
  "postId": "f20b49b2-3355-4761-9148-c51dd9be946b",
  "likes": 3
}
```

#### **Exemplo: Deletar Post**
```bash
DELETE http://localhost:3004/posts/8331e527-f8f6-4880-8bea-b4f9efc4a5b7
```
**Retorno:**
```json
{
  "message": "Post deletado com sucesso",
  "postId": "8331e527-f8f6-4880-8bea-b4f9efc4a5b7"
}
```

---

### 💬 Rotas de Comentários

| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `POST` | `/posts/{postId}/comments` | Cria novo comentário no post especificado |

#### **Exemplo: Criar Comentário**
```bash
POST http://localhost:3004/posts/14990ba6-9494-4c6d-b1c1-6827c53cbbf2/comments
Content-Type: application/json

{
  "authorId": "e91b6a3d-77d9-4d0b-8c1b-9fcb1f2043f2",
  "content": "Excelente post!"
}
```
**Retorno:**
```json
{
  "id": "0f24b69a-30ad-4cf8-a5b8-d8cf037a3a7a",
  "content": "Excelente post!",
  "authorId": "e91b6a3d-77d9-4d0b-8c1b-9fcb1f2043f2",
  "postId": "14990ba6-9494-4c6d-b1c1-6827c53cbbf2",
  "createdAt": "2025-10-28T20:20:10.000Z"
}
```

---

### 🔔 Notifications Service (`:3003`)

Gerencia **notificações em tempo real** via WebSocket.

#### **Eventos WebSocket**
| Evento | Descrição |
|---------|------------|
| `postCreated` | Novo post criado |
| `postLiked` | Post curtido |
| `postUnliked` | Curtida removida |
| `comment.added` | Novo comentário |
| `posts.refresh` | Atualiza feed de posts |

**Exemplo (cliente WebSocket):**
```js
socket.on("postLiked", (data) => {
  console.log("❤️ Post curtido:", data);
});
```

---

## 🧱 Boas Práticas
- Clean Architecture (controllers, services, repositories)
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
