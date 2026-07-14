import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  loadManifest,
  readComponentFile,
  resolveInstallPlan,
  resolveRegistry,
  type ComponentEnv,
  type Manifest,
  type RegistrySource,
} from "../registry.js";
import {
  checkAstroConfig,
  detectProject,
  mergeEnv,
  writeComponentFile,
  type WriteResult,
} from "../utils.js";

export interface AddOptions {
  cwd: string;
  registry?: string;
  force: boolean;
  yes: boolean;
}

export async function runAdd(names: string[], opts: AddOptions): Promise<number> {
  p.intro(pc.bgMagenta(pc.black(" Astro SB Auth ")));

  if (names.length === 0) {
    p.log.error("Specify at least one component, e.g. " + pc.cyan("astro-sb-auth add auth"));
    p.outro(pc.red("Nothing to install."));
    return 1;
  }

  const project = await detectProject(opts.cwd);
  if (!project.hasAstro) {
    p.log.warn(
      `${pc.dim(project.root)}\n  No ${pc.cyan("astro")} dependency detected — installing anyway, but this may not be an Astro project.`
    );
  }

  const source = resolveRegistry(opts.registry);
  p.log.info(`Registry: ${pc.dim(`${source.kind} · ${source.base}`)}`);

  // Resolve manifests (with transitive requires), de-duplicated across all requested names.
  const manifests: Manifest[] = [];
  const seen = new Set<string>();
  const spin = p.spinner();
  spin.start("Resolving components");
  try {
    for (const name of names) {
      const plan = await resolveInstallPlan(source, name);
      for (const m of plan) {
        if (!seen.has(m.name)) {
          seen.add(m.name);
          manifests.push(m);
        }
      }
    }
  } catch (err) {
    spin.stop("Resolution failed", 1);
    p.log.error((err as Error).message);
    p.outro(pc.red("Install aborted."));
    return 1;
  }
  spin.stop(`Resolved ${manifests.length} component${manifests.length === 1 ? "" : "s"}`);

  // Pro gating (delivered in a later milestone).
  const pro = manifests.filter((m) => m.tier === "pro");
  if (pro.length > 0) {
    p.log.error(
      `${pro.map((m) => pc.cyan(m.name)).join(", ")} ${pro.length === 1 ? "is a Pro component" : "are Pro components"} and require a license key.\n  Pro delivery is not enabled yet.`
    );
    p.outro(pc.red("Install aborted."));
    return 1;
  }

  // Aggregate npm deps.
  const npmDeps: Record<string, string> = {};
  for (const m of manifests) Object.assign(npmDeps, m.npmDependencies ?? {});

  // Show the plan.
  const planLines: string[] = [];
  for (const m of manifests) {
    planLines.push(pc.bold(`${m.title} ${pc.dim(`v${m.version} · ${m.tier}`)}`));
    for (const f of m.files) planLines.push(`  ${pc.green("+")} ${f.target}`);
  }
  const depNames = Object.keys(npmDeps);
  if (depNames.length > 0) {
    planLines.push(pc.bold("npm dependencies"));
    for (const [n, v] of Object.entries(npmDeps)) planLines.push(`  ${pc.yellow("•")} ${n}@${v}`);
  }
  p.note(planLines.join("\n"), "Install plan");

  if (!opts.yes) {
    const go = await p.confirm({ message: `Install into ${pc.cyan(project.root)}?` });
    if (p.isCancel(go) || !go) {
      p.cancel("Cancelled.");
      return 1;
    }
  }

  // Write files.
  const results: WriteResult[] = [];
  const write = p.spinner();
  write.start("Writing files");
  for (const m of manifests) {
    for (const f of m.files) {
      const content = await readComponentFile(source, m, f);
      results.push(await writeComponentFile(project.root, f.target, content, opts.force));
    }
  }
  write.stop("Files written");
  renderFileResults(results);

  // Environment variables.
  await handleEnv(project.root, manifests, opts, source);

  // Astro SSR sanity check.
  const needsServer = manifests.some((m) => m.astro?.output === "server" || m.astro?.output === "hybrid");
  const needsAdapter = manifests.some((m) => m.astro?.adapterRequired);
  if (needsServer || needsAdapter) {
    const cfg = await checkAstroConfig(project.root);
    const warns: string[] = [];
    if (!cfg.found) warns.push("No astro.config.* found — add one with an SSR adapter.");
    else {
      if (needsServer && !cfg.isServer)
        warns.push(`Set ${pc.cyan("output: 'server'")} in ${cfg.configPath}.`);
      if (needsAdapter && !cfg.hasAdapter)
        warns.push(`Add an SSR ${pc.cyan("adapter")} (e.g. @astrojs/cloudflare) in ${cfg.configPath}.`);
    }
    if (warns.length > 0) p.log.warn("Astro config:\n  " + warns.join("\n  "));
  }

  // Dependency install hint.
  if (depNames.length > 0) {
    const pm = detectPackageManager(project.root);
    p.log.info(
      `Install dependencies:\n  ${pc.cyan(`${pm} ${pm === "npm" ? "install" : "add"} ${depNames.join(" ")}`)}`
    );
  }

  // Post-install notes.
  const notes = manifests.flatMap((m) => (m.postInstall ?? []).map((line) => `• ${line}`));
  if (notes.length > 0) p.note(notes.join("\n"), "Next steps");

  p.outro(pc.green(`Installed ${manifests.map((m) => m.name).join(", ")}. Happy building.`));
  return 0;
}

