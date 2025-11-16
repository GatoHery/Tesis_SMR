FROM node:23-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install   # instala tsc

COPY . .

RUN npm run build   # funciona ahora

EXPOSE 5050

CMD ["node", "dist/main.js"]
