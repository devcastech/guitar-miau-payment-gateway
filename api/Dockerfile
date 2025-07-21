FROM node:18-alpine AS builder

WORKDIR /app/api

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app/api

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

COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/api/package*.json ./
COPY --from=builder /app/api/start.sh ./

RUN mkdir -p dist/seeds

ENV NODE_ENV=development
ENV PORT=3000


RUN chmod +x ./start.sh

CMD ["./start.sh"]
