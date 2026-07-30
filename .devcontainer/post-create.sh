#!/usr/bin/env bash
set -euo pipefail

echo "== Installing backend dependencies (npm ci, scripts disabled) =="
cd /workspace/backend
npm install --ignore-scripts

echo "== Installing frontend dependencies (npm ci, scripts disabled) =="
cd /workspace/frontend
npm install --ignore-scripts

echo "== Rebuilding esbuild (vite's bundler needs its native binary) =="
cd /workspace/frontend && npm rebuild esbuild

echo "== Generating the Prisma client (downloads its query engine binary) =="
cd /workspace/backend && npx prisma generate

echo "Done. Copy backend/.env.example to backend/.env and frontend/.env.example to frontend/.env, then see README.md."