FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node ["package.json", "package-lock.json", "./" ]

RUN npm ci

COPY --chown=node:node . .



FROM node:20-alpine

WORKDIR /usr/src/app


COPY --from=builder --chown=node:node /usr/src/app/ ./

ENV PORT=5500 \
    NODE_ENV=production \
    SERVER_URL="http://localhost:5500"

USER node

EXPOSE 5500

CMD ["node", "app.js"]