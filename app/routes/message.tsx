import type { Route } from "./+types/message";
import style from "css/msgs.module.css";
import { MetaTags } from "comps/metatags";
import { readMsgFile } from "comps/readMsgFile.server";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return await readMsgFile(params.slug);
  } catch(err) {
    throw new Response(undefined, {status: 404, statusText: "Message not found"})
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
    <main
      className={style["main"]}
      dangerouslySetInnerHTML={{__html: loaderData.content_html}}
    />
  </>
}