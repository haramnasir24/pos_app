import "./globals.css";

import { CartContextProvider } from "../context/CartContext";
import { SessionProviders } from "@/components/providers/SessionProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

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
