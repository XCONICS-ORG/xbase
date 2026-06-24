import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  select,
  text,
} from "@clack/prompts";
import pc from "picocolors";

const root = resolve(import.meta.dirname, "../..");
const appsDirectory = resolve(root, "apps");
const assetsIconsDirectory = resolve(root, "packages/assets/public/icons");
const args = process.argv.slice(2);

const getArgValue = (name) => {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === name) {
      return args[index + 1];
    }

    if (arg.startsWith(`${name}=`)) {
      return arg.slice(name.length + 1);
    }
  }
};

const hasArg = (name) => args.includes(name);
const passedApp = getArgValue("--app");
const passedName = getArgValue("--name");
const passedShortName = getArgValue("--short-name");
const passedDescription = getArgValue("--description");
const shouldForce = hasArg("--force");
const shouldYes = hasArg("--yes");

function printHelp() {
  console.log(`PWA setup

Commands:
  bun run pwa:setup
  bun run pwa:setup -- --app web
  bun run pwa:setup -- --app web --name Xbase --short-name Xbase --yes

Options:
  --app <name>           App directory name or package name.
  --name <name>          PWA display name.
  --short-name <name>    PWA short name.
  --description <text>   PWA description.
  --force                Overwrite existing generated wrapper files.
  --yes                  Use defaults for non-critical prompts.
  --help                 Show this help text.
`);
}

if (hasArg("--help")) {
  printHelp();
  process.exit(0);
}

const stopIfCancel = (value, message = "PWA setup cancelled.") => {
  if (isCancel(value)) {
    cancel(message);
    process.exit(0);
  }

  return value;
};

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const writeJson = async (path, value) => {
  await writeFile(`${path}`, `${JSON.stringify(value, null, 2)}\n`);
};

const toTitleCase = (value) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");

const toAppId = (directoryName) =>
  directoryName
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function pathExists(path) {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

async function getNextApps() {
  const entries = await readdir(appsDirectory, { withFileTypes: true });
  const apps = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directoryName = entry.name;
    const appDirectory = resolve(appsDirectory, directoryName);
    const packagePath = resolve(appDirectory, "package.json");
    const layoutPath = resolve(appDirectory, "app/layout.tsx");

    try {
      const packageJson = await readJson(packagePath);
      const hasNext = Boolean(
        packageJson.dependencies?.next || packageJson.devDependencies?.next
      );

      if (hasNext && (await pathExists(layoutPath))) {
        apps.push({
          appDirectory,
          directoryName,
          label: `${directoryName} (${packageJson.name})`,
          packageJson,
          packagePath,
          packageName: packageJson.name,
        });
      }
    } catch {
      // Ignore non-app folders.
    }
  }

  return apps.sort((left, right) =>
    left.directoryName.localeCompare(right.directoryName)
  );
}

function resolvePassedApp(apps) {
  const app = apps.find(
    (candidate) =>
      candidate.directoryName === passedApp || candidate.packageName === passedApp
  );

  if (!app) {
    throw new Error(`No Next app found for "${passedApp}".`);
  }

  return app;
}

async function selectApp(apps) {
  if (passedApp) {
    return resolvePassedApp(apps);
  }

  if (!process.stdin.isTTY) {
    throw new Error("Pass --app when running PWA setup non-interactively.");
  }

  const selectedPackageName = stopIfCancel(
    await select({
      message: "Which app should be wrapped with PWA support?",
      options: apps.map((app) => ({
        label: app.label,
        value: app.packageName,
      })),
    })
  );

  return apps.find((app) => app.packageName === selectedPackageName);
}

async function promptText({ defaultValue, message, passedValue }) {
  if (passedValue) {
    return passedValue;
  }

  if (shouldYes || !process.stdin.isTTY) {
    return defaultValue;
  }

  return stopIfCancel(
    await text({
      defaultValue,
      message,
      placeholder: defaultValue,
    })
  );
}

