import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { cancel, intro, isCancel, outro, select, text } from "@clack/prompts";
import pc from "picocolors";

const root = resolve(import.meta.dirname, "../..");
const globalsPath = resolve(root, "packages/design-system/styles/globals.css");
const backupsPath = resolve(root, "packages/design-system/styles/backups");
const defaultBackup = "default-globals.css";
const defaultBackupPath = resolve(backupsPath, defaultBackup);
const bundledDefaultPath = resolve(import.meta.dirname, defaultBackup);
const millisecondsPattern = /\.\d{3}Z$/;

const command = process.argv[2] ?? "help";
const commandArguments = process.argv.slice(3);

const nowStamp = () =>
  new Date()
    .toISOString()
    .replace(millisecondsPattern, "")
    .replaceAll(":", "-")
    .replace("T", "_");

const slugify = (value) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "theme";
};

const isCssFile = (fileName) =>
  fileName.endsWith(".css") && !fileName.startsWith(".");

async function getBackups() {
  await mkdir(backupsPath, { recursive: true });
  await ensureDefaultBackup();
  const files = await readdir(backupsPath);
  const backups = await Promise.all(
    files.filter(isCssFile).map(async (fileName) => {
      const filePath = resolve(backupsPath, fileName);
      const metadata = await stat(filePath);

      return {
        fileName,
        filePath,
        modifiedAt: metadata.mtime,
        size: metadata.size,
      };
    })
  );

  return backups.sort((first, second) => {
    if (first.fileName === defaultBackup) {
      return -1;
    }

    if (second.fileName === defaultBackup) {
      return 1;
    }

    return second.modifiedAt.getTime() - first.modifiedAt.getTime();
  });
}

async function ensureDefaultBackup() {
  await mkdir(backupsPath, { recursive: true });

  try {
    await stat(defaultBackupPath);
  } catch {
    await copyFile(bundledDefaultPath, defaultBackupPath);
  }
}

async function backupTheme() {
  await mkdir(dirname(backupsPath), { recursive: true });
  await mkdir(backupsPath, { recursive: true });

  let themeName = commandArguments.join(" ").trim();

  if (!themeName && process.stdin.isTTY) {
    intro(pc.cyan("Theme backup"));
    const answer = await text({
      message: "Backup name",
      placeholder: "pre-tweakcn-blue-theme",
      defaultValue: "theme",
    });

    if (isCancel(answer)) {
      cancel("Backup cancelled.");
      process.exit(0);
    }

    themeName = answer;
  }

  const backupName = `${nowStamp()}-${slugify(themeName || "theme")}.css`;
  const backupPath = resolve(backupsPath, backupName);

  await copyFile(globalsPath, backupPath);

  outro(`${pc.green("Saved theme backup:")} ${pc.bold(backupName)}`);
}

async function listBackups() {
  const backups = await getBackups();

  if (backups.length === 0) {
    console.log(pc.yellow("No theme backups found."));
    return;
  }

  console.log(pc.cyan("Theme backups"));

  for (const backup of backups) {
    const label =
      backup.fileName === defaultBackup
        ? `${backup.fileName} ${pc.dim("(built-in fallback)")}`
        : backup.fileName;
    console.log(`- ${label}`);
  }
}

async function chooseBackup(backups) {
  if (!process.stdin.isTTY) {
    throw new Error(
      "Pass a backup filename when running restore non-interactively."
    );
  }

  intro(pc.cyan("Restore theme"));

  const selected = await select({
    message: "Select a theme backup to restore",
    options: backups.map((backup) => ({
      label:
        backup.fileName === defaultBackup
          ? `${backup.fileName} (built-in fallback)`
          : backup.fileName,
      value: backup.fileName,
      hint: `${Math.ceil(backup.size / 1024)} KB`,
    })),
  });

  if (isCancel(selected)) {
    cancel("Restore cancelled.");
    process.exit(0);
  }

  return selected;
}

async function restoreTheme() {
  const backups = await getBackups();

  if (backups.length === 0) {
    throw new Error("No theme backups found.");
  }

  let backupName = commandArguments.join(" ").trim();

  if (backupName === "--latest") {
    backupName =
      backups.find((backup) => backup.fileName !== defaultBackup)?.fileName ??
      defaultBackup;
  }

  if (!backupName) {
    backupName = await chooseBackup(backups);
  }

  const backup = backups.find(
    (candidate) => candidate.fileName === basename(backupName)
  );

  if (!backup) {
    throw new Error(`Theme backup not found: ${backupName}`);
  }

  await copyFile(backup.filePath, globalsPath);

  outro(`${pc.green("Restored theme from:")} ${pc.bold(backup.fileName)}`);
}

function printHelp() {
  console.log(`Theme manager

Commands:
  bun run theme:backup [name]        Save globals.css as a timestamped backup
  bun run theme:list                 List saved theme backups
  bun run theme:restore [filename]   Restore a selected or named backup
  bun run theme:restore:latest       Restore the newest non-default backup
  bun run theme:restore:default      Restore default-globals.css
`);
}

try {
  if (command === "backup") {
    await backupTheme();
  } else if (command === "list") {
    await listBackups();
  } else if (command === "restore") {
    await restoreTheme();
  } else {
    printHelp();
  }
} catch (error) {
  console.error(pc.red(error instanceof Error ? error.message : String(error)));
  process.exit(1);
}
