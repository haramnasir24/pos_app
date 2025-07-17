import "./globals.css";

import { CartContextProvider } from "../shared/context/CartContext";
import { SessionProviders } from "@/shared/providers/SessionProvider";
import { QueryProvider } from "@/shared/providers/QueryProvider";

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
