import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import { satoshi } from "./fonts/satoshi";
import "./globals.css";

// Italic display serif for "before they count." (closest open match to the design).
const newsreader = Newsreader({
  variable: "--font-newsreader",
  style: "italic",
  axes: ["opsz"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "the round", template: "%s · the round" },
  description: "Short, focused rounds that help you organise clinical knowledge and say it clearly.",
};

export const viewport: Viewport = {
  themeColor: "#14271a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${satoshi.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
