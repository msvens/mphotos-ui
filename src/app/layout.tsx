import { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/app/LayoutProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MPhotos",
  description: "A modern photo blog application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-white dark:bg-dark-bg`}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
