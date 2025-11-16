FROM node:23-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:23-slim
tall --production
WORKDIR /usr/src/app

COPY package*.json ./








CMD ["node", "dist/main.js"]EXPOSE 5050COPY --from=builder /usr/src/app/dist ./distRUN npm install --productionCMD ["node", "dist/main.js"]
