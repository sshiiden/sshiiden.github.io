import type { Config } from "@react-router/dev/config";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

export async function walkArticlesFiles(): Promise<string[]> {
  const dir = "app/articles";
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

async function getArticlesSlugs() {
  const files = await walkArticlesFiles();
  const articlesSlugs: string[] = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);
    articlesSlugs.push(data["slug"]);
  }

  return articlesSlugs;
}

export default {
  ssr: true,
  async prerender() {
    const articlesSlugs = await getArticlesSlugs();
    return [
      "/",
      "/blog",
      "/imgs",
      ...articlesSlugs.map((s) => `/articles/${s}`),
    ];
  },
} satisfies Config;