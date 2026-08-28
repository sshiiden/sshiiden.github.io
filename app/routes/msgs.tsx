import type { Route } from "./+types/msgs";
import style from "css/msgs.module.css";
import { MetaTags } from "comps/metatags";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { Link } from "react-router";
import { walkMsgsFiles } from "../../react-router.config";
import { marked } from "marked";

export async function loader({ params }: Route.LoaderArgs) {
  const files = await walkMsgsFiles();
  const entries: {
    data: { [key: string]: any },
    content: string,
    content_html: string,
    slug: string,
  }[] = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    if (params.tag && !data["tags"].includes(params.tag)) continue;

    marked.use({
      renderer: {
        image({ href, title, text }) {
          return `<img src="${href}" alt="${text}" title="${title ?? ""}" loading="lazy" />`;
        },
      },
    });
    const content_html = await marked(content);

    entries.push({
      data,
      content,
      content_html,
      slug: filePath.replace("app/msgs/", "").replace(".md", ""),
    });
  }

  return entries.sort((a, b) => {
    return new Date(b.data["date"]).getTime() - new Date(a.data["date"]).getTime();
  });
}

function Message({ data }: { data: Route.ComponentProps["loaderData"][number] }) {
  const datetime = new Date(data.data["date"]);
  const datetimeFormatted = datetime.toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <li>
      <section>
        <div>
          <span>{data.data["author"]} &ndash; <time dateTime={datetime.toISOString()}>{datetimeFormatted}</time></span>
          <span>tags: {data.data["tags"]?.toString()}</span>
        </div>
        <Link to={`/msg/${data["slug"]}`} className="button">Open</Link>
        {import.meta.env.DEV &&
          <>
            <Link to={`/msg-edit/${data["slug"]}`} className="button dev">Edit</Link>
            <Link to={`/msg-edit?replyto=${data["slug"]}`} className="button dev">Reply</Link>
          </>
        }
      </section>
      <article dangerouslySetInnerHTML={{ __html: data.content_html }} />
    </li>
  );
}

export default ({ loaderData, params }: Route.ComponentProps) => {
  return <>
    <MetaTags
      title={`All Messages${params.tag ? ` (tagged ${params.tag})` : ""}`}
      description={`All messages${params.tag ? ` tagged ${params.tag}` : ""}.`}
      keywords={params.tag ?? "all"}
    />
    <main className={style["main"]}>
      <h1>All Messages{params.tag && ` (tagged ${params.tag})`}</h1>
      <section>
        <Link to="/msgs/tags" className="button">All Tags</Link>
        {import.meta.env.DEV &&
          <Link to={`/msg-edit`} className="button dev">New Message</Link>
        }
      </section>
      <ol>{loaderData.map(entry => <Message key={entry.slug} data={entry} />)}</ol>
    </main>
  </>
}