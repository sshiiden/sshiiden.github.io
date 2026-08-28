import type { Config } from "@react-router/dev/config";
import matter from "gray-matter";
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

async function getTags() {
  const files = await walkMsgsFiles();
  const allTags: { [key: string]: null } = {};

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);
    const tags: string[] = data["tags"] || [];
    tags.forEach(tag => {
      allTags[tag] = null;
    });
  }

  return Object.keys(allTags);
}

export default {
  ssr: true,
  async prerender() {
    const slugs = await getMsgsSlugs();
    const tags = await getTags();
    return [
      "/",
      "/msgs",
      "/msgs/tags",
      ...slugs.map(s => `/msg/${s}`),
      ...tags.map(t => `/msgs/tags/${t}`),
    ];
  },
} satisfies Config;