FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package*.json ./

RUN npm install

COPY . .

FROM node:20-alpine AS runner

WORKDIR /src

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

CMD ["node", "app.js"]