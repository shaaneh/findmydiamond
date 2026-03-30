import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "findmydiamond — UK Diamond Price Check",
  description:
    "Check if you're getting a fair price on a UK diamond. Compare prices from UK jewellers and find the best deals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
