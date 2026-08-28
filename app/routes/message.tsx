import type { Route } from "./+types/message";
import style from "css/msgs.module.css";
import { MetaTags } from "comps/metatags";
import matter from "gray-matter";
import fs from "node:fs/promises";
import { marked } from "marked";

export async function readMsgFile(slug: string) {
  const raw = await fs.readFile(`app/msgs/${slug}.md`, 'utf8');
  const { data, content } = matter(raw);
  const content_html = await marked.parse(content);
  return { data, content, content_html };
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return await readMsgFile(encodeURIComponent(params.slug));
  } catch(err) {
    throw new Response(undefined, {status: 404, statusText: "Message not found"})
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