FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/generated ./generated
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

EXPOSE 3000

CMD [ "sh", "-c", "npm run prisma:migrate:deploy && npm run start" ]