import "./globals.css";

import { QueryProvider } from "./components/providers/QueryProvider";
// import * as React from "react";
import { SessionProviders } from "./components/providers/SessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviders>
          <QueryProvider> {children}</QueryProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
