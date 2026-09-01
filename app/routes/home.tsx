import type { Route } from "./+types/home";
import style from "css/home.module.css";
import { MetaTags } from "comps/metatags";
import { Link, type To } from "react-router";

export default ({ }: Route.ComponentProps) => {
  return <>
    <MetaTags />
    <main className={style["main"]}>
      <img src="/images/Senzanome3.jpg" alt="Senzanome3" />
      <section>
        <h1>Nicholas Santos Shiden</h1>
        <p>Also known as sshiiden.</p>
        <h2>Contacts</h2>
        <dl>
          <dt>Email:</dt>
          <dd><Link to="mailto:santos.shiden.nicholas@gmail.com">santos.shiden.nicholas@gmail.com</Link></dd>
          <dt>Discord:</dt>
          <dd><Link to="https://discordapp.com/users/sshiiden#0001">@sshiiden</Link></dd>
          <dt>GitHub:</dt>
          <dd><Link to="https://github.com/sshiiden">@sshiiden</Link></dd>
          <dt>Twitter:</dt>
          <dd><Link to="https://x.com/sshiiden">@sshiiden</Link></dd>
        </dl>
      </section>
    </main>
  </>
}