import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { createElement } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const isClient = typeof document !== "undefined";

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  if (isClient) {
    return createElement("html", {
      suppressHydrationWarning: true,
      // Inject the server-side rendered HTML.
      dangerouslySetInnerHTML: {
        __html: document.getElementsByTagName("html")[0].innerHTML,
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-red-500 mb-4">{error?.message}</p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
