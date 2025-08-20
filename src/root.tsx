import { StrictMode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { Chatbot } from "./components/chatbot";
import { ThemeProvider } from "./providers/theme-provider";
import "./index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FullStock | Inicio</title>
        <link rel="icon" type="image/svg+xml" href="/fullstock.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <StrictMode>
      <ThemeProvider storageKey="fullstock-ui-theme">
        <Outlet />
        <Chatbot />
      </ThemeProvider>
    </StrictMode>
  );
}
