import type { Route } from "./+types/home";
import style from "css/home.module.css";
import { MetaTags } from "comps/metatags";
import { walkMsgsFiles } from "../../react-router.config";
import { readMsgFile } from "comps/readMsgFile.server";

export async function loader({ }: Route.LoaderArgs) {
  const files = await walkMsgsFiles();
  const entries: {
    data: { [key: string]: any },
    content: string,
    content_html: string,
    slug: string,
  }[] = [];

  for (const filePath of files) {
    const slug = filePath.replace("app/msgs/", "").replace("app\\msgs\\", "").replace(".md", "");
    const info = await readMsgFile(slug);
    entries.push({
      ...info,
      slug,
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
    <article>
      <hgroup>
        <address>{data.data["author"]}</address> &ndash; <time dateTime={datetime.toISOString()}>{datetimeFormatted}</time>
      </hgroup>
      <section dangerouslySetInnerHTML={{ __html: data.content_html }} />
    </article>
  );
}

export default ({ loaderData }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <ol>
        {loaderData.map(entry => 
          <li key={entry.slug}>
            <Message data={entry} />
          </li>
        )}
      </ol>
    </main>
  </>
}