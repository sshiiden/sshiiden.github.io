import matter from "gray-matter";
import fs from "node:fs/promises";
import { marked } from "marked";

export async function readMsgFile(slug: string) {
  const raw = await fs.readFile(`app/msgs/${slug}.md`, 'utf8');
  const { data, content } = matter(raw);
  marked.use({
    renderer: {
      image({ href, title, text }) {
        return `<img src="${href}" alt="${text}" title="${title ?? ""}" loading="lazy" />`;
      },
    },
  });
  const content_html = await marked.parse(content);
  return { data, content, content_html };
}