import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("blog", "routes/blog.tsx"),
  route("articles/:slug", "routes/articles.tsx"),
  route("imgs", "routes/imgs.tsx"),
];

if (import.meta.env.DEV) {
  routes.push(
    route("dev/imgs-edit", "routes/dev-imgs-edit.tsx"),
  );
}

export default [
  layout("routes/layout.tsx", routes),
] satisfies RouteConfig;