import type { Config } from "@react-router/dev/config";
import fs from "node:fs/promises";
import path from "node:path";

export async function walkMsgsFiles(): Promise<string[]> {
  const dir = "app/msgs";
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      .map((entry) => path.join(dir, entry.name))
      .sort();
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function getMsgsSlugs() {
  const files = await walkMsgsFiles();
  const slugs: string[] = [];

  for (const filePath of files) {
    slugs.push(filePath.replace("app/msgs/", "").replace(".md", ""));
  }

  return slugs;
}

export default {
  ssr: true,
  async prerender() {
    const slugs = await getMsgsSlugs();
    return [
      "/",
      "/msgs",
      ...slugs.map((s) => `/msg/${s}`),
    ];
  },
} satisfies Config;