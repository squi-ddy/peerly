FROM oven/bun:alpine AS base

FROM base AS dependencies

WORKDIR /app/
COPY ./frontend/package.json ./frontend/bun.lockb ./
RUN bun i --frozen-lockfile

FROM base AS build

ARG API_URL=http://localhost:3000/
ARG NODE_ENV=production
ARG BASE_URL=/peerly
ENV VITE_API_URL=$API_URL
ENV NODE_ENV=$NODE_ENV
WORKDIR /app/
COPY ./frontend .
COPY ./frontend/vite.config.build.ts ./vite.config.ts
COPY ./backend/src/types ./src/backend/types
COPY --from=dependencies /app/node_modules ./node_modules
RUN bun run build -- --base $BASE_URL

FROM busybox:musl AS deploy

WORKDIR /app/
COPY --from=build /app/dist .
COPY ./frontend/httpd.conf /etc/httpd.conf
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000", "-c", "/etc/httpd.conf"]

