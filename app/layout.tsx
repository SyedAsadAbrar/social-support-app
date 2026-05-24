import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Support Application",
  description: "Apply for financial assistance with guided support."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
