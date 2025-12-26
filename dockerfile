# =========================
# BUILD STAGE
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Build do TypeScript
RUN npm run build


# =========================
# PRODUCTION STAGE
# =========================
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário do build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Variáveis de ambiente
ENV NODE_ENV=production
ENV MONGO_URL_LOCAL=
ENV MONGO_DB_USER=
ENV MONGO_DB_PASSWORD=
ENV MONGO_URL=

# Porta padrão da API
EXPOSE 5000

# Start da aplicação
CMD ["node", "dist/index.js"]

VOLUME [ "/data" ]
