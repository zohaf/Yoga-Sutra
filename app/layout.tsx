import "../styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Yoga Sutra of Patanjali",
  description:
    "The Yoga-Sûtra of Patanjali: English translation, Sanskrit and word-by-word meanings for each verse.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
