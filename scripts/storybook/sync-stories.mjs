import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, relative, resolve } from "node:path";
import pc from "picocolors";

const root = resolve(import.meta.dirname, "../..");
const componentsDirectory = resolve(root, "packages/design-system/components");
const storiesDirectory = resolve(root, "apps/storybook/stories");
const args = process.argv.slice(2);
const declarationPattern = /(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/;
const explicitExportPattern = /export\s*{\s*([A-Z][A-Za-z0-9_]*)/;
const exportedDeclarationPattern =
  /export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/;
const extensionPattern = /\.tsx$/;
const pascalSeparatorPattern = /[-_.\s]+/;
const manualStoryDirectories = new Set(["modules", "shared"]);
const manualStoryComponents = new Set(["mode-toggle.tsx"]);

function printHelp() {
  console.log(`Storybook story sync

Commands:
  bun run storybook:sync
  node scripts/storybook/sync-stories.mjs sync

Options:
  --help    Show this help text.
`);
}

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

function toPascalCase(value) {
  return value
    .split(pascalSeparatorPattern)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function collectComponents(directory = componentsDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      components.push(...(await collectComponents(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      components.push(entryPath);
    }
  }

  return components.sort((left, right) => left.localeCompare(right));
}

function getStoryGroup(componentPath) {
  const relativePath = relative(componentsDirectory, componentPath);

  if (relativePath.startsWith("ui/")) {
    return {
      directory: "ui",
      titlePrefix: "UI",
    };
  }

  return {
    directory: "actions",
    titlePrefix: "Actions",
  };
}

function shouldCreateStory(componentPath) {
  const relativePath = relative(componentsDirectory, componentPath);
  const [topDirectory] = relativePath.split("/");

  return (
    !manualStoryDirectories.has(topDirectory) &&
    !manualStoryComponents.has(relativePath)
  );
}

function getExportName(componentPath, content) {
  const explicitExport = content.match(explicitExportPattern);

  if (explicitExport?.[1]) {
    return explicitExport[1];
  }

  const exportedDeclaration = content.match(exportedDeclarationPattern);

  if (exportedDeclaration?.[1]) {
    return exportedDeclaration[1];
  }

  const declaration = content.match(declarationPattern);

  return declaration?.[1] ?? toPascalCase(basename(componentPath, ".tsx"));
}

function getImportPath(componentPath) {
  const relativePath = relative(componentsDirectory, componentPath).replace(
    extensionPattern,
    ""
  );

  return `@xbase/design-system/components/${relativePath}`;
}

function createStory({ componentName, importPath, title }) {
  return `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "${importPath}";

const meta: Meta<typeof ${componentName}> = {
  title: "${title}",
  component: ${componentName},
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
}

async function syncStories() {
  const components = await collectComponents();
  const created = [];

  for (const componentPath of components) {
    if (!shouldCreateStory(componentPath)) {
      continue;
    }

    const componentSlug = basename(componentPath, ".tsx");
    const content = await readFile(componentPath, "utf8");
    const componentName = getExportName(componentPath, content);
    const group = getStoryGroup(componentPath);
    const storyPath = resolve(
      storiesDirectory,
      group.directory,
      `${componentSlug}.stories.tsx`
    );

    if (await pathExists(storyPath)) {
      continue;
    }

    await mkdir(resolve(storiesDirectory, group.directory), {
      recursive: true,
    });

    await writeFile(
      storyPath,
      createStory({
        componentName,
        importPath: getImportPath(componentPath),
        title: `${group.titlePrefix}/${componentName}`,
      })
    );
    created.push(relative(root, storyPath));
  }

  if (created.length === 0) {
    console.log(pc.dim("Storybook stories are already in sync."));
    return;
  }

  console.log(pc.green("Created Storybook stories:"));

  for (const storyPath of created) {
    console.log(`- ${storyPath}`);
  }
}

syncStories().catch((error) => {
  console.error(pc.red(error instanceof Error ? error.message : String(error)));
  process.exit(1);
});
