import pc from "picocolors";
import { runAdd } from "./commands/add.js";
import { runList } from "./commands/list.js";

interface ParsedArgs {
  command?: string;
  positionals: string[];
  cwd: string;
  registry?: string;
  force: boolean;
  yes: boolean;
  help: boolean;
  version: boolean;
  noInstall: boolean;
  adapter?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = {
    positionals: [],
    cwd: process.cwd(),
    force: false,
    yes: false,
    help: false,
    version: false,
    noInstall: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    switch (arg) {
      case "--cwd":
        out.cwd = argv[++i] ?? process.cwd();
        break;
      case "--registry":
        out.registry = argv[++i];
        break;
      case "--force":
      case "-f":
        out.force = true;
        break;
      case "--yes":
      case "-y":
        out.yes = true;
        break;
      case "--no-install":
        out.noInstall = true;
        break;
      case "--adapter":
        out.adapter = argv[++i];
        break;
      case "--help":
      case "-h":
        out.help = true;
        break;
      case "--version":
      case "-v":
        out.version = true;
        break;
      default:
        if (arg.startsWith("-")) break; // ignore unknown flags
        if (!out.command) out.command = arg;
        else out.positionals.push(arg);
    }
  }
  return out;
}

const HELP = `
${pc.bold("astro-users")} — install Astro Users components into your Astro project.

${pc.bold("Usage")}
  astro-users <command> [options]

${pc.bold("Commands")}
  add <name...>     Copy component(s) into your src/ (with .env + config guidance)
  list              List available components in the registry
  help              Show this help

${pc.bold("Options")}
  --cwd <path>      Target project directory (default: current directory)
  --registry <ref>  Registry URL or local path (default: local dev / hosted)
  -y, --yes         Non-interactive; skip prompts and confirmations
  -f, --force       Overwrite existing files instead of writing *.astro-users-new
  --adapter <name>  SSR adapter to auto-install if missing (default: node)
  --no-install      Skip auto-installing npm dependencies
  -h, --help        Show help
  -v, --version     Show version

${pc.bold("Examples")}
  ${pc.dim("$")} astro-users list
  ${pc.dim("$")} astro-users add auth
  ${pc.dim("$")} astro-users add auth --cwd ./my-site
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.version) {
    console.log("astro-users 0.1.0");
    return 0;
  }
  if (args.help || !args.command || args.command === "help") {
    console.log(HELP);
    return 0;
  }

  switch (args.command) {
    case "add":
      return runAdd(args.positionals, {
        cwd: args.cwd,
        registry: args.registry,
        force: args.force,
        yes: args.yes,
        noInstall: args.noInstall,
        adapter: args.adapter,
      });
    case "list":
    case "ls":
      return runList(args.registry);
    default:
      console.error(pc.red(`Unknown command: ${args.command}`));
      console.log(HELP);
      return 1;
  }
}

main()
  .then((code) => process.exit(code ?? 0))
  .catch((err) => {
    console.error(pc.red(`\nUnexpected error: ${(err as Error).message}`));
    process.exit(1);
  });
