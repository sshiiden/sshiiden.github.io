import matter from "gray-matter";
import fs from "node:fs/promises";
import { marked } from "marked";

export async function parseMarkdown(md: string) {
  marked.use({
    renderer: {
      image({ href, title, text }) {
        const img = `<img src="${href}" alt="${text}" title="${title ?? ""}" loading="lazy" />`;
        return `<figure>${img}<figcaption>${text}</figcaption></figure>`;
      },
      code({ lang, text }) {
        return `<pre data-lang="${lang}"><code>${text}</code></pre>`;
      },
    },
  });
  const html = await marked(md);
  return html;
}

export async function readMsgFile(slug: string) {
  const raw = await fs.readFile(`app/msgs/${slug}.md`, 'utf8');
  const { data, content } = matter(raw);
  const content_html = await parseMarkdown(content);
  return { data, content, content_html };
}