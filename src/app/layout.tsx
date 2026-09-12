import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECHOES OF MEMORY - Cinematic Story Game",
  description: "A cinematic story-driven adventure game about memory, loss, and redemption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
