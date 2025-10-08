# Gold Shore monorepo

This repository follows the Gold Shore agent playbook: a lightweight monorepo that keeps the Astro site, Cloudflare Worker, and
infrastructure scripts in one place so the CI agent can ship predictable deployments.

## Layout

```
goldshore/
├─ apps/
│  ├─ api-router/      # Cloudflare Worker router
│  └─ web/             # Astro marketing site
├─ packages/
│  └─ image-tools/     # Sharp image optimisation script
├─ infra/
│  └─ scripts/         # DNS automation
├─ .github/workflows/  # Deploy + QA pipelines
├─ wrangler.toml       # Worker configuration
└─ package.json        # Workspace scripts for agents
```

### Key files

- `apps/web/src/styles/theme.css` — colour tokens and shared UI utilities.
- `apps/web/src/components/Header.astro` — responsive header with desktop nav and mobile affordance.
- `apps/web/src/components/Hero.astro` — animated “glinting” skyline hero that respects reduced motion preferences.
- `apps/api-router/src/router.ts` — Worker proxy that selects the correct Cloudflare Pages origin per hostname.
- `infra/scripts/upsert-goldshore-dns.sh` — idempotent DNS upsert script for `goldshore.org` and preview/dev subdomains.

For a deeper end-to-end deployment reference, read [GoldShore Implementation Guide](./GOLDSHORE_IMPLEMENTATION_GUIDE.md).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Astro dev server from `apps/web`. |
| `npm run build` | Optimise images then build the production site. |
| `npm run deploy:prod` | Deploy the Worker to the production environment. |
| `npm run deploy:preview` | Deploy the Worker to the preview environment. |
| `npm run deploy:dev` | Deploy the Worker to the dev environment. |
| `npm run qa` | Execute the local QA helper defined in `.github/workflows/local-qa.mjs`. |

## GitHub Actions

- `.github/workflows/deploy.yml` builds the site, deploys the Worker to production, and upserts DNS on pushes to `main` or manual runs.
- `.github/workflows/qa.yml` enforces Lighthouse performance/accessibility/SEO scores ≥ 0.90 on pull requests.
- `.github/workflows/ci.yml` provisions Node + Python toolchains, runs Ruff/pytest for every `services/*` package, and ensures the Astro workspace still builds on pushes and pull requests.
- `.github/workflows/paper-trade.yml` orchestrates the planner → notifier approval gate → executor loop during market hours (or manual dispatches) for paper trading.
- `.github/workflows/nightly-eval.yml` reconciles fills, computes performance, and shares scorecards with operators after the market closes.

## Secrets required in CI

Add the following secrets under **Settings → Secrets and variables → Actions**:

- `CF_API_TOKEN`
- `CF_ACCOUNT_ID`

If either secret is missing the deploy workflow will fail early, prompting the operator to add them before proceeding.

## Trading automation configuration

Provision these secrets and variables before enabling the paper-trading and nightly evaluation workflows:

| Name | Type | Purpose | Workflows |
| --- | --- | --- | --- |
| `ALPACA_API_KEY` | Secret | Alpaca API key for retrieving account state and submitting paper orders. | `paper-trade`, `nightly-eval` |
| `ALPACA_API_SECRET` | Secret | Alpaca API secret that pairs with the API key. | `paper-trade`, `nightly-eval` |
| `ALPACA_PAPER_BASE_URL` | Variable | REST base URL for the Alpaca paper endpoint (e.g. `https://paper-api.alpaca.markets`). | `paper-trade`, `nightly-eval` |
| `DATABASE_URL` | Secret | Connection string for the strategy state/analytics store. | `paper-trade`, `nightly-eval` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Variable | OpenTelemetry collector endpoint for structured traces/metrics. | `paper-trade`, `nightly-eval` |
| `OTEL_EXPORTER_OTLP_HEADERS` | Secret | Auth headers required by the OpenTelemetry collector. | `paper-trade`, `nightly-eval` |
| `SLACK_BOT_TOKEN` | Secret | Slack bot token with permission to post runbooks/scorecards. | `paper-trade`, `nightly-eval` |
| `SLACK_ALERT_CHANNEL` | Variable | Slack channel ID where automation updates should post. | `paper-trade`, `nightly-eval` |
| `TWILIO_ACCOUNT_SID` | Secret | Twilio SID for SMS/voice notifications. | `paper-trade`, `nightly-eval` |
| `TWILIO_AUTH_TOKEN` | Secret | Twilio auth token paired with the SID. | `paper-trade`, `nightly-eval` |
| `TWILIO_FROM_NUMBER` | Variable | Twilio number used as the sender for alerts. | `paper-trade`, `nightly-eval` |
| `TWILIO_TO_NUMBER` | Variable | Comma-separated list or primary number for operator alerts. | `paper-trade`, `nightly-eval` |
| `PAPER_TRADE_SYMBOLS` | Variable | Default comma-separated tickers the planner should consider. | `paper-trade` |
| `PAPER_TRADE_STRATEGY` | Variable | Default strategy slug used by the planner/executor. | `paper-trade` |
| `PAPER_TRADE_DRY_RUN` | Variable | Set to `true` to keep executions in simulation mode by default. | `paper-trade` |
| `PAPER_TRADE_AUTO_EXECUTE` | Variable | Set to `true` if approvals should auto-pass after notifications. | `paper-trade` |

The notifier steps read Twilio/Slack configuration while the executor uses Alpaca + database credentials. Store sensitive values as **secrets**; public configuration such as channel IDs can remain **variables**. Adjust naming if your existing infrastructure already standardises on different prefixes.

## DNS + environments

The Worker expects Cloudflare Pages projects mapped to:

- `goldshore-org.pages.dev` for production
- `goldshore-org-preview.pages.dev` for preview
- `goldshore-org-dev.pages.dev` for development

The DNS upsert script keeps these hostnames pointed at the correct Pages project using proxied CNAME records for:
`goldshore.org`, `www.goldshore.org`, `preview.goldshore.org`, and `dev.goldshore.org`.

Protect `/admin` with Cloudflare Access so only approved operators can reach the administrative shell.
