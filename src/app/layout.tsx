import "./globals.css";
// import * as React from "react";
import { SessionProviders } from "./components/providers/SessionProvider";
import { QueryProvider } from "./components/providers/QueryProvider";

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
