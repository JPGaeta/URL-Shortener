FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate  \
  && yarn build \
  && yarn install --production 

# ---

FROM node:20-alpine

ENV NODE_ENV production
USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/yarn.lock ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/prisma ./prisma

EXPOSE 5000

CMD npx prisma migrate deploy && node dist/main.js