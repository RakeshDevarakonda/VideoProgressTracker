FROM node:18-alpine

WORKDIR /backendvideoprogress

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000


CMD ["node", "index.js"]