function renderFileResults(results: WriteResult[]) {
  const symbol: Record<WriteResult["outcome"], string> = {
    created: pc.green("created"),
    overwritten: pc.yellow("overwritten"),
    unchanged: pc.dim("unchanged"),
    conflict: pc.red("conflict"),
  };
  const lines = results.map((r) => {
    const base = `${symbol[r.outcome]}  ${r.target}`;
    if (r.outcome === "conflict") {
      return `${base}\n  ${pc.dim(`→ kept your file; wrote ${r.altPath} for you to compare`)}`;
    }
    return base;
  });
  p.log.message(lines.join("\n"));

  if (results.some((r) => r.outcome === "conflict")) {
    p.log.warn(
      "Some files already existed and were left untouched. Review the .astro-sb-auth-new files and merge manually, or re-run with --force to overwrite."
    );
  }
}

async function handleEnv(
  root: string,
  manifests: Manifest[],
  opts: AddOptions,
  _source: RegistrySource
) {
  // Collect unique env entries across all manifests.
  const entries = new Map<string, ComponentEnv>();
  for (const m of manifests) for (const e of m.env ?? []) if (!entries.has(e.name)) entries.set(e.name, e);
  if (entries.size === 0) return;

  // Which are already defined in .env?
  const envPath = join(root, ".env");
  const currentEnv = existsSync(envPath) ? await readFile(envPath, "utf8") : "";
  const missing = [...entries.values()].filter(
    (e) => !new RegExp(`^\\s*${e.name}\\s*=`, "m").test(currentEnv)
  );
  if (missing.length === 0) {
    p.log.info(pc.dim("All required environment variables already present in .env."));
    return;
  }

  const values: { name: string; value: string; comment?: string }[] = [];
  if (opts.yes) {
    for (const e of missing) values.push({ name: e.name, value: "", comment: e.prompt });
  } else {
    for (const e of missing) {
      const answer = await p.text({
        message: `${pc.cyan(e.name)}${e.required ? "" : pc.dim(" (optional)")}${e.prompt ? pc.dim(` — ${e.prompt}`) : ""}`,
        placeholder: e.example ?? (e.secret ? "•••• (kept in .env, git-ignored)" : ""),
        defaultValue: "",
      });
      if (p.isCancel(answer)) {
        p.cancel("Cancelled.");
        process.exit(1);
      }
      values.push({ name: e.name, value: (answer as string) ?? "", comment: e.prompt });
    }
  }

  const merged = await mergeEnv(root, values);
  if (merged.added.length > 0)
    p.log.success(`Wrote ${merged.added.length} variable(s) to .env: ${merged.added.join(", ")}`);
  if (merged.skipped.length > 0) p.log.info(pc.dim(`Left existing: ${merged.skipped.join(", ")}`));
}

function detectPackageManager(root: string): "pnpm" | "yarn" | "npm" {
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  return "npm";
}

export async function describeComponent(name: string, registry?: string): Promise<Manifest> {
  return loadManifest(resolveRegistry(registry), name);
}
