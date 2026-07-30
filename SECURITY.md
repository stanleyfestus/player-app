# Dependency installation: why it's set up this way

There have been repeated npm supply-chain incidents where a compromised
package (or a compromised maintainer account) publishes a new version whose
`postinstall`/`preinstall` script exfiltrates environment variables, SSH
keys, or cloud credentials at install time — before you've run a single
line of your own code. This project is set up to reduce that risk on a
few layers:

## 1. Installs happen inside the dev container, not on your host

When you open this repo in VS Code's Dev Containers, installs run inside
the container defined in `.devcontainer/`, not directly on your laptop.
That container has no access to your host SSH keys, browser saved
passwords, cloud CLI credentials, or password manager. If a malicious
install script ever did run, there's very little on the container for it
to steal. This is the single biggest mitigation here — worth using the
dev container even if you skip everything else below.

## 2. `ignore-scripts=true` in `.npmrc`

Both `backend/.npmrc` and `frontend/.npmrc` set `ignore-scripts=true`.
This blocks *all* `preinstall`/`install`/`postinstall` scripts from every
package by default — including any injected by a compromised dependency.

Two packages in this project legitimately need a script to run once:

- `esbuild` (used internally by Vite) needs to fetch its native binary.
- `@prisma/client` / `prisma` need to download their query-engine binary.

The dev container's `postCreateCommand`
(`.devcontainer/post-create.sh`) installs with scripts disabled, then
explicitly runs only those two known, reviewed steps:

```
npm rebuild esbuild            # frontend
npx prisma generate            # backend, also fetches the engine binary
```

Nothing else gets to run a script. If you add a new dependency later and
something breaks because it also needs an install script, look at what
it's trying to do before adding it to this allowlist — don't just flip
`ignore-scripts` off globally.

## 3. Exact versions, always via a lockfile

`package.json` in both `backend/` and `frontend/` pins exact versions (no
`^` or `~`). Combined with `save-exact=true` in `.npmrc`, any future
`npm install <package>` you run will also pin exact, rather than a range
that could silently pull in a newer, compromised release later.

Once you have a `package-lock.json` committed (the dev container's first
run generates one for you), always install from it with:

```
npm ci
```

not `npm install`, both locally and in any CI/deploy step. `npm ci` fails
if `package.json` and `package-lock.json` disagree, and it installs
exactly what's in the lockfile (with integrity hashes checked) rather
than re-resolving versions.

## 4. Check provenance where it exists

After installing, you can run:

```
npm audit signatures
```

This verifies cryptographic provenance attestations for any packages that
publish them (not all do yet, but coverage is growing). It won't catch
everything, but it's a free extra check.

## Updating dependencies later

When you do want to bump a version: change it deliberately in
`package.json`, run `npm install`, review the resulting `package-lock.json`
diff, then commit both. Avoid blanket `npm update` across the whole tree.
