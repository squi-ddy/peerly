FROM oven/bun:alpine AS base

FROM base AS builder

RUN apk --no-cache add --virtual build-deps build-base python3
WORKDIR /app/
COPY package.json bun.lockb ./
RUN bun i
COPY . .
RUN bun run build

FROM node:lts-alpine AS node

# some Node APIs are not directly supported by bun, so we have to use node to deploy
# from https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#smaller-images-without-npmyarn
FROM alpine AS deploy
# Create app directory
WORKDIR /usr/src/app
# Add required binaries
RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
  && chown node:node ./
COPY --from=node /usr/local/bin/node /usr/local/bin/
COPY --from=node /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
USER node
# Update the following COPY lines based on your codebase
COPY --from=builder /app/dist ./dist
# Run with dumb-init to not start node with PID=1, since Node.js was not designed to run as PID 1
CMD ["dumb-init", "node", "dist/index.js"]