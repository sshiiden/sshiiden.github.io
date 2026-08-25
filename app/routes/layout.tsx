import type { Route } from "./+types/layout";
import style from "css/layout.module.css";
import { Link, NavLink, Outlet } from "react-router";

export default ({ }: Route.ComponentProps) => {
  return <>
    <header className={style["header"]}>
      <Link to="/">
        <img src="/images/sshiiden.png" alt="sshiiden" />
      </Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="blog">Blog</NavLink>
        <NavLink to="imgs">Imgs</NavLink>
      </nav>
    </header>
    <Outlet />
  </>
}