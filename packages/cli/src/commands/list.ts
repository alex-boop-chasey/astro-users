import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadManifest, resolveRegistry, type Manifest } from "../registry.js";

export async function runList(registry?: string): Promise<number> {
  p.intro(pc.bgMagenta(pc.black(" AstroStack ")));
  const source = resolveRegistry(registry);
  p.log.info(`Registry: ${pc.dim(`${source.kind} · ${source.base}`)}`);

  let slugs: string[] = [];
  try {
    if (source.kind === "local") {
      const entries = await readdir(source.base, { withFileTypes: true });
      slugs = entries
        .filter((e) => e.isDirectory() && existsSync(join(source.base, e.name, "registry.json")))
        .map((e) => e.name);
    } else {
      const res = await fetch(`${source.base}/index.json`);
      if (!res.ok) throw new Error(`Registry index unavailable (${res.status}).`);
      const index = (await res.json()) as { components: string[] };
      slugs = index.components ?? [];
    }
  } catch (err) {
    p.log.error((err as Error).message);
    p.outro(pc.red("Could not list components."));
    return 1;
  }

  const manifests: Manifest[] = [];
  for (const slug of slugs.sort()) {
    try {
      manifests.push(await loadManifest(source, slug));
    } catch {
      // skip unreadable entries
    }
  }

  if (manifests.length === 0) {
    p.outro(pc.yellow("No components found."));
    return 0;
  }

  const lines = manifests.map((m) => {
    const tag = m.tier === "pro" ? pc.yellow("[pro] ") : pc.green("[free]");
    return `${tag} ${pc.bold(m.name.padEnd(12))} ${pc.dim(m.description.split(".")[0] + ".")}`;
  });
  p.note(lines.join("\n"), `${manifests.length} component(s)`);
  p.outro(`Install with ${pc.cyan("astrostack add <name>")}`);
  return 0;
}
