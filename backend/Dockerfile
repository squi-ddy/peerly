FROM oven/bun:alpine AS base

FROM base AS builder

RUN apk --no-cache add --virtual build-deps build-base python3
WORKDIR /app/
COPY package.json bun.lockb ./
RUN bun i
COPY . .
RUN bun run build

FROM base AS deploy
# Create app directory
WORKDIR /usr/src/app
# Add required binaries
RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 bun && adduser -u 1000 -G bun -s /bin/sh -D bun \
  && chown bun:bun ./
USER bun
# Update the following COPY lines based on your codebase
COPY --from=builder /app/dist ./dist
# Run with dumb-init to not start node with PID=1, since Node.js was not designed to run as PID 1
CMD ["dumb-init", "bun", "dist/index.js"]