// app/layout.tsx
import type { Metadata } from "next";
 import "./globals.css";
import { DirectionProvider } from "@/providers/DirectionProvider";

export const metadata: Metadata = {
  title: "Tarvix | Architecture-First Engineering Studio",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}
