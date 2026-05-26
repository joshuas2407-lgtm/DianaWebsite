import type { Metadata } from "next";
import { OwnerProvider } from "@/context/OwnerContext";
import { OwnerBar } from "@/components/OwnerBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diana",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OwnerProvider>
          <OwnerBar />
          {children}
        </OwnerProvider>
      </body>
    </html>
  );
}
