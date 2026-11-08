FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN ls -la dist/ && echo "Checking for src/app.js:" && ls -la dist/src/app.js || echo "app.js not found!"

EXPOSE 3000

CMD npm run migrate && npm start
