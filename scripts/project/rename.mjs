import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, extname, relative, resolve } from "node:path";
import { cancel, confirm, intro, isCancel, outro, text } from "@clack/prompts";
import pc from "picocolors";

const root = resolve(import.meta.dirname, "../..");
const rootPackagePath = resolve(root, "package.json");

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

const ignoredExtensions = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
]);

const args = process.argv.slice(2);
const leadingAtPattern = /^@/;
const slugSeparatorPattern = /[-_.]+/;
const scopePackagePattern = /^@([^/]+)\//;

function getArgValue(name) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`));

  if (inline) {
    return inline.slice(name.length + 1);
  }

  const index = args.indexOf(name);

  if (index >= 0) {
    return args[index + 1];
  }

  return;
}

const isDryRun = args.includes("--dry-run");
const isYes = args.includes("--yes");
const passedName = getArgValue("--name");
const passedFrom = getArgValue("--from");

function printHelp() {
  console.log(`Project renamer

Commands:
  bun run rename-project
  bun run rename-project -- --name acme
  bun run rename-project -- --name acme --dry-run

Options:
  --name <name>    New project name or package scope
  --from <name>    Current project name or package scope. Defaults to root package name.
  --dry-run        Show files that would change without writing
  --yes            Skip the confirmation prompt
`);
}

function slugify(value) {
  const normalized = value
    .trim()
    .replace(leadingAtPattern, "")
    .split("/")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized;
}

function displayNameFromSlug(value) {
  return value
    .split(slugSeparatorPattern)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAll(value, search, replacement) {
  return value.replaceAll(search, replacement);
}

function replaceWord(value, search, replacement) {
  return value.replace(
    new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(search)}(?![A-Za-z0-9_])`, "g"),
    replacement
  );
}

function createRenamer(fromSlug, toSlug) {
  const fromDisplay = displayNameFromSlug(fromSlug);
  const toDisplay = displayNameFromSlug(toSlug);
  const fromUpper = fromSlug.toUpperCase().replaceAll("-", "_");
  const toUpper = toSlug.toUpperCase().replaceAll("-", "_");

  return (content) => {
    let next = content;

    next = replaceAll(next, `@${fromSlug}/`, `@${toSlug}/`);
    next = replaceWord(next, fromSlug, toSlug);
    next = replaceWord(next, fromDisplay, toDisplay);
    next = replaceWord(next, fromUpper, toUpper);

    return next;
  };
}

async function getCurrentSlug() {
  if (passedFrom) {
    const fromSlug = slugify(passedFrom);

    if (!fromSlug) {
      throw new Error(
        "The --from value must contain at least one letter or number."
      );
    }

    return fromSlug;
  }

  const rootPackage = JSON.parse(await readFile(rootPackagePath, "utf8"));
  const packageName = String(rootPackage.name ?? "");
  const scopeMatch = packageName.match(scopePackagePattern);

  return slugify(scopeMatch?.[1] ?? packageName);
}

async function getNewSlug() {
  let projectName = passedName;

  if (!projectName && process.stdin.isTTY) {
    intro(pc.cyan("Rename project"));
    projectName = await text({
      message: "New project name",
      placeholder: "acme",
      validate(value) {
        return slugify(value)
          ? undefined
          : "Enter a name with at least one letter or number.";
      },
    });

    if (isCancel(projectName)) {
      cancel("Rename cancelled.");
      process.exit(0);
    }
  }

  const newSlug = slugify(projectName ?? "");

  if (!newSlug) {
    throw new Error(
      "Pass --name when running rename-project non-interactively."
    );
  }

  return newSlug;
}

function isLikelyTextFile(filePath, buffer) {
  const fileName = basename(filePath);

  if (fileName.startsWith(".env") && !fileName.endsWith(".example")) {
    return false;
  }

  if (ignoredExtensions.has(extname(filePath).toLowerCase())) {
    return false;
  }

  return !buffer.includes(0);
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await collectFiles(entryPath)));
      }

      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const metadata = await stat(entryPath);

    if (metadata.size > 5 * 1024 * 1024) {
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

async function renameProject() {
  const fromSlug = await getCurrentSlug();
  const toSlug = await getNewSlug();

  if (fromSlug === toSlug) {
    throw new Error(`Project is already named "${toSlug}".`);
  }

  const fromDisplay = displayNameFromSlug(fromSlug);
  const toDisplay = displayNameFromSlug(toSlug);
  const renameContent = createRenamer(fromSlug, toSlug);
  const files = await collectFiles(root);
  const changes = [];

  for (const filePath of files) {
    const buffer = await readFile(filePath);

    if (!isLikelyTextFile(filePath, buffer)) {
      continue;
    }

    const content = buffer.toString("utf8");
    const renamed = renameContent(content);

    if (renamed !== content) {
      changes.push({ filePath, content: renamed });
    }
  }

  if (changes.length === 0) {
    console.log(pc.yellow(`No references to "${fromSlug}" were found.`));
    return;
  }

  console.log(pc.cyan("Project rename preview"));
  console.log(
    `- package scope: ${pc.bold(`@${fromSlug}/*`)} -> ${pc.bold(`@${toSlug}/*`)}`
  );
  console.log(`- root package: ${pc.bold(fromSlug)} -> ${pc.bold(toSlug)}`);
  console.log(
    `- display name: ${pc.bold(fromDisplay)} -> ${pc.bold(toDisplay)}`
  );
  console.log(`- files: ${pc.bold(String(changes.length))}`);

  for (const change of changes) {
    console.log(`  ${relative(root, change.filePath)}`);
  }

  if (isDryRun) {
    outro(pc.yellow("Dry run complete. No files were changed."));
    return;
  }

  if (!isYes && process.stdin.isTTY) {
    const shouldContinue = await confirm({
      message: "Apply these changes?",
      initialValue: false,
    });

    if (isCancel(shouldContinue) || !shouldContinue) {
      cancel("Rename cancelled.");
      process.exit(0);
    }
  }

  for (const change of changes) {
    await writeFile(change.filePath, change.content);
  }

  outro(pc.green(`Renamed project to "${toSlug}" in ${changes.length} files.`));
}

try {
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
  } else {
    await renameProject();
  }
} catch (error) {
  console.error(pc.red(error instanceof Error ? error.message : String(error)));
  process.exit(1);
}
