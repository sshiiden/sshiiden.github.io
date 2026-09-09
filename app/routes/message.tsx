import type { Route } from "./+types/message";
import style from "css/msgs.module.css";
import { MetaTags } from "comps/metatags";
import { readMsgFile } from "comps/readMsgFile.server";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return await readMsgFile(params.slug);
  } catch (err) {
    throw new Response(undefined, { status: 404, statusText: "Message not found" })
  }
}

export default ({ loaderData }: Route.ComponentProps) => {
  const datetime = new Date(loaderData.data["date"]);
  const datetimeFormatted = datetime.toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return <>
    <MetaTags
      title={`${loaderData.data["author"]} - ${datetimeFormatted}`}
      description={loaderData.content.substring(0, 150)}
      keywords={loaderData.data["tags"]?.join(", ")}
    />
    <main className={style["message-entry"]}>
      <section>
        <div>
          <span>{loaderData.data["author"]} &ndash; <time dateTime={datetime.toISOString()}>{datetimeFormatted}</time></span>
          <span>tags: {loaderData.data["tags"]?.join(", ")}</span>
        </div>
      </section>
      <article dangerouslySetInnerHTML={{ __html: loaderData.content_html }} />
    </main>
  </>
}