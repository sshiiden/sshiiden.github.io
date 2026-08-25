import type { Route } from "./+types/home";
import style from "css/home.module.css";
import { MetaTags } from "comps/metatags";
import { Link, type To } from "react-router";

function LinkItem({
  url,
  label,
  pre,
  img,
}: {
  url: To,
  label: string,
  pre?: string,
  img?: string,
}) {
  return (
    <li>
      {img && <img src={img} alt="" />}
      {pre ?? ""}<Link to={url}>{label}</Link>
    </li>
  )
}

export default ({ }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <img src="/images/Senzanome3.jpg" alt="Senzanome3" />
      <section>
        <h1>Nicholas Santos Shiden (sshiiden)</h1>
        <p>
          Software engineer specializing in web development & UI/UX.<br />
          Building and maintaining games with
          the <Link to="https://blazium.app">
            Blazium Game Engine
          </Link> at <Link to="https://github.com/blazium-games">
            Blazium Games
          </Link>.
        </p>
        <h2>Contacts</h2>
        <ul>
          <LinkItem
            pre="Email: "
            label="santos.shiden.nicholas@gmail.com"
            url="mailto:santos.shiden.nicholas@gmail.com"
          />
          <LinkItem
            pre="GitHub: "
            label="@sshiiden"
            url="https://github.com/sshiiden"
          />
          <LinkItem
            pre="Linkedin: "
            label="in/nicholas-santos-shiden"
            url="https://www.linkedin.com/in/nicholas-santos-shiden/"
          />
        </ul>
        <h2>Works</h2>
        <ul>
          <LinkItem
            label="blazium.app"
            url="https://blazium.app"
            img="https://blazium.app/static/assets/favicon.ico"
          />
          <LinkItem
            label="blazium.games"
            url="https://blazium.games"
            img="https://blazium.games/favicon.ico"
          />
          <LinkItem
            label="diagame.io"
            url="https://diagame.io"
            img="https://diagame.io/favicon.ico"
          />
          <LinkItem
            label="dddbrowser.online"
            url="https://dddbrowser.online"
            img="https://dddbrowser.online/favicon.ico"
          />
        </ul>
      </section>
    </main>
  </>
}