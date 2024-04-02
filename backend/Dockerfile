FROM oven/bun:alpine AS base

FROM base AS builder
WORKDIR /app/
COPY package.json bun.lockb ./
RUN bun i --frozen-lockfile
COPY . .
RUN bun run build

FROM base AS deploy
WORKDIR /app/
COPY --from=builder /app/dist/ /app/
CMD ["bun", "run", "index.js"]