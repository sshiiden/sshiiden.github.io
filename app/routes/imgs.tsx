import type { Route } from "./+types/imgs";
import style from "css/imgs.module.css";
import { MetaTags } from "comps/metatags";
import { Link } from "react-router";
import images from "data/images_data.json";

export default ({ }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <h1>Images</h1>
      <section>
        {images.map(img => {
          const desc = img.description || img.path.replace("/images/", "");
          return (
            <Link key={img.path} to={img.path} target="_blank" title={desc}>
              <img src={img.path} alt={desc} loading="lazy" />
            </Link>
          )
        })}
      </section>
    </main>
  </>
}