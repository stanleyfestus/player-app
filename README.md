# Football Agency Skeleton

Minimal starting point: a public site where players submit a profile, a
public directory listing approved profiles, and a simple admin screen to
approve/reject submissions. No login required for players — only the
admin screen is protected.

## Structure

```
.devcontainer/   VS Code Dev Container config (Node + Postgres, isolated)
backend/         NestJS API (Prisma + Postgres)
frontend/        React (Vite) site
SECURITY.md      Why installs are set up the way they are (npm supply-chain hardening)
```

## 1. Recommended: open in VS Code Dev Containers

Requires the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
and Docker Desktop (or equivalent) running.

1. Open this folder in VS Code.
2. Command Palette → **Dev Containers: Reopen in Container**.
3. Wait for the build — it starts Postgres, installs both `backend` and
   `frontend` dependencies with scripts disabled by default, and runs only
   the two known-needed build steps (esbuild's binary, Prisma's client).
   See `SECURITY.md` for why. This first run also generates
   `package-lock.json` for each project — commit those once they appear.
4. Copy `backend/.env.example` → `backend/.env` and
   `frontend/.env.example` → `frontend/.env`.
5. In one terminal: `cd backend && npx prisma migrate dev --name init && npm run start:dev`
6. In another terminal: `cd frontend && npm run dev`

The API runs on http://localhost:3000, the site on http://localhost:5173 —
both ports are auto-forwarded by the dev container.

To create your admin login, generate a bcrypt hash for your chosen
password and put it in `backend/.env` as `ADMIN_PASSWORD_HASH` (along with
`ADMIN_EMAIL`):

```
node -e "require('bcryptjs').hash('yourpassword', 10).then(console.log)"
```

## 2. Without a dev container (installing straight on your machine)

Not recommended given recent npm supply-chain incidents — see
`SECURITY.md` — but if you do this, always use `npm ci` once a
`package-lock.json` exists (not `npm install`) so you get exactly the
audited, pinned versions.

```
docker compose up -d          # starts Postgres only, on localhost:5432

cd backend
cp .env.example .env
npm install                   # first time; npm ci afterwards
npx prisma migrate dev --name init
npm run start:dev

cd ../frontend
cp .env.example .env
npm install                   # first time; npm ci afterwards
npm run dev
```

## 3. What's here

- `POST /players` — public player registration (status defaults to PENDING)
- `GET /players` — public directory, only returns APPROVED profiles
- `POST /admin/login` — returns a JWT if email/password match your `.env` admin account
- `GET /admin/players?status=PENDING` — admin-only, list by status
- `PATCH /admin/players/:id/status` — admin-only, approve/reject a profile

There's no user account system for players yet (no player login) —
registration is a one-time form. If you later want players to edit their
own profile after submitting, that needs a proper accounts/auth system
added to the Players module.

## 4. Tests

- `backend/`: Jest, run with `npm test` inside `backend/`.
- `frontend/`: Vitest, run with `npm test` inside `frontend/`.

## 5. Deploying to Railway (one platform, one bill)

1. Push this project to a GitHub repo (backend and frontend can be two
   services from the same repo — Railway supports monorepos).
2. In Railway, create a new project, add a **Postgres** plugin.
3. Add a service pointing at `/backend` (Railway auto-detects Node/Nest).
   Set its environment variables (`DATABASE_URL` from the Postgres plugin,
   `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `FRONTEND_URL`).
   In its build settings, run `npm ci && npx prisma generate` as the
   build command so scripts stay disabled but the client still gets
   generated.
4. Add a second service pointing at `/frontend`. Set `VITE_API_URL` to the
   backend service's public Railway URL. Build command `npm ci && npm run build`,
   start command `npm run start` (serves the built files with `serve`).
5. Point your domain's DNS (at Hostnet) to the frontend service using the
   CNAME Railway gives you under that service's Settings > Domains.
6. Run `npx prisma migrate deploy` against the production `DATABASE_URL`
   once (Railway lets you run one-off commands from a service shell, or
   add it as a temporary "release" step).

## 6. Handing off admin work to a non-technical person

Once deployed, give her the `/admin` URL and her login. She never needs
Railway, Postgres, GitHub, or the dev container — just the login form and
the approve/reject buttons on `/admin/dashboard`.
