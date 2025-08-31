FROM node:23-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Create the uploads directory
RUN mkdir -p /usr/src/app/uploads

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD ["npm", "run", "dev"]