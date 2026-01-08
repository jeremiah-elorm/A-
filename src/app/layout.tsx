import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A++ | Practice First",
  description: "Anonymous-first BECE/WASSCE practice with real past questions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
