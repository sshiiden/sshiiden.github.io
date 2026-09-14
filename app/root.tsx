import type { Route } from "./+types/root";
import "./app.css";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Outlet,
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
        <meta name="theme-color" content="#b0abb9" />
        <link rel="shortcut icon" href="/images/sshiiden.png" type="image/png" />
        <link rel="canonical" href={loaderData.url} />
        <Links />
      </head>
      <body>
        <header>
          <Link to="/">sshiiden</Link>
          <p>The website of Nicholas Santos Shiden (sshiiden)</p>
          <hr />
          <dl>
            <dt>Email:</dt>
            <dd><Link to="mailto:sshiiden@gmail.com">sshiiden@gmail.com</Link></dd>
            <dt>Discord:</dt>
            <dd><Link to="https://discordapp.com/users/sshiiden#0001">@sshiiden</Link></dd>
            <dt>GitHub:</dt>
            <dd><Link to="https://github.com/sshiiden">@sshiiden</Link></dd>
            <dt>Twitter:</dt>
            <dd><Link to="https://x.com/sshiiden">@sshiiden</Link></dd>
          </dl>
          <hr />
        </header>
        <Outlet />
        <footer>
          <small>&gt; Nicholas Santos Shiden (sshiiden)</small>
        </footer>
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
