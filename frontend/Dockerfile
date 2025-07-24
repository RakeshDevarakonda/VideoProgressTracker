FROM node:18-alpine

WORKDIR /frontendvideoprogress

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
