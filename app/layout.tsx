import "../styles/globals.css";
import "@fontsource/ibm-plex-sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Yoga Sutra of Patanjali",
  description: "yogaSutra",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
