# Project Review and Cloudflare Pages Recommendations

## Summary

This project is configured for Astro server output with the `@astrojs/cloudflare` adapter and builds successfully with `npm run build`. The generated deployment artifact structure is compatible with Cloudflare Pages SSR, producing the expected `dist/client`, `dist/server`, and `dist/server/wrangler.json` output.

## What is working

- `astro.config.mjs` uses `output: 'server'` with `adapter: cloudflare()`.
- `npm run build` completes successfully and generates the expected `dist` files.
- Supabase SSR client initialization is server-side and does not expose secret environment variables.
- Turnstile CAPTCHA verification is performed on the server in `src/actions/index.ts`.
- The auth middleware in `src/middleware.ts` protects dashboard and auth routes appropriately.
- The project avoids obvious Node-only runtime APIs in source files.

## Cloudflare Pages compatibility checklist

1. Build command
   - `npm run build`
2. Build output directory
   - `dist`
3. Deployment artifact
   - confirm `dist/server/wrangler.json` is used by Pages
4. Required environment variables
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `PUBLIC_TURNSTILE_SITE_KEY`
   - optional: `PUBLIC_SITE_URL` or `SITE_URL`
5. Bindings needed in Pages
   - `SESSION` KV namespace binding
   - `IMAGES` Images binding if Cloudflare Images is enabled
6. Review `wrangler.jsonc`
   - This file may be useful for local worker tooling, but the Pages deployment should be validated against the generated `dist/server/wrangler.json`.

## Risks & concerns

- The `globalThis.process` shim in `astro.config.mjs` is currently a workaround for runtime compatibility. It works, but it indicates a dependency relying on Node globals that may not be ideal in Cloudflare Workers.
- There is no explicit rate limiting on sign-in attempts, which can leave the auth endpoint vulnerable to brute-force attacks.
- If the project later adds direct browser APIs in server code, Cloudflare Workers compatibility must be rechecked.
- `wrangler.jsonc` and the generated `dist/server/wrangler.json` must remain aligned to avoid deployment mismatch.

## Recommended plan

### Short-term

1. Confirm Cloudflare Pages settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables are configured in Pages
   - `SESSION` KV binding is defined
   - `IMAGES` Images binding is defined if using Cloudflare Images
2. Confirm root deployment config:
   - Add `SESSION` KV binding to the root `wrangler.json` or `wrangler.toml`
   - Ensure the root `wrangler.jsonc` or Pages dashboard settings include `nodejs_compat` under `compatibility_flags`
3. Test a Pages preview deploy to confirm SSR builds and auth flows work end-to-end.

### Patch plan for the next update

1. Update repository documentation and dev setup:
   - Document that Cloudflare Pages deploys from `dist`, while the generated build artifacts are in `dist/client` and `dist/server`.
   - Document that Cloudflare Pages currently reads root `wrangler.json`/`wrangler.toml` for bindings and compatibility flags.
   - Add recommended build environment versions to the docs:
     - `NODE_VERSION`: `22.16.0`
     - `NPM_VERSION`: `10.9.2`
2. Harden deployment config:
   - Add explicit `kv_namespaces` for `SESSION` to the root `wrangler.jsonc` or root Pages config.
   - Add `compatibility_flags`: `["nodejs_compat"]` to support Node-global shims like `globalThis.process`.
3. Harden secrets and env vars:
   - Mark `TURNSTILE_SECRET_KEY` as an encrypted secret in Cloudflare Pages.
   - Confirm Supabase keys are set as secrets in Pages and not exposed in repository files.
4. Strengthen security posture:
   - Keep the rate-limiting / generic error message items on the auth roadmap.
   - Add a short note that the `globalThis.process` shim is a compatibility workaround and should be revisited once dependencies no longer require Node globals.

### Medium-term

1. Harden authentication further:
   - add rate limiting to sign-in
   - optionally use CAPTCHA only for suspicious login attempts
   - enforce generic authentication failure messages for all login errors
2. Improve headers/security configuration:
   - consider adding `Content-Security-Policy`
   - enforce `SameSite`, `Secure`, and proper cookie attributes if cookies are managed manually
3. Consider removing the `globalThis.process` shim once upstream dependencies stop relying on process globals.

### Longer-term

1. Add CI validation steps:
   - `npm ci`
   - `npm run build`
   - optional lint or security audit
2. Document deployment requirements in repo documentation:
   - Cloudflare Pages bindings
   - required environment variables
   - build/output folder settings
3. Consider a production branch or release workflow for deploy-safe changes.
