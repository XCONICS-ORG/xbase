import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  select,
} from "@clack/prompts";
import pc from "picocolors";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const appsDirectory = resolve(root, "apps");
const args = process.argv.slice(2);
const force = args.includes("--force");
const appArg = args.find((arg) => !arg.startsWith("--"));

const routeFiles = [
  {
    path: "api/upload/route.ts",
    content:
      '// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.\nexport { POST } from "@xbase/bucket/next";\n',
  },
  {
    path: "api/upload/delete/route.ts",
    content:
      '// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.\nexport { deleteUpload as POST } from "@xbase/bucket/next";\n',
  },
  {
    path: "api/upload/rename/route.ts",
    content:
      '// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.\nexport { renameUpload as POST } from "@xbase/bucket/next";\n',
  },
  {
    path: "api/upload/object/[...key]/route.ts",
    content:
      '// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.\nexport {\n  streamUploadObject as GET,\n  streamUploadObject as HEAD,\n} from "@xbase/bucket/next";\n',
  },
  {
    path: "api/upload/proxy/route.ts",
    content:
      '// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.\nexport {\n  proxySignedUploadRequest as DELETE,\n  proxySignedUploadRequest as POST,\n  proxySignedUploadRequest as PUT,\n} from "@xbase/bucket/next";\n',
  },
];

function printHelp() {
  console.log(`Bucket app setup

Commands:
  bun run bucket:setup
  bun run bucket:setup web
  bun run bucket:setup web --force

This adds @xbase/bucket to the selected app and creates the Next App Router
upload endpoints under app/api/upload.
`);
}

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function listApps() {
  const entries = await readdir(appsDirectory, { withFileTypes: true });
  const apps = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directory = resolve(appsDirectory, entry.name);
    const packageJsonPath = resolve(directory, "package.json");

    if (!(await pathExists(packageJsonPath))) {
      continue;
    }

    const packageJson = await readJson(packageJsonPath);

    apps.push({
      directory,
      name: entry.name,
      packageJson,
      packageJsonPath,
    });
  }

  return apps.sort((left, right) => left.name.localeCompare(right.name));
}

function stopIfCancel(value) {
  if (isCancel(value)) {
    cancel("Bucket setup was not changed.");
    process.exit(0);
  }

  return value;
}

async function selectApp(apps) {
  if (appArg) {
    const app = apps.find(
      (item) => item.name === appArg || item.packageJson.name === appArg
    );

    if (!app) {
      throw new Error(`App "${appArg}" was not found in apps/.`);
    }

    return app;
  }

  return stopIfCancel(
    await select({
      message: "Select app to install bucket upload routes",
      options: apps.map((app) => ({
        label: `${app.name} (${app.packageJson.name})`,
        value: app.name,
      })),
    })
  );
}

async function resolveAppDirectory(appDirectory) {
  const appRouterDirectory = resolve(appDirectory, "app");
  const srcAppRouterDirectory = resolve(appDirectory, "src/app");
  const candidates = [];

  if (await pathExists(appRouterDirectory)) {
    candidates.push(appRouterDirectory);
  }

  if (await pathExists(srcAppRouterDirectory)) {
    candidates.push(srcAppRouterDirectory);
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  if (candidates.length > 1) {
    return stopIfCancel(
      await select({
        message: "Select App Router directory",
        options: candidates.map((directory) => ({
          label: directory.replace(`${root}/`, ""),
          value: directory,
        })),
      })
    );
  }

  return appRouterDirectory;
}

async function updateAppPackageJson(app) {
  const nextPackageJson = {
    ...app.packageJson,
    dependencies: {
      ...(app.packageJson.dependencies ?? {}),
      "@xbase/bucket": "workspace:*",
    },
  };

  await writeFile(
    app.packageJsonPath,
    `${JSON.stringify(nextPackageJson, null, 2)}\n`
  );
}

async function writeRouteFile(path, content) {
  if (await pathExists(path)) {
    const existing = await readFile(path, "utf8");

    if (existing === content) {
      return "unchanged";
    }

    if (!force) {
      const shouldOverwrite = stopIfCancel(
        await confirm({
          initialValue: false,
          message: `Overwrite ${path.replace(`${root}/`, "")}?`,
        })
      );

      if (!shouldOverwrite) {
        return "skipped";
      }
    }
  }

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);

  return "written";
}

async function installBucketRoutes(app) {
  const appRouterDirectory = await resolveAppDirectory(app.directory);
  const results = [];

  for (const routeFile of routeFiles) {
    const filePath = resolve(appRouterDirectory, routeFile.path);
    const result = await writeRouteFile(filePath, routeFile.content);

    results.push({
      path: filePath.replace(`${root}/`, ""),
      result,
    });
  }

  return results;
}

async function main() {
  intro("Bucket app setup");

  const apps = await listApps();

  if (apps.length === 0) {
    throw new Error("No apps with package.json were found in apps/.");
  }

  const selected = await selectApp(apps);
  const app =
    typeof selected === "string"
      ? apps.find((item) => item.name === selected)
      : selected;

  if (!app) {
    throw new Error("Selected app was not found.");
  }

  await updateAppPackageJson(app);
  const results = await installBucketRoutes(app);
  const written = results.filter((item) => item.result === "written").length;
  const unchanged = results.filter(
    (item) => item.result === "unchanged"
  ).length;
  const skipped = results.filter((item) => item.result === "skipped").length;

  outro(
    `${pc.green("Bucket setup complete")} in ${pc.cyan(app.name)}. Routes written: ${written}, unchanged: ${unchanged}, skipped: ${skipped}.`
  );
}

main().catch((error) => {
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
