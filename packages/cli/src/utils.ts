import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

export interface ProjectInfo {
  root: string;
  hasAstro: boolean;
}

/** Confirm the target dir is a project root and report whether Astro is a dep. */
export async function detectProject(cwd: string): Promise<ProjectInfo> {
  const root = resolve(cwd);
  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) {
    throw new Error(
      `No package.json found in ${root}. Run this inside an Astro project, or pass --cwd <path>.`
    );
  }
  let hasAstro = false;
  try {
    const pkg = JSON.parse(await readFile(pkgPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    hasAstro = Boolean(pkg.dependencies?.astro ?? pkg.devDependencies?.astro);
  } catch {
    // ignore malformed package.json for detection purposes
  }
  return { root, hasAstro };
}

export type WriteOutcome = "created" | "unchanged" | "overwritten" | "conflict";

export interface WriteResult {
  target: string;
  outcome: WriteOutcome;
  /** When outcome is "conflict", the path the new content was written to instead. */
  altPath?: string;
}

/**
 * Write a component file, never clobbering user code silently.
 * - identical content -> "unchanged"
 * - new file -> "created"
 * - differs + force -> "overwritten"
 * - differs, no force -> write "<target>.astro-sb-auth-new" and report "conflict"
 */
export async function writeComponentFile(
  root: string,
  target: string,
  content: string,
  force: boolean
): Promise<WriteResult> {
  const abs = join(root, target);
  if (existsSync(abs)) {
    const existing = await readFile(abs, "utf8");
    if (existing === content) return { target, outcome: "unchanged" };
    if (!force) {
      const altAbs = `${abs}.astro-sb-auth-new`;
      await mkdir(dirname(altAbs), { recursive: true });
      await writeFile(altAbs, content, "utf8");
      return { target, outcome: "conflict", altPath: `${target}.astro-sb-auth-new` };
    }
    await writeFile(abs, content, "utf8");
    return { target, outcome: "overwritten" };
  }
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content, "utf8");
  return { target, outcome: "created" };
}

export interface EnvMergeResult {
  added: string[];
  skipped: string[];
}

/** Append env keys that aren't already present; never overwrite existing values. */
export async function mergeEnv(
  root: string,
  entries: { name: string; value: string; comment?: string }[]
): Promise<EnvMergeResult> {
  const envPath = join(root, ".env");
  let current = "";
  if (existsSync(envPath)) current = await readFile(envPath, "utf8");

  const added: string[] = [];
  const skipped: string[] = [];
  const lines: string[] = [];

  for (const entry of entries) {
    const present = new RegExp(`^\\s*${escapeRegExp(entry.name)}\\s*=`, "m").test(current);
    if (present) {
      skipped.push(entry.name);
      continue;
    }
    if (entry.comment) lines.push(`# ${entry.comment}`);
    lines.push(`${entry.name}=${entry.value}`);
    added.push(entry.name);
  }

  if (added.length > 0) {
    const prefix = current.length > 0 && !current.endsWith("\n") ? "\n" : "";
    const block = `${prefix}\n# --- Added by Astro SB Auth ---\n${lines.join("\n")}\n`;
    await writeFile(envPath, current + block, "utf8");
  }

  return { added, skipped };
}

export interface AstroConfigCheck {
  found: boolean;
  configPath?: string;
  isServer: boolean;
  hasAdapter: boolean;
}

/** Best-effort read of astro.config.* to warn (not rewrite) about SSR requirements. */
export async function checkAstroConfig(root: string): Promise<AstroConfigCheck> {
  const candidates = ["astro.config.mjs", "astro.config.ts", "astro.config.js", "astro.config.mts"];
  for (const name of candidates) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    const src = await readFile(p, "utf8");
    return {
      found: true,
      configPath: name,
      isServer: /output\s*:\s*['"](server|hybrid)['"]/.test(src),
      hasAdapter: /adapter\s*:/.test(src),
    };
  }
  return { found: false, isServer: false, hasAdapter: false };
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
