FROM oven/bun:alpine AS base

FROM base AS dependencies

WORKDIR /app/
COPY package.json bun.lockb ./
RUN bun i --frozen-lockfile --verbose

FROM base AS build

ARG API_URL=https://squiddy.me/peerly-api
ENV VITE_API_URL=$API_URL
ENV NODE_ENV=production
WORKDIR /app/
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN bun run build

FROM nginx:alpine-slim AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /data/www/peerly

