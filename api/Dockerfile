FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache \
    bash \
    curl \
    postgresql-client \
    iputils \
    net-tools \
    && rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm install --only=production
RUN npm install -g ts-node typescript tsconfig-paths @types/node

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src

RUN mkdir -p dist/seeds

ENV NODE_ENV=development
ENV PORT=3000


COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/bin/bash", "/start.sh"]
