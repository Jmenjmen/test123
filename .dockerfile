FROM node:18.20.3
LABEL author="Artem"

COPY . ./app
WORKDIR /app

EXPOSE 1234
EXPOSE 4001

RUN npm i

CMD [ "npm", "start" ]