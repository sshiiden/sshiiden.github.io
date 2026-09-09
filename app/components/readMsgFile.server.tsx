import matter from "gray-matter";
import fs from "node:fs/promises";
import { marked } from "marked";

export async function parseMarkdown(md: string) {
  marked.use({
    renderer: {
      image({ href, title, text }) {
        const alt = text ? ` alt="${text}"` : "";
        const tit = title ? ` title="${title}"` : "";
        const img = `<img src="${href}"${alt}${tit} loading="lazy" />`;
        const caption = text ? `<figcaption>${text}</figcaption>` : "";
        return `<figure>${img}${caption}</figure>`;
      },
      code({ lang, text }) {
        return `<pre data-lang="${lang ?? "txt"}"><code>${text}</code></pre>`;
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