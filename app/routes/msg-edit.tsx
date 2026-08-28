import type { Route } from "./+types/msg-edit";
import style from "css/msg-edit.module.css";
import { MetaTags } from "comps/metatags";
import { Form, Scripts } from "react-router";
import fs from "node:fs/promises";
import { useRef, useState } from "react";
import { marked } from "marked";
import { readMsgFile } from "~/components/readMsgFile.server";

async function walkImageFiles(): Promise<string[]> {
  const dir = "public/images";
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => {
        if (!entry.isFile()) return false;
        const fileName = entry.name.toLowerCase();
        return (
          fileName.endsWith(".png")
          || fileName.endsWith(".jpg")
          || fileName.endsWith(".gif")
          || fileName.endsWith(".webp")
        )
      })
      .map((entry) => entry.name)
      .sort();
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

function getNowISOdatetime() {
  const dateString = new Date().toISOString();
  return dateString.slice(0, dateString.lastIndexOf("."));
}

function stringsToYAMLList(strings: string[]) {
  let list = "";
  strings.forEach(str => {
    if (str.length === 0) return;
    list += `\n  - ${str}`;
  });
  return list;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  let images = null;
  try {
    images = await walkImageFiles();
  } catch (err) {
  }

  let message;
  try {
    message = params.slug ? await readMsgFile(params.slug) : null;
  } catch (err) {
    throw new Response(undefined, { status: 404, statusText: "Message not found" })
  }

  const searchParams = new URL(request.url).searchParams
  let reply;
  if (params.slug === undefined && searchParams.has("replyto")) {
    const replyto = searchParams.get("replyto");
    reply = `>RE: [${replyto}](/msg/${replyto})\n\n`;
  }

  return {
    message,
    images,
    reply,
    existingTags: ["minecraft", "bta"],
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const date = (formData.get("date") as string) || getNowISOdatetime();
  const slug = params.slug ?? date.replace("T", "_").replaceAll(":", "");
  const author = formData.get("author") as string;
  const tags = stringsToYAMLList(formData.getAll("tags") as string[]);
  const message = formData.get("message") as string;

  const content = `---\nauthor: ${author}\ndate: ${date}\ntags: ${tags}\n---\n${message}`;

  await fs.writeFile(`app/msgs/${slug}.md`, content);

  return new Response(null, { status: 302, headers: { Location: "/msgs" } });
}

export default ({ loaderData, params }: Route.ComponentProps) => {
  const author: string = loaderData.message?.data["author"] ?? "sshiiden";
  const message = loaderData.message?.content ?? loaderData.reply ?? "";

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddImage = async (path: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value += `\n![](/images/${encodeURIComponent(path)})`;
    setHtmlPreview(await marked(textarea.value));
  }

  const [htmlPreview, setHtmlPreview] = useState(loaderData.message?.content_html ?? "");
  const [tags, setTags] = useState<string[]>(loaderData.message?.data["tags"] ?? []);

  return <>
    <MetaTags />
    <Scripts />
    <main className={style["main"]}>
      <Form method="POST">
        <button type="submit" hidden disabled />
        <input type="text" name="date" defaultValue={loaderData.message?.data["date"]} hidden />
        <label>
          <small>Author</small>
          <input
            type="text"
            name="author"
            defaultValue={author}
            required
          />
        </label>
        <label htmlFor="tags">
          <small>Tags</small>
          <input
            type="text"
            placeholder="Search for or add a tag..."
            list="tags-datalist"
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.currentTarget.value.length === 0) return;
              setTags([...tags, e.currentTarget.value.toLowerCase()]);
              e.currentTarget.value = "";
            }}
          />
          <datalist id="tags-datalist">
            {loaderData.existingTags.map(tag => <option key={tag} value={tag} />)}
          </datalist>
          <ul>
            {tags.map(tag => (
              <li key={tag}>
                {tag}
                <input name="tags" id="tags" defaultValue={tag} hidden />
                <button
                  type="button"
                  onClick={() => {setTags(tags.filter(t => t !== tag))}}
                >X</button>
              </li>
            ))}
          </ul>
        </label>
        <label htmlFor="message">
          <small>Message</small>
          <menu type="toolbar">
            <button
              type="button"
              popoverTarget="image-dialog"
              popoverTargetAction="show"
            >
              + img
            </button>
          </menu>
          <textarea
            ref={textareaRef}
            id="message"
            name="message"
            placeholder={`# Header\nI like this image i found...`}
            defaultValue={message}
            onChange={async (e) => { setHtmlPreview(await marked(e.currentTarget.value)) }}
            required
          />
        </label>
        <button type="submit">{params.slug ? "Update" : "Send"}</button>
      </Form>
      <aside dangerouslySetInnerHTML={{ __html: htmlPreview }} />
    </main>
    <dialog
      popover="auto"
      id="image-dialog"
      className={style["dialog-image"]}
    >
      <button
        type="button"
        popoverTarget="image-dialog"
        popoverTargetAction="hide"
      >
        Close
      </button>
      <section>
        <menu type="context">
          {loaderData.images?.map(image => (
            <li key={image}>
              <button
                type="button"
                onClick={() => handleAddImage(image)}
                popoverTarget="image-dialog"
                popoverTargetAction="hide"
              >
                <img src={`/images/${image}`} />
                <small>{image}</small>
              </button>
            </li>
          ))}
        </menu>
      </section>
    </dialog>
  </>
}