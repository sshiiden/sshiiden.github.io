import type { Route } from "./+types/articles";
import style from "css/articles.module.css";
import { MetaTags } from "comps/metatags";
import matter from "gray-matter";
import fs from "node:fs/promises";
import { marked } from "marked";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const raw = await fs.readFile(`app/articles/${params.slug}.md`, 'utf8');
    const { data, content } = matter(raw);
    const content_html = await marked.parse(content);
    return { data, content, content_html };
  } catch(err) {
    throw new Response(undefined, {status: 404, statusText: "Article not found"})
  }
}

export default ({ loaderData }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main
      className={style["main"]}
      dangerouslySetInnerHTML={{__html: loaderData.content_html}}
    />
  </>
}