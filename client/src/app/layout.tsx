import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Professional Font
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobPortal - Find Your Dream Job",
  description: "The most professional platform for connecting talent with opportunity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)] bg-gray-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
