import type { Route } from "./+types/home";
import style from "css/home.module.css";
import { MetaTags } from "comps/metatags";
import { Link, type To } from "react-router";

function LinkItem({pre, url, label}: {pre?: string, url: To, label: string}) {
  return (<li>{pre ?? ""}<Link to={url}>{label}</Link></li>)
}

export default ({ }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <h1>Nicholas Santos Shiden</h1>
      <p>Web Developer.</p>
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
        />
        <LinkItem
          label="blazium.games"
          url="https://blazium.games"
        />
        <LinkItem
          label="dddbrowser.online"
          url="https://dddbrowser.online"
        />
        <LinkItem
          label="rune.shoyo.work"
          url="https://rune.shoyo.work"
        />
      </ul>
    </main>
  </>
}