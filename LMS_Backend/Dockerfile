# Single-stage image: this backend needs the prisma CLI (a devDependency)
# not just at build time but every container start, to run
# `prisma migrate deploy` before the server boots — so devDependencies stay
# in the final image rather than being pruned. Fine for a small app on one
# VPS; not something you'd want on a fleet of short-lived containers.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 5000

# Apply any pending migrations, then start the server. Safe to run on
# every restart — migrate deploy is a no-op once the schema is current.
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
