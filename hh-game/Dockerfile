FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install http-server -g

ENTRYPOINT [ "http-server" ]