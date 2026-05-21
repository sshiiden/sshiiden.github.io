import type { Route } from "./+types/blog";
import style from "css/blog.module.css";
import { MetaTags } from "comps/metatags";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { Link } from "react-router";
import { walkArticlesFiles } from "../../react-router.config";

export async function loader({ }: Route.LoaderArgs) {
  const files = await walkArticlesFiles();
  const articlesEntries: Record<string, any>[] = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);
    articlesEntries.push(data);
  }

  return articlesEntries;
}

export default ({ loaderData }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <h1>Blog</h1>
      <ul>
        {loaderData.map((article) => (
          <li key={article["slug"]}>
            <Link to={`/articles/${article["slug"]}`}>{article["title"]}</Link>
          </li>
        ))}
      </ul>
    </main>
  </>
}