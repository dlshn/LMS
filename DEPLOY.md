# Deploying with Docker Compose on a VPS

Three containers: `postgres` (self-hosted database), `backend` (Node/Express +
Prisma, runs pending migrations on every start), `frontend` (Caddy — serves
the built React app and reverse-proxies `/api/*` to the backend, with
automatic HTTPS if you point a domain at it).

## 1. One-time VPS setup

```bash
# Install Docker + Compose (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out/in after this

git clone <your-repo-url> lms
cd lms
cp .env.example .env
```

Edit `.env`:
- `DOMAIN` — your real domain (e.g. `myclass.edu.lk`) for automatic HTTPS,
  or `:80` if you're testing on a bare IP with no domain yet.
- `PUBLIC_URL` — the full URL people will open: `https://myclass.edu.lk`,
  or `http://<vps-ip>` for the IP-only case. **Must match `DOMAIN`'s
  scheme** (`:80` ⇒ `http://...`, a real domain ⇒ `https://...`).
- `POSTGRES_PASSWORD`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — generate
  real random values, e.g. `openssl rand -base64 32`. Don't reuse the dev
  `.env` values that were ever in the repo.
- `R2_*` — same values as `LMS_Backend/.env` used locally.

If you're using a domain, point its DNS A record at the VPS's IP **before**
starting the stack — Caddy needs that to succeed at getting a Let's Encrypt
certificate.

## 2. Start it

```bash
docker compose up -d --build
docker compose logs -f backend   # watch migrations apply, then "listening on port 5000"
```

Open `PUBLIC_URL` in a browser. `/admin/register` creates the first tuition
class and its join code.

## 3. Updating after a code change

```bash
git pull
docker compose up -d --build
```

Backend migrations run automatically on every container start, so a new
migration file in the repo gets applied as part of this.

## 4. Backups

Postgres data lives in the `pgdata` named volume. Back it up with a nightly
cron job on the VPS:

```bash
# /etc/cron.d/lms-backup
0 2 * * * root docker exec lms-postgres-1 pg_dump -U lms lms | gzip > /var/backups/lms-$(date +\%F).sql.gz
```

Adjust the container name (`docker compose ps` to check it) and prune old
backups periodically. Restoring:

```bash
gunzip -c /var/backups/lms-2026-09-23.sql.gz | docker exec -i lms-postgres-1 psql -U lms lms
```

## Notes

- The `postgres` and `backend` services aren't published to the host —
  only `frontend` (Caddy) listens on 80/443. Nothing but Caddy is reachable
  from outside the VPS.
- Cloudflare R2 still handles note file storage, so there's no upload volume
  to back up beyond the database.
- Scaling to more than one VPS or multiple backend replicas isn't handled
  here — `prisma migrate deploy` racing across replicas on startup is the
  first thing that would need addressing if you ever go there.
