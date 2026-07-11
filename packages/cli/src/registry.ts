import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface ComponentFile {
  path: string;
  target: string;
  type?: string;
}

export interface ComponentEnv {
  name: string;
  prompt?: string;
  required?: boolean;
  public?: boolean;
  secret?: boolean;
  example?: string;
}

export interface Manifest {
  name: string;
  title: string;
  npmName?: string;
  aliases?: string[];
  description: string;
  tier: "free" | "pro";
  version: string;
  homepage?: string;
  license?: string;
  requires?: string[];
  npmDependencies?: Record<string, string>;
  astro?: { output?: "static" | "server" | "hybrid"; adapterRequired?: boolean };
  files: ComponentFile[];
  env?: ComponentEnv[];
  postInstall?: string[];
}

export interface RegistrySource {
  kind: "local" | "remote";
  base: string;
}

/** Default hosted registry, used when no local registry and no override is found. */
export const DEFAULT_REGISTRY_URL = "https://astrostack.dev/registry";

/**
 * Resolve where component manifests + files are read from.
 * Precedence: explicit override -> ASTROSTACK_REGISTRY env -> local monorepo
 * registry (dev) -> hosted default.
 */
export function resolveRegistry(override?: string): RegistrySource {
  const raw = override ?? process.env.ASTROSTACK_REGISTRY;
  if (raw) {
    if (/^https?:\/\//.test(raw)) return { kind: "remote", base: raw.replace(/\/$/, "") };
    return { kind: "local", base: resolve(raw) };
  }

  const local = findLocalRegistry();
  if (local) return { kind: "local", base: local };

  return { kind: "remote", base: DEFAULT_REGISTRY_URL };
}

/** Walk up from this file (and cwd) looking for a monorepo `registry/` dir. */
function findLocalRegistry(): string | null {
  const starts = [dirname(fileURLToPath(import.meta.url)), process.cwd()];
  for (const start of starts) {
    let dir = start;
    for (let i = 0; i < 8; i++) {
      const candidate = join(dir, "registry");
      if (existsSync(join(candidate, "schema.json"))) return candidate;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}

async function readSourceText(source: RegistrySource, relPath: string): Promise<string> {
  if (source.kind === "local") {
    return readFile(join(source.base, relPath), "utf8");
  }
  const url = `${source.base}/${relPath.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Registry fetch failed (${res.status}) for ${url}`);
  return res.text();
}

export async function loadManifest(source: RegistrySource, name: string): Promise<Manifest> {
  let text: string;
  try {
    text = await readSourceText(source, `${name}/registry.json`);
  } catch {
    throw new Error(`Component "${name}" was not found in the registry (${source.base}).`);
  }
  let manifest: Manifest;
  try {
    manifest = JSON.parse(text) as Manifest;
  } catch (err) {
    throw new Error(`Component "${name}" has an invalid manifest: ${(err as Error).message}`);
  }
  if (!manifest.name || !Array.isArray(manifest.files)) {
    throw new Error(`Component "${name}" has an incomplete manifest.`);
  }
  return manifest;
}

/** Read the raw contents of a component file listed in a manifest. */
export function readComponentFile(source: RegistrySource, manifest: Manifest, file: ComponentFile) {
  return readSourceText(source, `${manifest.name}/files/${file.path}`);
}

/**
 * Resolve a component plus its transitive `requires`, returning manifests in
 * install order (dependencies first, target last), de-duplicated.
 */
export async function resolveInstallPlan(source: RegistrySource, name: string): Promise<Manifest[]> {
  const seen = new Map<string, Manifest>();
  const order: Manifest[] = [];

  async function visit(slug: string, trail: string[]): Promise<void> {
    if (seen.has(slug)) return;
    if (trail.includes(slug)) {
      throw new Error(`Circular dependency: ${[...trail, slug].join(" -> ")}`);
    }
    const manifest = await loadManifest(source, slug);
    seen.set(slug, manifest);
    for (const req of manifest.requires ?? []) {
      await visit(req, [...trail, slug]);
    }
    order.push(manifest);
  }

  await visit(name, []);
  return order;
}

export function isAbsolutePath(p: string) {
  return isAbsolute(p);
}
