FROM node:16-alpine

COPY package.json ./

RUN ls -a

RUN npm install

COPY . .

RUN ls -a

CMD ["sh", "-c", "npm start"]

EXPOSE ${PORT}