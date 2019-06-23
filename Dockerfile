# node stable, alpine stable
FROM node:10.15.3-alpine
EXPOSE 8000

RUN mkdir -p /usr/src/jmoyers_org

WORKDIR /usr/src/jmoyers_org

COPY package.json package.json

RUN npm install

COPY . .

CMD ["npm", "run-script", "prod"]
