import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // <--- Import this

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "CareerFlow",
  description: "Track your job applications",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Wrap the HTML in ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} ${outfit.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
