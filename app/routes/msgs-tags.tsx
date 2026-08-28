import type { Route } from "./+types/msgs-tags";
import style from "css/msgs.module.css";
import { MetaTags } from "comps/metatags";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { walkMsgsFiles } from "../../react-router.config";
import { Link } from "react-router";

export async function loader({ }: Route.LoaderArgs) {
  const files = await walkMsgsFiles();
  const tagCounts: { [key: string]: number } = {};

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);
    const tags: string[] = data["tags"] || [];
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }

  const orderedTagCounts: { [key: string]: number } = {};
  Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .forEach(([tag, count]) => {
      orderedTagCounts[tag] = count;
    });

  return {
    total: files.length,
    tags: orderedTagCounts,
  };
}

export default ({ loaderData }: Route.ComponentProps) => {
  return <>
    <MetaTags
      title="Messages Tags"
      description="Index of all messages tags."
    />
    <main className={style["main-tags-list"]}>
      <h1>Messages Tags</h1>
      <ol>
        <li>
          <Link to="/msgs" className="button">All Messages ({loaderData.total}) </Link>
        </li>
        {Object.entries(loaderData.tags).map(([tag, count]) => (
          <li key={tag}>
            <Link to={`/msgs/tags/${tag}`} className="button">{tag} ({count}) </Link>
          </li>
        ))}
      </ol>
    </main>
  </>
}