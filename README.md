# Order Management API — Technical Test

Este projeto é uma **API REST desenvolvida como teste técnico** para avaliação de conhecimentos em **Node.js, Express, TypeScript e MongoDB (Mongoose)**.

---

## 🎯 Objetivo do Projeto

Criar uma API para **gerenciamento de pedidos (Orders)**, contendo:

- Autenticação com JWT
- Controle de permissões por role (`admin`, `user`)
- CRUD de pedidos
- Fluxo de status com regras de negócio
- Validações de dados e regras de domínio
- Estrutura organizada em **controllers, services, models e middlewares**

---

## 🧱 Tecnologias Utilizadas

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **Mongoose**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **express-validator**

### Banco de Dados
- **MongoDB**

---

## 📁 Estrutura do Projeto

```bash
src
├── config # Configurações do ambiente (DB, JWT, etc)
├── controllers # Camada de controllers (entrada HTTP)
├── services # Regras de negócio
├── models # Schemas do Mongoose
├── routes # Definição das rotas da API
├── middlewares # Auth, permissões, validações
├── interfaces # Tipagens TypeScript
├── utils # Helpers (JWT, responses, erros)
└── index.ts # Entry point da aplicação
``` 


Após o build, os arquivos são compilados para a pasta `dist/`.

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- **Node.js** (versão 18+ recomendada)
- **MongoDB** (local ou Atlas)
- **npm**

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGO_DB_USER="usuario"
MONGO_DB_PASSWORD="hdsfsdof"
MONGO_URL=""
MONGO_URL_LOCAL="mongodb://localhost:27017/order-management"

NODE_ENV="local"
SERVER_PORT="3333"

JWT_SECRETS="Test123"
```
#### Ajuste o MONGO_URL conforme seu ambiente (local ou cloud).

---

# ▶️ Como Executar o Projeto
## 1️⃣ Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd order-management-test
``` 
## 2️⃣ Instalar as dependências

```bash
npm install
``` 

## 3️⃣ Rodar em modo desenvolvimento

```bash
npm run dev
``` 

## 4️⃣ Build para produção

```bash
npm run build
``` 
## 5️⃣ Rodar versão compilada

```bash
npm run start
``` 
# 🧪 Endpoints Principais
## 🔐 Autenticação

- POST /api/v1/auth/login

## 👤 Usuários

- POST /api/v1/user/sign-up
- GET  /api/v1/user

## 📦 Orders

- POST   /api/v1/orders
- GET    /api/v1/orders
- PATCH  /api/v1/orders/:id/advance

Fluxo de status do pedido

CREATED → ANALYSIS → COMPLETED

## Regras:

- Não é permitido pular etapas

- Não é permitido retroceder

- Pedido finalizado não pode ser alterado

# 🐳 Docker (Opcional)

### O projeto pode ser executado via Docker:

```bash
docker build -t order-api .
docker run -p 3000:3000 --env-file .env order-api
```                     

# 📌 Observações

- Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica

- O foco está em arquitetura, organização, boas práticas e regras de negócio

# 👨‍💻 Autor

## Pedro Ramos Paraiso

## Projeto desenvolvido como teste técnico para processo seletivo.