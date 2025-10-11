# Infra notes

## Cloudflare Access (Auth)
* Protect `https://goldshore.org/admin/*` via Zero Trust → Access → Applications → Self-hosted

## DNS
* `goldshore.org` → Pages project (admin)
* `api.goldshore.org/*` → Worker route → Service: `GoldShore`
