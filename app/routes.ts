import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("blog", "routes/blog.tsx"),
    route("articles/:slug", "routes/articles.tsx"),
    route("imgs", "routes/imgs.tsx"),
  ]),
] satisfies RouteConfig;