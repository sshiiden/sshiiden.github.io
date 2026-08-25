import type { Route } from "./+types/imgs";
import style from "css/imgs.module.css";
import { MetaTags } from "comps/metatags";
import fs from "node:fs/promises";
import path from "node:path";
import { Link } from "react-router";

export async function walkImageFiles(): Promise<string[]> {
  const dir = "public/images";
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && (entry.name.toLowerCase().endsWith(".png") || entry.name.toLocaleLowerCase().endsWith(".jpg")))
      .map((entry) => path.join(dir, entry.name))
      .sort();
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

export async function loader({ }: Route.LoaderArgs) {
  const files = await walkImageFiles();
  return files.map(file => ({
    src: file.substring("/publi".length),
    name: file.substring("/public/images".length),
  }));
}

export default ({ loaderData }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <h1>Images</h1>
      <section>
        {loaderData.map(img => (
          <Link to={img.src} target="_blank" title={img.name} key={img}>
            <img src={img.src} alt={img.name} loading="lazy" />
          </Link>
        ))}
      </section>
    </main>
  </>
}