FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g npm@latest

COPY --chown=node:node ["package.json", "package-lock.json", "./" ]

RUN npm ci --omit=dev

COPY --chown=node:node . .



FROM node:20-alpine

RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

RUN npm install -g npm@latest

COPY --from=builder --chown=node:node /usr/src/app/ ./

RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app/logs

ENV PORT=5500 \
    NODE_ENV=production \
    SERVER_URL="http://localhost:5500"

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5500/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

EXPOSE 5500

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "app.js"]
