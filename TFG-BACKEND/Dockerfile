FROM node:23-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Compila tu backend (solo si usas TypeScript)
RUN npm run build

EXPOSE 5050

CMD ["node", "dist/main.js"]
