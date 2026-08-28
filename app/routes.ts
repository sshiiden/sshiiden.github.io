import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("/msgs", "routes/msgs.tsx"),
  route("/msg/:slug", "routes/message.tsx"),
];

if (import.meta.env.DEV) {
  routes.push(
    route("/msg-edit", "routes/msg-edit.tsx", { id: "new-msg" }),
    route("/msg-edit/:slug", "routes/msg-edit.tsx", { id: "edit-msg" }),
  );
}

export default [
  layout("routes/layout.tsx", routes),
] satisfies RouteConfig;