import "./globals.css";
// import * as React from "react";

import { QueryProvider } from "./components/providers/QueryProvider";
import { SessionProviders } from "./components/providers/SessionProvider";
import { CartContextProvider } from "./context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartContextProvider>
          <SessionProviders>
            <QueryProvider> {children}</QueryProvider>
          </SessionProviders>
        </CartContextProvider>
      </body>
    </html>
  );
}
