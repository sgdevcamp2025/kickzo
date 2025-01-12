FROM node:16

WORKDIR /usr/src/app

COPY . .
RUN npm install

RUN chmod 666 /usr/src/app/db.json


ARG MOCK_PORT=3999
ENV MOCK_PORT=$MOCK_PORT

EXPOSE $MOCK_PORT

CMD ["node", "server.js"]
