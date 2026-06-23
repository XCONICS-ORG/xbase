import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cancel, intro, isCancel, multiselect, outro } from "@clack/prompts";
import pc from "picocolors";

const root = resolve(import.meta.dirname, "..");
const appsDirectory = resolve(root, "apps");
const args = process.argv.slice(2);

const isAll = args.includes("--all");
const isPrint = args.includes("--print");
function getPassedApps() {
  const values = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--app") {
      values.push(args[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg.startsWith("--app=")) {
      values.push(arg.slice("--app=".length));
    }
  }

  return values.flatMap((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

const passedApps = getPassedApps();

function printHelp() {
  console.log(`Interactive app dev runner

Commands:
  bun run dev
  bun run dev -- --all
  bun run dev -- --app web,storybook

Options:
  --all          Run every app with a dev script.
  --app <name>   Run one or more app directory names or package names.
  --print        Print the Turbo command without starting it.
  --help         Show this help text.
`);
}

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

async function readPackageJson(path) {
  const content = await readFile(path, "utf8");

  return JSON.parse(content);
}

async function getApps() {
  const entries = await readdir(appsDirectory, { withFileTypes: true });
  const apps = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directoryName = entry.name;
    const packagePath = resolve(appsDirectory, directoryName, "package.json");

    try {
      const packageJson = await readPackageJson(packagePath);

      if (packageJson.scripts?.dev) {
        apps.push({
          directoryName,
          label: `${directoryName} (${packageJson.name})`,
          packageName: packageJson.name,
        });
      }
    } catch {
      // Apps without a package.json are ignored.
    }
  }

  return apps.sort((left, right) =>
    left.directoryName.localeCompare(right.directoryName)
  );
}

function resolvePassedApps(apps) {
  const selected = [];

  for (const value of passedApps) {
    const app = apps.find(
      (candidate) =>
        candidate.directoryName === value || candidate.packageName === value
    );

    if (!app) {
      throw new Error(`No app found for "${value}".`);
    }

    selected.push(app);
  }

  return [...new Map(selected.map((app) => [app.packageName, app])).values()];
}

async function selectApps(apps) {
  if (isAll) {
    return apps;
  }

  if (passedApps.length > 0) {
    return resolvePassedApps(apps);
  }

  if (!process.stdin.isTTY) {
    throw new Error("Pass --all or --app when running dev non-interactively.");
  }

  intro(pc.cyan("Select apps to run"));

  const selectedPackageNames = await multiselect({
    message: "Which apps should start?",
    options: apps.map((app) => ({
      label: app.label,
      value: app.packageName,
    })),
    required: true,
  });

  if (isCancel(selectedPackageNames)) {
    cancel("Dev cancelled.");
    process.exit(0);
  }

  return apps.filter((app) => selectedPackageNames.includes(app.packageName));
}

function createCommand(apps) {
  return {
    command: "bun",
    args: [
      "--env-file=env/.env",
      "turbo",
      "dev",
      ...apps.flatMap((app) => [`--filter=${app.packageName}`]),
    ],
  };
}

async function runDev() {
  const apps = await getApps();

  if (apps.length === 0) {
    throw new Error("No apps with dev scripts were found in apps/.");
  }

  const selectedApps = await selectApps(apps);
  const { command, args: commandArgs } = createCommand(selectedApps);
  const commandText = [command, ...commandArgs].join(" ");

  if (isPrint) {
    console.log(commandText);
    return;
  }

  outro(`Starting ${selectedApps.map((app) => app.directoryName).join(", ")}`);

  const child = spawn(command, commandArgs, {
    cwd: root,
    stdio: "inherit",
  });

  const forwardSignal = (signal) => {
    child.kill(signal);
  };

  process.on("SIGINT", forwardSignal);
  process.on("SIGTERM", forwardSignal);

  child.on("exit", (code, signal) => {
    process.off("SIGINT", forwardSignal);
    process.off("SIGTERM", forwardSignal);

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

runDev().catch((error) => {
  console.error(pc.red(error instanceof Error ? error.message : String(error)));
  process.exit(1);
});
