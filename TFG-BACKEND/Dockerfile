# Etapa 1: Build
FROM node:23-slim AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa 2: Producción
FROM node:23-slim

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
RUN npm install

EXPOSE 5050
CMD ["node", "dist/index.js"]