async function writeGeneratedFile(path, content) {
  const exists = await pathExists(path);

  if (exists && !shouldForce) {
    const current = await readFile(path, "utf8");

    if (current === content) {
      return "unchanged";
    }

    if (!shouldYes && process.stdin.isTTY) {
      const overwrite = stopIfCancel(
        await confirm({
          initialValue: false,
          message: `Overwrite ${path.replace(`${root}/`, "")}?`,
        })
      );

      if (!overwrite) {
        return "skipped";
      }
    } else {
      return "skipped";
    }
  }

  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, content);
  return exists ? "updated" : "created";
}

async function updatePackageJson(app) {
  const packageJson = app.packageJson;
  packageJson.dependencies = packageJson.dependencies ?? {};
  let changed = false;

  for (const dependency of ["@xbase/constants", "@xbase/libs"]) {
    if (packageJson.dependencies[dependency] !== "workspace:*") {
      packageJson.dependencies[dependency] = "workspace:*";
      changed = true;
    }
  }

  if (!changed) {
    return "unchanged";
  }

  await writeJson(app.packagePath, packageJson);
  return "updated";
}

async function updateNextConfig(app) {
  const nextConfigPath = resolve(app.appDirectory, "next.config.ts");
  const exists = await pathExists(nextConfigPath);

  if (!exists) {
    return "missing";
  }

  const content = await readFile(nextConfigPath, "utf8");

  const missingPackages = ["@xbase/constants", "@xbase/libs"].filter(
    (packageName) => !content.includes(`"${packageName}"`)
  );

  if (missingPackages.length === 0) {
    return "unchanged";
  }

  const transpileMatch = content.match(/transpilePackages\s*:\s*\[([\s\S]*?)\]/);

  if (transpileMatch) {
    const replacement = `transpilePackages: [${transpileMatch[1]}${missingPackages
      .map((packageName) => `\n    "${packageName}",`)
      .join("")}\n  ]`;
    await writeFile(
      nextConfigPath,
      content.replace(transpileMatch[0], replacement)
    );
    return "updated";
  }

  await writeFile(
    nextConfigPath,
    content.replace(
      /const nextConfig:\s*NextConfig\s*=\s*\{/,
      `const nextConfig: NextConfig = {\n  transpilePackages: [${missingPackages
        .map((packageName) => `"${packageName}"`)
        .join(", ")}],`
    )
  );
  return "updated";
}

async function updateLayout(app) {
  const layoutPath = resolve(app.appDirectory, "app/layout.tsx");
  let content = await readFile(layoutPath, "utf8");
  const originalContent = content;

  if (!content.includes("@xbase/libs/pwa/provider")) {
    const importLines = [...content.matchAll(/^import .*$/gm)];
    const lastImport = importLines.at(-1);

    if (!lastImport) {
      throw new Error(`${layoutPath} has no imports to attach PwaProvider.`);
    }

    const insertAt = (lastImport.index ?? 0) + lastImport[0].length;
    content = `${content.slice(0, insertAt)}\nimport { PwaProvider } from "@xbase/libs/pwa/provider";${content.slice(insertAt)}`;
  }

  if (!content.includes("<PwaProvider>")) {
    content = content.replace("{children}", "<PwaProvider>{children}</PwaProvider>");
  }

  if (content === originalContent) {
    return "unchanged";
  }

  await writeFile(layoutPath, content);
  return "updated";
}

const createMetadataExportName = (directoryName) =>
  `${toTitleCase(directoryName).replace(/\s+/g, "")}Metadata`;

const createMetadataSource = ({ appId, description, exportName, name, shortName }) => `export const ${exportName} = {
  appId: "${appId}",
  title: "${name}",
  shortName: "${shortName}",
  description: "${description}",
  root: {
    title: "Home",
    description: "${name} web application.",
  },
} as const;
`;

const createManifestSource = ({ appId, exportName }) => `import { resolve } from "node:path";
import { ${exportName} } from "@xbase/constants/metadata/${appId}";
import { createPwaManifest } from "@xbase/libs/pwa/manifest";
import { getPwaThemeColors } from "@xbase/libs/pwa/theme";

export const dynamic = "force-dynamic";

const pwaThemeColors = getPwaThemeColors({
  cssPath: resolve(process.cwd(), "../../packages/design-system/styles/globals.css"),
});

export default createPwaManifest({
  appId: ${exportName}.appId,
  name: ${exportName}.title,
  shortName: ${exportName}.shortName,
  description: ${exportName}.description,
  ...pwaThemeColors,
});
`;

const createServiceWorkerRouteSource = ({ appId, exportName }) => `import { ${exportName} } from "@xbase/constants/metadata/${appId}";
import { createPwaServiceWorkerRoute } from "@xbase/libs/pwa/service-worker";

export const dynamic = "force-static";

export const GET = createPwaServiceWorkerRoute({
  appId: ${exportName}.appId,
  defaultNotificationTitle: ${exportName}.title,
  version: \`${"${"}${exportName}.appId}-pwa-v1\`,
});
`;

const createIconRouteSource = () => `import { resolve } from "node:path";
import { createPwaIconRoute } from "@xbase/libs/pwa/assets";

export const dynamic = "force-static";
export const runtime = "nodejs";

export const GET = createPwaIconRoute({
  assetsRoot: resolve(process.cwd(), "../../packages/assets/public/icons"),
});
`;

async function main() {
  intro("PWA app setup");

  const apps = await getNextApps();

  if (apps.length === 0) {
    throw new Error("No Next app-router apps were found.");
  }

  const app = await selectApp(apps);
  const appId = toAppId(app.directoryName);
  const metadataExportName = createMetadataExportName(app.directoryName);
  const defaultName = toTitleCase(app.directoryName);
  const name = await promptText({
    defaultValue: defaultName,
    message: "PWA display name",
    passedValue: passedName,
  });
  const shortName = await promptText({
    defaultValue: name,
    message: "PWA short name",
    passedValue: passedShortName,
  });
  const description = await promptText({
    defaultValue: `${name} web application.`,
    message: "PWA description",
    passedValue: passedDescription,
  });

  const results = [];
  results.push(["package.json", await updatePackageJson(app)]);
  results.push(["next.config.ts", await updateNextConfig(app)]);
  results.push(["app/layout.tsx", await updateLayout(app)]);
  results.push([
    `packages/constants/metadata/${appId}/metadata.ts`,
    await writeGeneratedFile(
      resolve(root, `packages/constants/metadata/${appId}/metadata.ts`),
      createMetadataSource({
        appId,
        description,
        exportName: metadataExportName,
        name,
        shortName,
      })
    ),
  ]);
  results.push([
    `packages/constants/metadata/${appId}/index.ts`,
    await writeGeneratedFile(
      resolve(root, `packages/constants/metadata/${appId}/index.ts`),
      'export * from "./metadata";\n'
    ),
  ]);
  results.push([
    "app/manifest.ts",
    await writeGeneratedFile(
      resolve(app.appDirectory, "app/manifest.ts"),
      createManifestSource({ appId, exportName: metadataExportName })
    ),
  ]);
  results.push([
    "app/sw.js/route.ts",
    await writeGeneratedFile(
      resolve(app.appDirectory, "app/sw.js/route.ts"),
      createServiceWorkerRouteSource({ appId, exportName: metadataExportName })
    ),
  ]);
  results.push([
    "app/icons/[app]/[file]/route.ts",
    await writeGeneratedFile(
      resolve(app.appDirectory, "app/icons/[app]/[file]/route.ts"),
      createIconRouteSource()
    ),
  ]);

  const appIconDirectory = resolve(assetsIconsDirectory, appId);
  await mkdir(appIconDirectory, { recursive: true });

  if ((await readdir(appIconDirectory)).length === 0) {
    await writeFile(resolve(appIconDirectory, ".gitkeep"), "");
  }

  const summary = results
    .map(([label, status]) => `${pc.cyan(label)} ${status}`)
    .join("\n");

  outro(`${pc.green("PWA setup finished for")} ${pc.cyan(app.directoryName)}

${summary}

Add icons here:
  packages/assets/public/icons/${appId}/pwa-180.png
  packages/assets/public/icons/${appId}/pwa-192.png
  packages/assets/public/icons/${appId}/pwa-512.png
  packages/assets/public/icons/${appId}/pwa-w-180.png
  packages/assets/public/icons/${appId}/pwa-w-192.png
  packages/assets/public/icons/${appId}/pwa-w-512.png
`);
}

main().catch((error) => {
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
