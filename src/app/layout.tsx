import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "findmydiamond — Diamond Price Comparison",
  description:
    "Check if you're getting a fair price on a diamond. Compare prices from trusted jewellers and find the best deals on GIA and IGI certified diamonds in GBP.",
  openGraph: {
    title: "findmydiamond — Diamond Price Comparison",
    description:
      "Compare diamond prices from trusted jewellers. Get a fair price estimate in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
