FROM node:20-alpine

WORKDIR /app

COPY yarn.lock .
COPY package.json .

RUN yarn install --production

COPY index.js .

EXPOSE 4000

CMD [ "node", "index.js" ]
