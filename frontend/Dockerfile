FROM oven/bun:alpine AS base

RUN apk --no-cache add --virtual build-deps build-base python3

FROM base AS dependencies

WORKDIR /app/
COPY package.json bun.lockb ./
RUN bun i -p

FROM base AS build

WORKDIR /app/
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN bun run build

FROM nginx:alpine-slim AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /data/www/peerly

