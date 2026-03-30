import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "findmydiamond — UK Diamond Price Check",
  description:
    "Check if you're getting a fair price on a UK diamond. Compare prices from trusted UK jewellers and find the best deals on GIA and IGI certified diamonds.",
  openGraph: {
    title: "findmydiamond — UK Diamond Price Check",
    description:
      "Compare diamond prices from UK jewellers. Get a fair price estimate in seconds.",
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
