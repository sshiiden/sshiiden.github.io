import type { Route } from "./+types/layout";
import style from "css/layout.module.css";
import { Link, NavLink, Outlet } from "react-router";

export default ({ }: Route.ComponentProps) => {
  return <>
    <header className={style["header"]}>
      <Link to="/">
        <img src="/images/sshiiden.png" alt="sshiiden" width="42" height="30" />
      </Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="blog">Blog</NavLink>
        <NavLink to="imgs">Imgs</NavLink>
      </nav>
      {import.meta.env.DEV && (
        <nav style={{
          "marginLeft": "auto",
          "borderInline": "8px solid red",
        }}>
          <NavLink to="/dev/imgs-edit">EDIT_IMGS</NavLink>
        </nav>
      )}
    </header>
    <Outlet />
    <footer className={style["footer"]}>
      <small>&gt; Nicholas Santos Shiden (sshiiden)</small>
    </footer>
  </>
}