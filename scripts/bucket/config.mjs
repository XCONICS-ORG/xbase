import { readFile, writeFile } from "node:fs/promises";
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
const envPath = resolve(root, "env/.env");
const providerArg = process.argv[2];
const providers = new Set(["linode", "s3", "minio"]);

const providerDefaults = {
  linode: {
    BUCKET_PROVIDER: "linode",
    BUCKET_REGION: "in-maa-1",
  },
  s3: {
    BUCKET_ENDPOINT: "https://s3.amazonaws.com",
    BUCKET_PROVIDER: "s3",
    BUCKET_REGION: "us-east-1",
  },
  minio: {
    BUCKET_ENDPOINT: "http://localhost:9000",
    BUCKET_PROVIDER: "minio",
    BUCKET_PROXY_SIGNED_URLS: "true",
    BUCKET_REGION: "us-east-1",
  },
};

const managedEnvKeys = new Set([
  "BUCKET_ACCESS_KEY_ID",
  "BUCKET_ENDPOINT",
  "BUCKET_NAME",
  "BUCKET_PROVIDER",
  "BUCKET_PROXY_SIGNED_URLS",
  "BUCKET_PUBLIC_BASE_URL",
  "BUCKET_REGION",
  "BUCKET_SECRET_ACCESS_KEY",
]);

const lineBreakPattern = /\r?\n/;
const envAssignmentPattern = /^([A-Z0-9_]+)=(.*)$/;
const envKeyPattern = /^([A-Z0-9_]+)=/;
const bucketCommentPattern = /^# Bucket storage\.|^# BUCKET_PROVIDER can be /;

const parseEnv = (content) => {
  const values = new Map();

  for (const line of content.split(lineBreakPattern)) {
    const match = line.match(envAssignmentPattern);

    if (match) {
      values.set(match[1], match[2]);
    }
  }

  return values;
};

const upsertEnv = (content, updates) => {
  const lines = content.split(lineBreakPattern).filter((line) => {
    const match = line.match(envKeyPattern);

    if (match && managedEnvKeys.has(match[1])) {
      return false;
    }

    return !bucketCommentPattern.test(line);
  });

  while (lines.at(-1) === "") {
    lines.pop();
  }

  lines.push("");
  lines.push("# Bucket storage.");
  lines.push("# BUCKET_PROVIDER can be linode, s3, or minio.");

  for (const key of Object.keys(updates)) {
    lines.push(`${key}=${updates[key] ?? ""}`);
  }

  return `${lines.join("\n").replace(/\n+$/g, "")}\n`;
};

const stopIfCancel = (value) => {
  if (isCancel(value)) {
    cancel("Bucket config was not changed.");
    process.exit(0);
  }

  return value;
};

async function main() {
  intro("Bucket storage setup");

  const content = await readFile(envPath, "utf8").catch(() => "");
  const current = parseEnv(content);
  const selectedProvider = providers.has(providerArg)
    ? providerArg
    : stopIfCancel(
        await select({
          message: "Select bucket storage provider",
          options: [
            { label: "Linode Object Storage", value: "linode" },
            { label: "AWS S3 compatible", value: "s3" },
            { label: "MinIO", value: "minio" },
          ],
        })
      );
  const defaults = providerDefaults[selectedProvider];
  const shouldEditValues =
    providerArg && providers.has(providerArg)
      ? false
      : stopIfCancel(
          await confirm({
            initialValue: false,
            message: "Edit bucket credentials now?",
          })
        );

  const updates = {
    ...defaults,
    BUCKET_ACCESS_KEY_ID:
      current.get("BUCKET_ACCESS_KEY_ID") || "replace-with-bucket-access-key",
    BUCKET_NAME: current.get("BUCKET_NAME") || "replace-with-bucket-name",
    BUCKET_SECRET_ACCESS_KEY:
      current.get("BUCKET_SECRET_ACCESS_KEY") ||
      "replace-with-bucket-secret-key",
  };

  if (shouldEditValues) {
    updates.BUCKET_REGION = stopIfCancel(
      await text({
        defaultValue: updates.BUCKET_REGION,
        message: "Region",
        placeholder: updates.BUCKET_REGION,
      })
    );
    updates.BUCKET_NAME = stopIfCancel(
      await text({
        defaultValue: updates.BUCKET_NAME,
        message: "Bucket name",
        placeholder: updates.BUCKET_NAME,
      })
    );
    updates.BUCKET_ACCESS_KEY_ID = stopIfCancel(
      await text({
        defaultValue: updates.BUCKET_ACCESS_KEY_ID,
        message: "Access key",
        placeholder: updates.BUCKET_ACCESS_KEY_ID,
      })
    );
    updates.BUCKET_SECRET_ACCESS_KEY = stopIfCancel(
      await text({
        defaultValue: updates.BUCKET_SECRET_ACCESS_KEY,
        message: "Secret key",
        placeholder: "secret",
      })
    );

    if (selectedProvider !== "linode") {
      updates.BUCKET_ENDPOINT = stopIfCancel(
        await text({
          defaultValue: updates.BUCKET_ENDPOINT,
          message: "S3-compatible endpoint",
          placeholder: updates.BUCKET_ENDPOINT,
        })
      );
    }
  }

  await writeFile(envPath, upsertEnv(content, updates));

  outro(
    `${pc.green("Updated")} env/.env for ${pc.cyan(selectedProvider)} bucket storage.`
  );
}

main().catch((error) => {
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
