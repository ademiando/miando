import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Cursor from "@/components/Cursor";
import Providers from "@/components/Providers";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Ade Miando | Portfolio",
  description: "Interactive portfolio — Ade Miando",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Providers>
            <Header />
            {children}
            <Cursor />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
