import type { Route } from "./+types/msg-edit";
import style from "css/msg-edit.module.css";
import { MetaTags } from "comps/metatags";
import { Form, Scripts } from "react-router";
import { readMsgFile } from "./message";
import fs from "node:fs/promises";
import { useRef, useState } from "react";
import { marked } from "marked";

async function walkImageFiles(): Promise<string[]> {
  const dir = "public/images";
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && (entry.name.toLowerCase().endsWith(".png") || entry.name.toLocaleLowerCase().endsWith(".jpg")))
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
  return dateString.slice(0, dateString.lastIndexOf(":"));
}

function stringsToYAMLList(strings: string[]) {
  let list = "";
  strings.forEach(str => {
    if (str.length === 0) return;
    list += `\n  - ${str}`;
  });
  return list;
}

export async function loader({ params }: Route.LoaderArgs) {
  let images = null;
  try {
    images = await walkImageFiles();
  } catch (err) {
  }

  let message;
  try {
    message = params.slug ? await readMsgFile(encodeURIComponent(params.slug)) : null;
  } catch (err) {
    throw new Response(undefined, { status: 404, statusText: "Message not found" })
  }

  return { message, images, existingTags: ["minecraft", "bta"] };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const date = getNowISOdatetime();
  const slug = encodeURIComponent((formData.get("slug") as string) || date);
  const author = formData.get("author") as string;
  const tags = stringsToYAMLList(formData.getAll("tags") as string[]);
  const message = formData.get("message") as string;

  const content = `---\nauthor: ${author}\ndate: ${date}\ntags: ${tags}\n---\n${message}`;

  await fs.writeFile(`app/msgs/${slug}.md`, content);

  return new Response(null, { status: 302, headers: { Location: "/msgs" } });
}

export default ({ loaderData, params }: Route.ComponentProps) => {
  const author: string = loaderData?.message?.data["author"] ?? "sshiiden";
  const message = loaderData?.message?.content ?? "";

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddImage = (path: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value += `\n![](/images/${encodeURIComponent(path)})`;
    setHtmlPreview(marked(textarea.value));
  }

  const [htmlPreview, setHtmlPreview] = useState(marked(message));
  const [tags, setTags] = useState<string[]>(loaderData?.message?.data["tags"] ?? []);

  return <>
    <MetaTags />
    <Scripts />
    <main className={style["main"]}>
      <Form method="POST">
        <button type="submit" hidden disabled />
        <label>
          <small>Slug</small>
          <input
            name="slug"
            placeholder="whatever the datetime is..."
            defaultValue={params.slug}
            readOnly={params.slug !== undefined}
          />
        </label>
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
            type="search"
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
          <button
            type="button"
            popoverTarget="image-dialog"
            popoverTargetAction="show"
          >
            + img
          </button>
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
        <ul>
          {loaderData.images?.map(image => (
            <li key={image}>
              <button
                type="button"
                onClick={() => handleAddImage(image)}
                popoverTarget="image-dialog"
                popoverTargetAction="hide"
              >
                <img src={`/images/${image}`} />
                <span>{image}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </dialog>
  </>
}