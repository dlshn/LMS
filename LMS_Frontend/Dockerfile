# ---- build the static site ----
FROM node:20-alpine AS build
WORKDIR /app

# Vite bakes VITE_* vars into the bundle at build time, so this has to be
# a build arg, not a runtime env var.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- serve it + reverse-proxy the API, one container ----
FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
