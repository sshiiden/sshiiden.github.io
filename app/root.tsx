import type { Route } from "./+types/root";
import "./app.css";
import {
  isRouteErrorResponse,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { isbot } from "isbot";

export default ({ loaderData }: Route.ComponentProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Nicholas Santos Shiden" />
        <meta name="robots" content="index, follow" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="application-name" content="sshiiden.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="sshiiden.dev" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={loaderData.url} />
        <meta name="twitter:url" content={loaderData.url} />
        <meta name="twitter:creator" content="" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="shortcut icon" href="/images/sshiiden.png" type="image/png" />
        <link rel="canonical" href={loaderData.url} />
        <Links />
      </head>
      <body>
        <Outlet />
        {/* <ScrollRestoration />
        <Scripts /> */}
      </body>
    </html>
  );
}

export function loader({ request, context }: Route.LoaderArgs) {
  return {
    isBot: isbot(request.headers.get("user-agent")),
    url: "https://sshiiden.github.io",
    context: context,
  };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    const isNotFound = error.status === 404;
    return (
      <main id="error-container">
        <h2>
          {isNotFound ? "Page not found" : "Error"}
        </h2>
        <p>{
          isNotFound ?
            "The page you're looking for has been deleted, or never existed in the first place." :
            error.statusText || "An unexpected error occurred."
        }</p>
      </main>
    );
  } else if (error && error instanceof Error) {
    return (<>
      {error.stack && (
        <pre>
          <code>{error.stack}</code>
        </pre>
      )}
    </>);
  }
}
