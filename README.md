# chickvideogames-web — public studio site

**PUBLIC** GitHub Pages repo. Serves the **Chick Video Games** studio landing at the apex
`https://chickvideogames.com/`. Studio-level (not tied to any single game) — the public face of
the developer. Games get their own subdomains + repos (e.g. Cozy Block Garden →
`cbg.chickvideogames.com`, repo `cbg-privacy`).

## Contents (this is ALL that belongs here)
- `index.html` — the studio landing page (self-contained HTML/CSS, no external requests).
- `assets/` — web-optimized images used by the page (game key art, icon, screenshots).
- `app-ads.txt` — AdMob authorized-sellers file (served at the apex; must match the store
  "developer website" domain if that is set to `chickvideogames.com`).
- `CNAME` — `chickvideogames.com` (GitHub Pages custom domain, apex).
- `.gitignore` — `.DS_Store`.

## 🔒 CONFIDENTIALITY RULE — read before EVERY commit
This repo is **PUBLIC**. **NEVER** commit anything other than the public files above. In particular,
**NEVER** put here:
- App/game source code (it lives in the **private** per-game repos, e.g. `cbg-game`/`cbg-infra`/`cbg-art`).
- Any studio/business identity value: CUIT/DNI, fiscal address, phone, invoices, D&B/ARCA constancias.
  (Those live **outside any repo**, in the local `ChickVideoGames/` parent folder.)
- Any secret: Firebase config / `google-services.json` / `.plist`, API keys, App Check debug tokens,
  GA4 `api_secret`, service accounts, project ids, uids, tokens, local filesystem paths.

**Before each push, run a secret scan** and confirm only the public files changed:
```sh
grep -rniE "api[_-]?key|secret|token|password|private[_-]?key|google-services|\.plist|service.account|bearer|/Users/|[0-9]{2}-?[0-9]{8}-?[0-9]|cuit|dni" . --exclude-dir=.git --exclude-dir=assets
git status --porcelain
```

## Assets pipeline
Images are copied from the game's art repo and downscaled for web (small, fast-loading):
```sh
# from ChickVideoGames/
SRC=cozy_block_garden/codebase/cbg-art/exports
sips -Z 256 "$SRC/icons/app_icon_512.png" --out codebase/chickvideogames-web/assets/icon.png
sips -s format jpeg -s formatOptions 82 -Z 1100 "$SRC/store/feature_graphic_1024x500.png" --out codebase/chickvideogames-web/assets/feature.jpg
# screenshots -> assets/shot-1..3.jpg (sips -s format jpeg -Z 980)
```

## Deploy
GitHub Pages, branch `main`, root. Custom domain (apex) via `CNAME` + Cloudflare DNS
(A records → GitHub Pages IPs, `www` CNAME → `leofernandezg.github.io`). Enforce HTTPS after DNS
resolves. Details: `ChickVideoGames/DOMAIN.md`.
