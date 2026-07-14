# Astro Users

A line of Astro-native components you install into your **own** `src/` and fully own — no
lock-in, no `node_modules` black box. One free flagship (`auth`) plus a planned set of paid
components, all delivered by a single shadcn-style installer.

```bash
# from anywhere inside an Astro project
npx astro-users add auth
```

The files land in your project. You can read, edit, and delete every line.

---

## Repository layout (pnpm monorepo)

```
astro-users/
├── packages/
│   └── cli/           # the `astro-users` installer (TypeScript, built with tsup)
├── registry/          # source of truth for installable components
│   ├── schema.json    # JSON Schema for a component manifest
│   └── auth/
│       ├── registry.json   # the "recipe": files, env vars, deps, post-install notes
│       └── files/          # the actual files copied into a user's project
├── pnpm-workspace.yaml
└── package.json       # workspace root
```

**Key idea:** the CLI is generic. Adding a new component = adding a folder under `registry/`
with a `registry.json` manifest and its `files/`. No CLI changes needed.

## How the installer works

`astro-users add <name>`:

1. Resolves the component and its `requires` (transitive dependencies) from the registry.
2. Shows an install plan and (interactively) asks to proceed.
3. Copies files into the project — **never clobbering** existing files. A conflicting file is
   written next to yours as `*.astro-users-new` unless you pass `--force`.
4. Merges required env vars into `.env`, prompting for values, skipping ones already set.
5. Warns (does not rewrite) if `astro.config.*` is missing `output: 'server'` or an adapter.
6. Prints the `npm/pnpm/yarn` install command for npm dependencies and any post-install steps.

### CLI commands

| Command                      | Action                                          |
| :--------------------------- | :---------------------------------------------- |
| `astro-users list`            | List available components                       |
| `astro-users add <name...>`   | Install one or more components                  |
| `astro-users add auth --yes`  | Non-interactive install                         |
| `--cwd <path>`               | Target a different project directory            |
| `--registry <url\|path>`     | Override the registry source                    |
| `--force`                    | Overwrite existing files                        |

### Registry resolution order

`--registry` flag → `ASTRO_USERS_REGISTRY` env → local monorepo `registry/` (dev) → hosted default.

## Developing

```bash
pnpm install                      # install workspace deps
pnpm --filter @astro-users/cli build   # build the CLI to packages/cli/dist
node packages/cli/dist/index.js list  # run it against the local registry

# try a real install into a scratch project
node packages/cli/dist/index.js add auth --cwd /path/to/some/astro-project
```

This repo intentionally has no demo app of its own — the installer and any demo it
produces are kept in separate projects so the demo can never mask drift between what's
in `registry/` and what actually gets installed. See `../astro-users-demo` for a working
demo built by running the installer above.

---

## Components

| Name   | Tier | Status  | Description                                                             |
| :----- | :--- | :------ | :---------------------------------------------------------------------- |
| `auth` | free | **built** | Email/password auth: Supabase SSR, Cloudflare Turnstile, honeypot, protected-route middleware. |

Planned paid components (specs in `../Component-stack/`): `stripe`, `forms`, `consent`, `rbac`,
`oauth`, `blog`, `upload`, `email`, `analytics`, `waitlist`.

## Roadmap

- **Milestone 1 — DONE:** monorepo + shadcn-style CLI + `auth` as the first registry entry;
  `astro-users add auth` verified end-to-end (file copy, conflict safety, `.env` merge, config check).
- **Milestone 2:** Pro gating — license-key validation, private registry endpoint, disclosed
  per-customer watermarking, and a public-web scan agent to match leaks against the customer list.
  (Note: no hidden/phone-home code — the delivered files are readable by the customer, so
  enforcement lives server-side + via disclosed license terms.)
- **Milestone 3+:** author the 10 paid components as registry manifests reusing the design system.

## Naming

- **Product line:** Astro Users · **CLI:** `astro-users`
- **Flagship (free):** slug `auth`, marketed as `astro-auth` (alias: `astro-users`).
- The legacy `astro-users` / `AstroAuth` / `Mindful Auth` labels are being retired.
