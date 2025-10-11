# GoldShore Monorepo

Monorepo for:
- **Admin UI** (Cloudflare Pages)
- **API Worker** (Cloudflare Workers, name: `GoldShore`)
- Shared packages (`packages/ui`, `packages/utils`)

## Quick start

```bash
corepack enable
pnpm i
pnpm -w ./apps/admin dev
```

## Deploy

* Admin → Cloudflare Pages via `.github/workflows/deploy-pages.yml`
* Admin fallback → GitHub Pages via `.github/workflows/gh-pages.yml` (set Pages "Source" to **GitHub Actions**)
  * Tip: keep this workflow disabled by renaming it to `gh-pages.disabled.yml` until you need the fallback.
* Admin mirror → Shared host via `.github/workflows/deploy-ftp.yml`
  * Choose `FTP_REMOTE_DIR=/public_html` for a full-site mirror or `/public_html/admin` to publish only the admin area.
  * Provide `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` (and optional `APACHE_AUTH_USERFILE_ABSPATH`) secrets to enforce HTTP Basic auth on the shared-host copy.
* API → Cloudflare Worker via `.github/workflows/deploy-worker.yml`

### Required GitHub Secrets (repo → Settings → Secrets and variables → Actions)

* CLOUDFLARE_ACCOUNT_ID
* CLOUDFLARE_API_TOKEN
* CF_PAGES_PROJECT (e.g. `goldshore-admin`)
* ALPACA_KEY (paper)
* ALPACA_SECRET (paper)
* OPENAI_API_KEY (optional)
* FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_REMOTE_DIR (optional; for shared-host deploy)
* BASIC_AUTH_USER, BASIC_AUTH_PASS, APACHE_AUTH_USERFILE_ABSPATH (optional; for securing the shared-host deploy)

## Design system

Shared design tokens live in `packages/ui/design-tokens.css`. Import the file into any workspace (or extend via Tailwind using `packages/ui/tailwind.config.cjs`) to adopt the GoldShore palette, typography stack, and elevation tiers described in the brand spec.

## Admin utility modules

The `apps/admin/src/lib` directory now provides scaffolding for network, auth, caching, streaming, formatting, risk math, forms, and UI affordances so the console, signal studio, and risk board can be composed quickly.
